import { fail, redirect } from '@sveltejs/kit';
import { getTravelsCollection } from '$lib/server/db.js';
import { ObjectId } from 'mongodb';

const CONTINENTS = new Set(['Europa', 'Asien', 'Afrika', 'Nordamerika', 'Suedamerika', 'Ozeanien', 'Antarktis']);

function readString(formData, key) {
	return String(formData.get(key) ?? '').trim();
}

function toDate(value) {
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function formatSwissDate(value) {
	const date = toDate(value);

	if (!date) {
		return '';
	}

	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const year = date.getUTCFullYear();

	return `${day}.${month}.${year}`;
}

function getYear(value) {
	const date = toDate(value);
	return date ? String(date.getUTCFullYear()) : '----';
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

function validateValues(values) {
	const errors = {};

	if (!values.place) {
		errors.place = 'Bitte Ort erfassen.';
	}

	if (!CONTINENTS.has(values.continent)) {
		errors.continent = 'Bitte Kontinent auswaehlen.';
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
		errors.budget = 'Bitte ein gueltiges Budget erfassen.';
	}

	if (!['active', 'completed'].includes(values.status)) {
		errors.status = 'Ungueltiger Status.';
	}

	if (!['private', 'public'].includes(values.visibility)) {
		errors.visibility = 'Ungueltige Sichtbarkeit.';
	}

	return {
		errors,
		startDate,
		endDate,
		budgetTotal
	};
}

function mapTravelToForm(travel) {
	return {
		id: travel._id.toString(),
		place: travel.place || '',
		year: getYear(travel.startDate),
		continent: travel.continent || '',
		shortNote: travel.shortNote || '',
		startDate: formatSwissDate(travel.startDate),
		endDate: formatSwissDate(travel.endDate),
		status: travel.isActive ? 'active' : 'completed',
		visibility: travel.isPublic ? 'public' : 'private',
		budget: String(Number(travel.budgetTotal ?? 0))
	};
}

function idFrom(params) {
	return ObjectId.isValid(params.id) ? new ObjectId(params.id) : null;
}

export async function load({ params }) {
	const objectId = idFrom(params);

	if (!objectId) {
		return {
			trip: null,
			errorMessage: 'Diese Reise-ID ist ungueltig.'
		};
	}

	try {
		const travels = await getTravelsCollection();
		const travel = await travels.findOne({ _id: objectId });

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
	save: async ({ params, request }) => {
		const objectId = idFrom(params);

		if (!objectId) {
			return fail(400, {
				errors: { form: 'Diese Reise-ID ist ungueltig.' },
				values: {}
			});
		}

		const formData = await request.formData();
		const values = valuesFrom(formData);
		const { errors, startDate, endDate, budgetTotal } = validateValues(values);

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values });
		}

		try {
			const travels = await getTravelsCollection();
			const result = await travels.updateOne(
				{ _id: objectId },
				{
					$set: {
						place: values.place,
						continent: values.continent,
						shortNote: values.shortNote,
						startDate,
						endDate,
						isActive: values.status === 'active',
						isPublic: values.visibility === 'public',
						budgetTotal,
						updatedAt: new Date()
					}
				}
			);

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

	delete: async ({ params }) => {
		const objectId = idFrom(params);

		if (!objectId) {
			throw redirect(303, '/trips');
		}

		try {
			const travels = await getTravelsCollection();
			await travels.deleteOne({ _id: objectId });
		} catch (error) {
			console.error('Failed to delete travel:', error);
			return fail(500, {
				errors: { delete: 'Die Reise konnte nicht geloescht werden. Bitte versuche es erneut.' }
			});
		}

		throw redirect(303, '/trips');
	}
};
