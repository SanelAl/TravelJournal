import { fail, redirect } from '@sveltejs/kit';
import { getTravelsCollection } from '$lib/server/db.js';
import {
	mapTravelToForm,
	travelBaseUpdate,
	validateTravelForm,
	valuesFromTravelForm
} from '$lib/server/travel-model.js';
import { ObjectId } from 'mongodb';

function idFrom(params) {
	return ObjectId.isValid(params.id) ? new ObjectId(params.id) : null;
}

function travelQuery(objectId, locals) {
	return { _id: objectId, userId: locals.user.objectId };
}

export async function load({ locals, params }) {
	const objectId = idFrom(params);

	if (!objectId) {
		return {
			trip: null,
			errorMessage: 'Diese Reise-ID ist ungueltig.'
		};
	}

	try {
		const travels = await getTravelsCollection();
		const travel = await travels.findOne(travelQuery(objectId, locals));

		if (!travel) {
			return {
				trip: null,
				errorMessage: 'Diese Reise wurde nicht gefunden.'
			};
		}

		return {
			trip: mapTravelToForm(travel),
			errorMessage: ''
		};
	} catch (error) {
		console.error('Failed to load travel for editing:', error);

		return {
			trip: null,
			errorMessage: 'Die Reise konnte nicht aus MongoDB geladen werden.'
		};
	}
}

export const actions = {
	save: async ({ locals, params, request }) => {
		const objectId = idFrom(params);

		if (!objectId) {
			return fail(400, {
				errors: { form: 'Diese Reise-ID ist ungueltig.' },
				values: {}
			});
		}

		const formData = await request.formData();
		const values = valuesFromTravelForm(formData);
		const parsedValues = validateTravelForm(values);

		if (Object.keys(parsedValues.errors).length > 0) {
			return fail(400, { errors: parsedValues.errors, values });
		}

		try {
			const travels = await getTravelsCollection();
			const result = await travels.updateOne(travelQuery(objectId, locals), {
				$set: travelBaseUpdate(values, parsedValues)
			});

			if (result.matchedCount === 0) {
				return fail(404, {
					errors: { form: 'Diese Reise wurde nicht gefunden.' },
					values
				});
			}
		} catch (error) {
			console.error('Failed to update travel:', error);
			return fail(500, {
				errors: { form: 'Die Reise konnte nicht gespeichert werden. Bitte versuche es erneut.' },
				values
			});
		}

		throw redirect(303, `/trips/${params.id}`);
	},

	delete: async ({ locals, params }) => {
		const objectId = idFrom(params);

		if (!objectId) {
			throw redirect(303, '/trips');
		}

		try {
			const travels = await getTravelsCollection();
			await travels.deleteOne(travelQuery(objectId, locals));
		} catch (error) {
			console.error('Failed to delete travel:', error);
			return fail(500, {
				errors: { delete: 'Die Reise konnte nicht geloescht werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, '/trips');
	}
};
