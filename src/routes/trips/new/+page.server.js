import { fail, redirect } from '@sveltejs/kit';
import { getTravelsCollection } from '$lib/server/db.js';

const CONTINENTS = new Set(['Europa', 'Asien', 'Afrika', 'Nordamerika', 'Südamerika', 'Ozeanien', 'Antarktis']);

function readString(formData, key) {
	return String(formData.get(key) ?? '').trim();
}

function parseSwissDate(value) {
	const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);

	if (!match) {
		return null;
	}

	const [, day, month, year] = match;
	const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

	if (
		date.getUTCFullYear() !== Number(year) ||
		date.getUTCMonth() !== Number(month) - 1 ||
		date.getUTCDate() !== Number(day)
	) {
		return null;
	}

	return date;
}

function valuesFrom(formData) {
	return {
		place: readString(formData, 'place'),
		continent: readString(formData, 'continent'),
		shortNote: readString(formData, 'shortNote'),
		startDate: readString(formData, 'startDate'),
		endDate: readString(formData, 'endDate'),
		status: readString(formData, 'status') || 'active',
		visibility: readString(formData, 'visibility') || 'private',
		budget: readString(formData, 'budget')
	};
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const values = valuesFrom(formData);
		const errors = {};

		if (!values.place) {
			errors.place = 'Bitte Ort erfassen.';
		}

		if (!CONTINENTS.has(values.continent)) {
			errors.continent = 'Bitte Kontinent auswählen.';
		}

		const startDate = parseSwissDate(values.startDate);
		const endDate = parseSwissDate(values.endDate);

		if (!startDate) {
			errors.startDate = 'Bitte Datum im Format dd.mm.yyyy erfassen.';
		}

		if (!endDate) {
			errors.endDate = 'Bitte Datum im Format dd.mm.yyyy erfassen.';
		}

		if (startDate && endDate && endDate < startDate) {
			errors.endDate = 'Das Enddatum darf nicht vor dem Startdatum liegen.';
		}

		const budgetTotal = values.budget ? Number(values.budget) : 0;

		if (!Number.isFinite(budgetTotal) || budgetTotal < 0) {
			errors.budget = 'Bitte ein gültiges Budget erfassen.';
		}

		if (!['active', 'completed'].includes(values.status)) {
			errors.status = 'Ungültiger Status.';
		}

		if (!['private', 'public'].includes(values.visibility)) {
			errors.visibility = 'Ungültige Sichtbarkeit.';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values });
		}

		const now = new Date();
		const document = {
			place: values.place,
			continent: values.continent,
			shortNote: values.shortNote,
			startDate,
			endDate,
			isActive: values.status === 'active',
			isPublic: values.visibility === 'public',
			budgetTotal,
			photos: [],
			notes: '',
			activities: [],
			expenses: [],
			comments: [],
			createdAt: now,
			updatedAt: now
		};

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
