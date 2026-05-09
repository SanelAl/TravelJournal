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
	Aktivitaeten: '#2f9c95',
	Aktivitäten: '#2f9c95',
	Sonstiges: '#e56b6f'
};

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
			time: activity.time || '--:--',
			title: activity.title || 'Aktivitaet ohne Titel',
			place: activity.place || 'Ort offen',
			description: activity.note || 'Keine Notiz erfasst.',
			rawDate: toDate(activity.date)?.toISOString() ?? ''
		}))
		.sort((a, b) => a.rawDate.localeCompare(b.rawDate) || a.time.localeCompare(b.time));
}

function mapExpenses(expenses = []) {
	return expenses.map((expense, index) => ({
		id: expense._id?.toString?.() ?? `${index}`,
		category: expense.category || 'Sonstiges',
		date: formatDate(expense.date),
		amount: Number(expense.amount ?? 0),
		note: expense.note || '',
		color: EXPENSE_COLORS[expense.category] ?? EXPENSE_COLORS.Sonstiges
	}));
}

function mapComments(comments = []) {
	return comments.map((comment, index) => ({
		id: comment._id?.toString?.() ?? `${index}`,
		author: 'Kommentar',
		date: formatDate(comment.date),
		text: comment.text || comment.note || 'Kein Kommentartext erfasst.'
	}));
}

function getNextActivity(activities) {
	if (activities.length === 0) {
		return 'Noch keine Aktivitaet erfasst';
	}

	const today = new Date();
	const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
	const upcoming = activities.find((activity) => {
		const date = toDate(activity.rawDate);
		return date && date >= todayUtc;
	});
	const activity = upcoming ?? activities[0];
	const time = activity.time && activity.time !== '--:--' ? `, ${activity.time}` : '';

	return `${activity.date}${time} - ${activity.title}`;
}

function mapTravelToDetail(travel) {
	const activities = mapActivities(travel.activities ?? []);
	const startDate = formatDate(travel.startDate);
	const endDate = formatDate(travel.endDate);

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
		schedule: {
			departure: `${startDate} - Reisebeginn`,
			nextActivity: getNextActivity(activities),
			returnFlight: `${endDate} - Reiseende`
		},
		activities,
		comments: mapComments(travel.comments ?? [])
	};
}

export async function load({ params }) {
	if (!ObjectId.isValid(params.id)) {
		return {
			trip: null,
			errorMessage: 'Diese Reise-ID ist ungueltig.'
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
