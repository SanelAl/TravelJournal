import { fail, redirect } from '@sveltejs/kit';
import { uploadImageBuffer } from '$lib/server/cloudinary.js';
import { getTravelsCollection } from '$lib/server/db.js';
import {
	EXPENSE_CATEGORY_SET,
	mapTravelToDetail,
	parseSwissDate,
	readString,
	safePublicId
} from '$lib/server/travel-model.js';
import { ObjectId } from 'mongodb';

function travelQuery(params, locals) {
	return { _id: new ObjectId(params.id), userId: locals.user.objectId };
}

function activityValuesFrom(formData) {
	return {
		id: readString(formData, 'activityId'),
		date: readString(formData, 'activityDate'),
		title: readString(formData, 'activityTitle'),
		place: readString(formData, 'activityPlace'),
		note: readString(formData, 'activityNote')
	};
}

function validateActivity(values) {
	const errors = {};
	const date = parseSwissDate(values.date);

	if (!date) {
		errors.activity = 'Bitte Datum im Format dd.mm.yyyy erfassen.';
	}

	if (!values.title) {
		errors.activity = 'Bitte Titel erfassen.';
	}

	if (!values.place) {
		errors.activity = 'Bitte Ort erfassen.';
	}

	return { errors, date };
}

function expenseValuesFrom(formData) {
	return {
		id: readString(formData, 'expenseId'),
		category: readString(formData, 'expenseCategory'),
		amount: readString(formData, 'expenseAmount'),
		description: readString(formData, 'expenseDescription')
	};
}

function validateExpense(values) {
	const errors = {};
	const amount = values.amount ? Number(values.amount) : 0;

	if (!EXPENSE_CATEGORY_SET.has(values.category)) {
		errors.expense = 'Bitte Kategorie auswählen.';
	}

	if (!Number.isFinite(amount) || amount < 0) {
		errors.expense = 'Bitte einen gültigen Betrag erfassen.';
	}

	return { errors, amount };
}

export async function load({ locals, params }) {
	if (!ObjectId.isValid(params.id)) {
		return {
			trip: null,
			errorMessage: 'Diese Reise-ID ist ungültig.'
		};
	}

	try {
		const collection = await getTravelsCollection();
		const travel = await collection.findOne(travelQuery(params, locals));

		if (!travel) {
			return {
				trip: null,
				errorMessage: 'Diese Reise wurde nicht gefunden.'
			};
		}

		return {
			trip: mapTravelToDetail(travel),
			errorMessage: ''
		};
	} catch (error) {
		console.error('Failed to load travel detail:', error);

		return {
			trip: null,
			errorMessage: 'Die Reise konnte nicht aus MongoDB geladen werden.'
		};
	}
}

