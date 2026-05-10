import { fail, redirect } from '@sveltejs/kit';
import { getTravelsCollection } from '$lib/server/db.js';
import {
	createTravelDocument,
	validateTravelForm,
	valuesFromTravelForm
} from '$lib/server/travel-model.js';

export const actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const values = valuesFromTravelForm(formData);
		const parsedValues = validateTravelForm(values);

		if (Object.keys(parsedValues.errors).length > 0) {
			return fail(400, { errors: parsedValues.errors, values });
		}

		const document = createTravelDocument(values, parsedValues, locals.user.objectId);

		try {
			const travels = await getTravelsCollection();
			const result = await travels.insertOne(document);

			throw redirect(303, `/trips/${result.insertedId.toString()}`);
		} catch (error) {
			if (error?.status === 303) {
				throw error;
			}

			console.error('Failed to create travel', error);
			return fail(500, {
				errors: {
					form: 'Die Reise konnte nicht gespeichert werden. Bitte versuche es erneut.'
				},
				values
			});
		}
	}
};
