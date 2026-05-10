import { fail, redirect } from '@sveltejs/kit';
import { getTravelsCollection } from '$lib/server/db.js';
import { ObjectId } from 'mongodb';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

const PHOTO_COLORS = [
	['#8aafff', '#4169be'],
	['#dbe7ff', '#14213d'],
	['#f6bd60', '#355070']
];

const EXPENSE_COLORS = {
	Transport: '#4169be',
	Unterkunft: '#7c3aed',
	Verpflegung: '#f28f3b',
	Aktivitäten: '#2f9c95',
	Aktivitäten: '#2f9c95',
	Sonstiges: '#e56b6f'
};

const EXPENSE_CATEGORIES = new Set(['Transport', 'Unterkunft', 'Verpflegung', 'Aktivitäten', 'Sonstiges']);

function toDate(value) {
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
	const date = toDate(value);

	if (!date) {
		return 'Noch nicht erfasst';
	}

	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const year = date.getUTCFullYear();

	return `${day}.${month}.${year}`;
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

function getYear(value) {
	const date = toDate(value);
	return date ? String(date.getUTCFullYear()) : '----';
}

function getDay(value) {
	const date = toDate(value);
	return date ? String(date.getUTCDate()).padStart(2, '0') : '--';
}

function getMonth(value) {
	const date = toDate(value);
	return date ? MONTHS[date.getUTCMonth()] : '---';
}

function mapPhotos(photos = []) {
	return photos.map((photo, index) => ({
		id: photo._id?.toString?.() ?? `${index}`,
		label: photo.name || `Foto ${index + 1}`,
		date: formatDate(photo.date),
		url: photo.url || '',
		colors: PHOTO_COLORS[index % PHOTO_COLORS.length]
	}));
}

function mapActivities(activities = []) {
	return activities
		.map((activity, index) => ({
			id: activity._id?.toString?.() ?? `${index}`,
			date: formatDate(activity.date),
			day: getDay(activity.date),
			month: getMonth(activity.date),
			title: activity.title || 'Aktivität ohne Titel',
			place: activity.place || 'Ort offen',
			description: activity.note || 'Keine Notiz erfasst.',
			rawDate: toDate(activity.date)?.toISOString() ?? ''
		}))
		.sort((a, b) => a.rawDate.localeCompare(b.rawDate) || a.title.localeCompare(b.title));
}

function mapExpenses(expenses = []) {
	return expenses.map((expense, index) => ({
		id: expense._id?.toString?.() ?? `${index}`,
		category: expense.category || 'Sonstiges',
		amount: Number(expense.amount ?? 0),
		description: expense.description || expense.note || '',
		color: EXPENSE_COLORS[expense.category] ?? EXPENSE_COLORS.Sonstiges
	}));
}

function mapComments(comments = []) {
	return comments
		.map((comment, index) => ({
			id: comment._id?.toString?.() ?? `${index}`,
			date: formatDate(comment.date),
			text: comment.text || comment.note || 'Kein Kommentartext erfasst.',
			rawDate: toDate(comment.date)?.toISOString() ?? ''
		}))
		.sort((a, b) => b.rawDate.localeCompare(a.rawDate));
}

function getNextActivity(activities) {
	if (activities.length === 0) {
		return null;
	}

	const today = new Date();
	const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
	const upcoming = activities.find((activity) => {
		const date = toDate(activity.rawDate);
		return date && date >= todayUtc;
	});
	const activity = upcoming ?? activities[0];

	return `${activity.date} - ${activity.title}`;
}

function getSchedule(travel, activities) {
	const startDate = formatDate(travel.startDate);
	const endDate = formatDate(travel.endDate);
	const nextActivity = Boolean(travel.isActive) ? getNextActivity(activities) : null;

	return {
		firstLabel: nextActivity ? 'Nächste Aktivität' : 'Hinreise',
		firstValue: nextActivity ?? `${startDate} - Hinreise`,
		returnValue: `${endDate} - Rückreise`
	};
}

function readString(formData, key) {
	return String(formData.get(key) ?? '').trim();
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

	if (!EXPENSE_CATEGORIES.has(values.category)) {
		errors.expense = 'Bitte Kategorie auswählen.';
	}

	if (!Number.isFinite(amount) || amount < 0) {
		errors.expense = 'Bitte einen gültigen Betrag erfassen.';
	}

	return { errors, amount };
}

function mapTravelToDetail(travel) {
	const activities = mapActivities(travel.activities ?? []);

	return {
		id: travel._id.toString(),
		place: travel.place || 'Unbekannter Ort',
		year: getYear(travel.startDate),
		continent: travel.continent || 'TravelJournal',
		isActive: Boolean(travel.isActive),
		isPublic: Boolean(travel.isPublic),
		description: travel.shortNote || 'Noch keine Kurznotiz erfasst.',
		notes: travel.notes || '',
		budgetTotal: Number(travel.budgetTotal ?? 0),
		photos: mapPhotos(travel.photos ?? []),
		expenses: mapExpenses(travel.expenses ?? []),
		schedule: getSchedule(travel, activities),
		activities,
		comments: mapComments(travel.comments ?? [])
	};
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
		const travel = await collection.findOne({ _id: new ObjectId(params.id) });

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
	saveNotes: async ({ params, request }) => {
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
				{ _id: new ObjectId(params.id) },
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

	addActivity: async ({ params, request }) => {
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
				{ _id: new ObjectId(params.id) },
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

	updateActivity: async ({ params, request }) => {
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
				{ _id: new ObjectId(params.id), 'activities._id': new ObjectId(values.id) },
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

	deleteActivity: async ({ params, request }) => {
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
				{ _id: new ObjectId(params.id) },
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

	addExpense: async ({ params, request }) => {
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
				{ _id: new ObjectId(params.id) },
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

	updateExpense: async ({ params, request }) => {
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
				{ _id: new ObjectId(params.id), 'expenses._id': new ObjectId(values.id) },
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

	deleteExpense: async ({ params, request }) => {
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
				{ _id: new ObjectId(params.id) },
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

	addComment: async ({ params, request }) => {
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
				{ _id: new ObjectId(params.id) },
				{
					$push: {
						comments: {
							_id: new ObjectId(),
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

	deleteComment: async ({ params, request }) => {
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
				{ _id: new ObjectId(params.id) },
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
