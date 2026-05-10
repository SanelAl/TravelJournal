import { getTravelsCollection } from '$lib/server/db.js';
import { mapTravelToPhotosPage } from '$lib/server/travel-model.js';
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

export async function load({ locals, params }) {
	if (!ObjectId.isValid(params.id)) {
		return {
			trip: null,
			errorMessage: 'Diese Reise-ID ist ungueltig.'
		};
	}

	try {
		const collection = await getTravelsCollection();
		const travel = await collection.findOne(publicTravelQuery(params, locals), {
			projection: { place: 1, startDate: 1, photos: 1 }
		});

		if (!travel) {
			return {
				trip: null,
				errorMessage: 'Diese oeffentliche Reise wurde nicht gefunden.'
			};
		}

		return {
			trip: mapTravelToPhotosPage(travel),
			errorMessage: ''
		};
	} catch (error) {
		console.error('Failed to load public travel photos:', error);

		return {
			trip: null,
			errorMessage: 'Die Fotos konnten nicht geladen werden.'
		};
	}
}
