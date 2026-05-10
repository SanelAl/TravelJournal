import { fail, redirect } from '@sveltejs/kit';
import { getTravelsCollection, getUsersCollection } from '$lib/server/db.js';
import { formatSwissDate, mapTravelToDetail, readString, toDate } from '$lib/server/travel-model.js';
import { ObjectId } from 'mongodb';

function publicTravelQuery(params, locals) {
	return {
		_id: new ObjectId(params.id),
		isPublic: true,
		userId: {
			$exists: true,
			$ne: locals.user.objectId
		}
	};
}

function objectIdString(value) {
	if (!value) {
		return '';
	}

	if (value instanceof ObjectId) {
		return value.toString();
	}

	return ObjectId.isValid(value) ? new ObjectId(value).toString() : '';
}

function canDeleteComment(comment, travel, locals) {
	const commentUserId = objectIdString(comment.userId);
	const ownerId = objectIdString(travel.userId);
	const viewerId = locals.user.id;

	return locals.user.role === 'admin' || commentUserId === viewerId || (!commentUserId && ownerId === viewerId);
}

async function mapPublicTrip(travel, locals) {
	const users = await getUsersCollection();
	const owner = await users.findOne({ _id: travel.userId }, { projection: { displayName: 1 } });
	const commentUserIds = [
		...new Set((travel.comments ?? []).map((comment) => objectIdString(comment.userId)).filter(Boolean))
	].map((id) => new ObjectId(id));
	const commentUsers =
		commentUserIds.length === 0
			? []
			: await users.find({ _id: { $in: commentUserIds } }, { projection: { displayName: 1 } }).toArray();
	const commentUserMap = new Map(commentUsers.map((user) => [user._id.toString(), user.displayName]));
	const trip = mapTravelToDetail(travel);
	const ownerName = owner?.displayName || 'Unbekannter User';

	return {
		...trip,
		ownerId: travel.userId.toString(),
		ownerName,
		isFollowing: (locals.user.followingUserIds ?? []).some((id) => id.equals(travel.userId)),
		comments: (travel.comments ?? [])
			.map((comment, index) => {
				const commentUserId = objectIdString(comment.userId);

				return {
					id: comment._id?.toString?.() ?? `${index}`,
					date: formatSwissDate(comment.date, 'Noch nicht erfasst'),
					text: comment.text || comment.note || 'Kein Kommentartext erfasst.',
					displayName: comment.displayName || commentUserMap.get(commentUserId) || ownerName,
					canDelete: canDeleteComment(comment, travel, locals),
					rawDate: toDate(comment.date)?.toISOString() ?? ''
				};
			})
			.sort((a, b) => b.rawDate.localeCompare(a.rawDate))
	};
}

export async function load({ locals, params }) {
	if (!ObjectId.isValid(params.id)) {
		return {
			trip: null,
			errorMessage: 'Diese Reise-ID ist ungueltig.'
		};
	}

	try {
		const travels = await getTravelsCollection();
		const travel = await travels.findOne(publicTravelQuery(params, locals));

		if (!travel) {
			return {
				trip: null,
				errorMessage: 'Diese oeffentliche Reise wurde nicht gefunden.'
			};
		}

		return {
			trip: await mapPublicTrip(travel, locals),
			errorMessage: ''
		};
	} catch (error) {
		console.error('Failed to load public travel:', error);

		return {
			trip: null,
			errorMessage: 'Die oeffentliche Reise konnte nicht geladen werden.'
		};
	}
}

export const actions = {
	addComment: async ({ locals, params, request }) => {
		if (!ObjectId.isValid(params.id)) {
			return fail(400, {
				errors: { comment: 'Diese Reise-ID ist ungueltig.' }
			});
		}

		const formData = await request.formData();
		const text = readString(formData, 'commentText');

		if (!text) {
			return fail(400, {
				errors: { comment: 'Bitte Kommentar erfassen.' }
			});
		}

		try {
			const travels = await getTravelsCollection();
			const result = await travels.updateOne(publicTravelQuery(params, locals), {
				$push: {
					comments: {
						_id: new ObjectId(),
						userId: locals.user.objectId,
						displayName: locals.user.displayName,
						date: new Date(),
						text
					}
				},
				$set: {
					updatedAt: new Date()
				}
			});

			if (result.matchedCount === 0) {
				return fail(404, {
					errors: { comment: 'Diese oeffentliche Reise wurde nicht gefunden.' }
				});
			}
		} catch (error) {
			console.error('Failed to add public comment:', error);
			return fail(500, {
				errors: { comment: 'Der Kommentar konnte nicht gespeichert werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/social/trips/${params.id}`);
	},

	deleteComment: async ({ locals, params, request }) => {
		const formData = await request.formData();
		const commentId = readString(formData, 'commentId');

		if (!ObjectId.isValid(params.id) || !ObjectId.isValid(commentId)) {
			return fail(400, {
				errors: { comment: 'Diese Kommentar-ID ist ungueltig.' }
			});
		}

		try {
			const travels = await getTravelsCollection();
			const travel = await travels.findOne(publicTravelQuery(params, locals), { projection: { userId: 1, comments: 1 } });
			const comment = (travel?.comments ?? []).find((item) => objectIdString(item._id) === new ObjectId(commentId).toString());

			if (!travel || !comment) {
				return fail(404, {
					errors: { comment: 'Dieser Kommentar wurde nicht gefunden.' }
				});
			}

			if (!canDeleteComment(comment, travel, locals)) {
				return fail(403, {
					errors: { comment: 'Du kannst nur eigene Kommentare loeschen.' }
				});
			}

			await travels.updateOne(publicTravelQuery(params, locals), {
				$pull: {
					comments: { _id: new ObjectId(commentId) }
				},
				$set: {
					updatedAt: new Date()
				}
			});
		} catch (error) {
			console.error('Failed to delete public comment:', error);
			return fail(500, {
				errors: { comment: 'Der Kommentar konnte nicht geloescht werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/social/trips/${params.id}`);
	},

	toggleFollow: async ({ locals, params }) => {
		if (!ObjectId.isValid(params.id)) {
			return fail(400, {
				errors: { follow: 'Diese Reise-ID ist ungueltig.' }
			});
		}

		try {
			const travels = await getTravelsCollection();
			const users = await getUsersCollection();
			const travel = await travels.findOne(publicTravelQuery(params, locals), { projection: { userId: 1 } });

			if (!travel?.userId) {
				return fail(404, {
					errors: { follow: 'Diese oeffentliche Reise wurde nicht gefunden.' }
				});
			}

			if (travel.userId.equals(locals.user.objectId)) {
				return fail(400, {
					errors: { follow: 'Du kannst dir nicht selbst folgen.' }
				});
			}

			const isFollowing = (locals.user.followingUserIds ?? []).some((id) => id.equals(travel.userId));

			await users.updateOne(
				{ _id: locals.user.objectId },
				isFollowing
					? {
							$pull: { followingUserIds: travel.userId },
							$set: { updatedAt: new Date() }
						}
					: {
							$addToSet: { followingUserIds: travel.userId },
							$set: { updatedAt: new Date() }
						}
			);
		} catch (error) {
			console.error('Failed to toggle follow:', error);
			return fail(500, {
				errors: { follow: 'Folgen konnte nicht aktualisiert werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/social/trips/${params.id}`);
	}
};
