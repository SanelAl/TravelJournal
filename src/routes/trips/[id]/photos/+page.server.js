import { fail, redirect } from '@sveltejs/kit';
import { deleteImage, uploadImageBuffer } from '$lib/server/cloudinary.js';
import { getTravelsCollection } from '$lib/server/db.js';
import { ObjectId } from 'mongodb';

function toDate(value) {
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function getYear(value) {
	const date = toDate(value);
	return date ? String(date.getUTCFullYear()) : '----';
}

function mapPhotos(photos = []) {
	return photos.map((photo, index) => ({
		id: photo._id?.toString?.() ?? `${index}`,
		name: photo.name || `Foto ${index + 1}`,
		url: photo.url || '',
		publicId: photo.publicId || ''
	}));
}

function mapTravelToPhotosPage(travel) {
	return {
		id: travel._id.toString(),
		place: travel.place || 'Unbekannter Ort',
		year: getYear(travel.startDate),
		photos: mapPhotos(travel.photos ?? [])
	};
}

function readString(formData, key) {
	return String(formData.get(key) ?? '').trim();
}

function safePublicId(value) {
	return value
		.toLowerCase()
		.replace(/\.[^.]+$/, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '')
		.slice(0, 48);
}

export async function load({ params }) {
	if (!ObjectId.isValid(params.id)) {
		return {
			trip: null,
			errorMessage: 'Diese Reise-ID ist ungültig.'
		};
	}

	try {
		const collection = await getTravelsCollection();
		const travel = await collection.findOne(
			{ _id: new ObjectId(params.id) },
			{ projection: { place: 1, startDate: 1, photos: 1 } }
		);

		if (!travel) {
			return {
				trip: null,
				errorMessage: 'Diese Reise wurde nicht gefunden.'
			};
		}

		return {
			trip: mapTravelToPhotosPage(travel),
			errorMessage: ''
		};
	} catch (error) {
		console.error('Failed to load travel photos:', error);

		return {
			trip: null,
			errorMessage: 'Die Fotos konnten nicht geladen werden.'
		};
	}
}

export const actions = {
	addPhoto: async ({ params, request }) => {
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
				{ _id: new ObjectId(params.id) },
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

		throw redirect(303, `/trips/${params.id}/photos`);
	},

	deletePhoto: async ({ params, request }) => {
		const formData = await request.formData();
		const photoId = readString(formData, 'photoId');

		if (!ObjectId.isValid(params.id) || !ObjectId.isValid(photoId)) {
			return fail(400, {
				errors: { photo: 'Diese Foto-ID ist unültig.' }
			});
		}

		try {
			const collection = await getTravelsCollection();
			const travel = await collection.findOne(
				{ _id: new ObjectId(params.id), 'photos._id': new ObjectId(photoId) },
				{ projection: { 'photos.$': 1 } }
			);
			const photo = travel?.photos?.[0];

			if (!photo) {
				return fail(404, {
					errors: { photo: 'Dieses Foto wurde nicht gefunden.' }
				});
			}

			if (photo.publicId) {
				await deleteImage(photo.publicId);
			}

			await collection.updateOne(
				{ _id: new ObjectId(params.id) },
				{
					$pull: {
						photos: { _id: new ObjectId(photoId) }
					},
					$set: {
						updatedAt: new Date()
					}
				}
			);
		} catch (error) {
			console.error('Failed to delete photo:', error);
			return fail(500, {
				errors: { photo: 'Das Foto konnte nicht gelöscht werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/trips/${params.id}/photos`);
	},

	deleteSelectedPhotos: async ({ params, request }) => {
		const formData = await request.formData();
		const photoIds = formData.getAll('photoIds').map((value) => String(value).trim()).filter(Boolean);

		if (!ObjectId.isValid(params.id) || photoIds.some((photoId) => !ObjectId.isValid(photoId))) {
			return fail(400, {
				errors: { photo: 'Mindestens eine Foto-ID ist ungültig.' }
			});
		}

		if (photoIds.length === 0) {
			return fail(400, {
				errors: { photo: 'Bitte mindestens ein Foto auswählen.' }
			});
		}

		const objectPhotoIds = photoIds.map((photoId) => new ObjectId(photoId));

		try {
			const collection = await getTravelsCollection();
			const travel = await collection.findOne(
				{ _id: new ObjectId(params.id) },
				{ projection: { photos: 1 } }
			);
			const photos = (travel?.photos ?? []).filter((photo) =>
				objectPhotoIds.some((photoId) => photoId.equals(photo._id))
			);

			if (photos.length === 0) {
				return fail(404, {
					errors: { photo: 'Die ausgewählten Fotos wurden nicht gefunden.' }
				});
			}

			await Promise.all(photos.filter((photo) => photo.publicId).map((photo) => deleteImage(photo.publicId)));

			await collection.updateOne(
				{ _id: new ObjectId(params.id) },
				{
					$pull: {
						photos: { _id: { $in: objectPhotoIds } }
					},
					$set: {
						updatedAt: new Date()
					}
				}
			);
		} catch (error) {
			console.error('Failed to delete selected photos:', error);
			return fail(500, {
				errors: { photo: 'Die Fotos konnten nicht gelöscht werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, `/trips/${params.id}/photos`);
	}
};