export const actions = {
	saveNotes: async ({ locals, params, request }) => {
		if (!ObjectId.isValid(params.id)) {
			return fail(400, {
				errors: {
					notes: 'Diese Reise-ID ist ungültig.'
				},
				values: {
					notes: ''
				}
			});
		}

		const formData = await request.formData();
		const notes = String(formData.get('notes') ?? '');

		try {
			const collection = await getTravelsCollection();
			const result = await collection.updateOne(
				travelQuery(params, locals),
				{
					$set: {
						notes,
						updatedAt: new Date()
					}
				}
			);

			if (result.matchedCount === 0) {
				return fail(404, {
					errors: {
						notes: 'Diese Reise wurde nicht gefunden.'
					},
					values: {
						notes
					}
				});
			}
		} catch (error) {
			console.error('Failed to save travel notes:', error);

			return fail(500, {
				errors: {
					notes: 'Die Notiz konnte nicht gespeichert werden. Bitte versuche es erneut.'
				},
				values: {
					notes
				}
			});
		}

		throw redirect(303, `/trips/${params.id}`);
	},

	addActivity: async ({ locals, params, request }) => {
		if (!ObjectId.isValid(params.id)) {
			return fail(400, {
				errors: { activity: 'Diese Reise-ID ist ungültig.' }
			});
		}

		const formData = await request.formData();
		const values = activityValuesFrom(formData);
		const { errors, date } = validateActivity(values);

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors });
		}

		try {
			const collection = await getTravelsCollection();
			const result = await collection.updateOne(
				travelQuery(params, locals),
				{
					$push: {
						activities: {
							_id: new ObjectId(),
							date,
							title: values.title,
							place: values.place,
							note: values.note
						}
					},
					$set: {
						updatedAt: new Date()
					}
				}
			);

			if (result.matchedCount === 0) {
				return fail(404, {
					errors: { activity: 'Diese Reise wurde nicht gefunden.' }
				});
			}
		} catch (error) {
			console.error('Failed to add activity:', error);
			return fail(500, {
				errors: { activity: 'Die Aktivität konnte nicht gespeichert werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/trips/${params.id}`);
	},

	updateActivity: async ({ locals, params, request }) => {
		const formData = await request.formData();
		const values = activityValuesFrom(formData);

		if (!ObjectId.isValid(params.id) || !ObjectId.isValid(values.id)) {
			return fail(400, {
				errors: { activity: 'Diese Aktivität-ID ist ungültig.' }
			});
		}

		const { errors, date } = validateActivity(values);

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors });
		}

		try {
			const collection = await getTravelsCollection();
			const result = await collection.updateOne(
				{ ...travelQuery(params, locals), 'activities._id': new ObjectId(values.id) },
				{
					$set: {
						'activities.$.date': date,
						'activities.$.title': values.title,
						'activities.$.place': values.place,
						'activities.$.note': values.note,
						updatedAt: new Date()
					}
				}
			);

			if (result.matchedCount === 0) {
				return fail(404, {
					errors: { activity: 'Diese Aktivität wurde nicht gefunden.' }
				});
			}
		} catch (error) {
			console.error('Failed to update activity:', error);
			return fail(500, {
				errors: { activity: 'Die Aktivität konnte nicht gespeichert werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/trips/${params.id}`);
	},

	deleteActivity: async ({ locals, params, request }) => {
		const formData = await request.formData();
		const activityId = readString(formData, 'activityId');

		if (!ObjectId.isValid(params.id) || !ObjectId.isValid(activityId)) {
			return fail(400, {
				errors: { activity: 'Diese Aktivität-ID ist ungültig.' }
			});
		}

		try {
			const collection = await getTravelsCollection();
			await collection.updateOne(
				travelQuery(params, locals),
				{
					$pull: {
						activities: { _id: new ObjectId(activityId) }
					},
					$set: {
						updatedAt: new Date()
					}
				}
			);
		} catch (error) {
			console.error('Failed to delete activity:', error);
			return fail(500, {
				errors: { activity: 'Die Aktivität konnte nicht gelöscht werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/trips/${params.id}`);
	},

	addExpense: async ({ locals, params, request }) => {
		if (!ObjectId.isValid(params.id)) {
			return fail(400, {
				errors: { expense: 'Diese Reise-ID ist ungültig.' }
			});
		}

		const formData = await request.formData();
		const values = expenseValuesFrom(formData);
		const { errors, amount } = validateExpense(values);

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors });
		}

		try {
			const collection = await getTravelsCollection();
			const result = await collection.updateOne(
				travelQuery(params, locals),
				{
					$push: {
						expenses: {
							_id: new ObjectId(),
							category: values.category,
							amount,
							description: values.description
						}
					},
					$set: {
						updatedAt: new Date()
					}
				}
			);

			if (result.matchedCount === 0) {
				return fail(404, {
					errors: { expense: 'Diese Reise wurde nicht gefunden.' }
				});
			}
		} catch (error) {
			console.error('Failed to add expense:', error);
			return fail(500, {
				errors: { expense: 'Die Kosten konnten nicht gespeichert werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/trips/${params.id}`);
	},

	updateExpense: async ({ locals, params, request }) => {
		const formData = await request.formData();
		const values = expenseValuesFrom(formData);

		if (!ObjectId.isValid(params.id) || !ObjectId.isValid(values.id)) {
			return fail(400, {
				errors: { expense: 'Diese Kosten-ID ist ungültig.' }
			});
		}

		const { errors, amount } = validateExpense(values);

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors });
		}

		try {
			const collection = await getTravelsCollection();
			const result = await collection.updateOne(
				{ ...travelQuery(params, locals), 'expenses._id': new ObjectId(values.id) },
				{
					$set: {
						'expenses.$.category': values.category,
						'expenses.$.amount': amount,
						'expenses.$.description': values.description,
						updatedAt: new Date()
					}
				}
			);

			if (result.matchedCount === 0) {
				return fail(404, {
					errors: { expense: 'Diese Kosten wurden nicht gefunden.' }
				});
			}
		} catch (error) {
			console.error('Failed to update expense:', error);
			return fail(500, {
				errors: { expense: 'Die Kosten konnten nicht gespeichert werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/trips/${params.id}`);
	},

	deleteExpense: async ({ locals, params, request }) => {
		const formData = await request.formData();
		const expenseId = readString(formData, 'expenseId');

		if (!ObjectId.isValid(params.id) || !ObjectId.isValid(expenseId)) {
			return fail(400, {
				errors: { expense: 'Diese Kosten-ID ist ungültig.' }
			});
		}

		try {
			const collection = await getTravelsCollection();
			await collection.updateOne(
				travelQuery(params, locals),
				{
					$pull: {
						expenses: { _id: new ObjectId(expenseId) }
					},
					$set: {
						updatedAt: new Date()
					}
				}
			);
		} catch (error) {
			console.error('Failed to delete expense:', error);
			return fail(500, {
				errors: { expense: 'Die Kosten konnten nicht gelöscht werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/trips/${params.id}`);
	},

	addComment: async ({ locals, params, request }) => {
		if (!ObjectId.isValid(params.id)) {
			return fail(400, {
				errors: { comment: 'Diese Reise-ID ist ungültig.' }
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
			const collection = await getTravelsCollection();
			const result = await collection.updateOne(
				travelQuery(params, locals),
				{
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
				}
			);

			if (result.matchedCount === 0) {
				return fail(404, {
					errors: { comment: 'Diese Reise wurde nicht gefunden.' }
				});
			}
		} catch (error) {
			console.error('Failed to add comment:', error);
			return fail(500, {
				errors: { comment: 'Der Kommentar konnte nicht gespeichert werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/trips/${params.id}`);
	},

	addPhoto: async ({ locals, params, request }) => {
		if (!ObjectId.isValid(params.id)) {
			return fail(400, {
				errors: { photo: 'Diese Reise-ID ist ungültig.' }
			});
		}

		const formData = await request.formData();
		const photoName = readString(formData, 'photoName');
		const photoFiles = formData
			.getAll('photoFile')
			.filter((photoFile) => photoFile instanceof File && photoFile.size > 0);

		if (photoFiles.length === 0) {
			return fail(400, {
				errors: { photo: 'Bitte mindestens ein Bild auswählen.' }
			});
		}

		if (photoFiles.some((photoFile) => !photoFile.type.startsWith('image/'))) {
			return fail(400, {
				errors: { photo: 'Bitte nur gültige Bilddateien auswählen.' }
			});
		}

		const folder = `traveljournal/trips/${params.id}`;
		const hasMultiplePhotos = photoFiles.length > 1;

		try {
			const photoDocs = await Promise.all(
				photoFiles.map(async (photoFile) => {
					const photoId = new ObjectId();
					const imageName = hasMultiplePhotos ? photoFile.name : photoName || photoFile.name || 'Reisefoto';
					const publicId = `${safePublicId(imageName) || 'foto'}-${photoId.toString()}`;
					const buffer = Buffer.from(await photoFile.arrayBuffer());
					const uploadResult = await uploadImageBuffer(buffer, { folder, publicId });

					return {
						_id: photoId,
						name: imageName,
						date: new Date(),
						url: uploadResult.secure_url,
						publicId: uploadResult.public_id
					};
				})
			);
			const collection = await getTravelsCollection();
			const result = await collection.updateOne(
				travelQuery(params, locals),
				{
					$push: {
						photos: { $each: photoDocs }
					},
					$set: {
						updatedAt: new Date()
					}
				}
			);

			if (result.matchedCount === 0) {
				return fail(404, {
					errors: { photo: 'Diese Reise wurde nicht gefunden.' }
				});
			}
		} catch (error) {
			console.error('Failed to upload photo:', error);
			return fail(500, {
				errors: { photo: 'Das Foto konnte nicht hochgeladen werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/trips/${params.id}`);
	},

	deleteComment: async ({ locals, params, request }) => {
		const formData = await request.formData();
		const commentId = readString(formData, 'commentId');

		if (!ObjectId.isValid(params.id) || !ObjectId.isValid(commentId)) {
			return fail(400, {
				errors: { comment: 'Diese Kommentar-ID ist ungültig.' }
			});
		}

		try {
			const collection = await getTravelsCollection();
			await collection.updateOne(
				travelQuery(params, locals),
				{
					$pull: {
						comments: { _id: new ObjectId(commentId) }
					},
					$set: {
						updatedAt: new Date()
					}
				}
			);
		} catch (error) {
			console.error('Failed to delete comment:', error);
			return fail(500, {
				errors: { comment: 'Der Kommentar konnte nicht gelöscht werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/trips/${params.id}`);
	}
};
