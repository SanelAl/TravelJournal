const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const DAY_IN_MS = 1000 * 60 * 60 * 24;

// One MongoDB document in Travels represents one trip owned by userId. Nested arrays hold
// trip-owned details: photos, activities, expenses and comments.
export const CONTINENTS = ['Europa', 'Asien', 'Afrika', 'Nordamerika', 'Südamerika', 'Ozeanien', 'Antarktis'];
export const CONTINENT_SET = new Set([...CONTINENTS, 'Suedamerika']);

export const EXPENSE_CATEGORIES = ['Transport', 'Unterkunft', 'Verpflegung', 'Aktivitäten', 'Sonstiges'];
export const EXPENSE_CATEGORY_SET = new Set([...EXPENSE_CATEGORIES, 'Aktivitaeten']);

export const CONTINENT_COLORS = {
	Europa: ['#8aafff', '#4169be'],
	Asien: ['#ffc857', '#4169be'],
	Afrika: ['#e56b6f', '#355070'],
	Nordamerika: ['#7bdff2', '#3a506b'],
	Südamerika: ['#f6bd60', '#6d597a'],
	Suedamerika: ['#f6bd60', '#6d597a'],
	Ozeanien: ['#2f9c95', '#4169be'],
	Antarktis: ['#d7efff', '#5d789c']
};

export const PHOTO_COLORS = [
	['#8aafff', '#4169be'],
	['#dbe7ff', '#14213d'],
	['#f6bd60', '#355070']
];

export const EXPENSE_COLORS = {
	Transport: '#4169be',
	Unterkunft: '#7c3aed',
	Verpflegung: '#f28f3b',
	Aktivitäten: '#2f9c95',
	Aktivitaeten: '#2f9c95',
	Sonstiges: '#e56b6f'
};

export function readString(formData, key) {
	return String(formData.get(key) ?? '').trim();
}

export function toDate(value) {
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

export function formatSwissDate(value, fallback = '') {
	const date = toDate(value);

	if (!date) {
		return fallback;
	}

	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const year = date.getUTCFullYear();

	return `${day}.${month}.${year}`;
}

export function parseSwissDate(value) {
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

export function getYear(value, fallback = '----') {
	const date = toDate(value);
	return date ? String(date.getUTCFullYear()) : fallback;
}

export function getDay(value) {
	const date = toDate(value);
	return date ? String(date.getUTCDate()).padStart(2, '0') : '--';
}

export function getMonth(value) {
	const date = toDate(value);
	return date ? MONTHS[date.getUTCMonth()] : '---';
}

export function getDuration(startDate, endDate) {
	const start = toDate(startDate);
	const end = toDate(endDate);

	if (!start || !end) {
		return 'Dauer offen';
	}

	const days = Math.round((end.getTime() - start.getTime()) / DAY_IN_MS) + 1;

	if (!Number.isFinite(days) || days < 1) {
		return 'Dauer offen';
	}

	return days === 1 ? '1 Tag' : `${days} Tage`;
}

export function formatBudget(amount) {
	const budget = Number(amount ?? 0);
	return `CHF ${budget.toLocaleString('de-CH', { maximumFractionDigits: 0 })}`;
}

export function safePublicId(value) {
	return value
		.toLowerCase()
		.replace(/\.[^.]+$/, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '')
		.slice(0, 48);
}

export function valuesFromTravelForm(formData) {
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

export function validateTravelForm(values) {
	const errors = {};

	if (!values.place) {
		errors.place = 'Bitte Ort erfassen.';
	}

	if (!CONTINENT_SET.has(values.continent)) {
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

export function createTravelDocument(values, parsedValues, userId) {
	const now = new Date();

	return {
		userId,
		place: values.place,
		continent: values.continent,
		shortNote: values.shortNote,
		startDate: parsedValues.startDate,
		endDate: parsedValues.endDate,
		isActive: values.status === 'active',
		isPublic: values.visibility === 'public',
		budgetTotal: parsedValues.budgetTotal,
		photos: [],
		notes: '',
		activities: [],
		expenses: [],
		comments: [],
		createdAt: now,
		updatedAt: now
	};
}

export function travelBaseUpdate(values, parsedValues) {
	return {
		place: values.place,
		continent: values.continent,
		shortNote: values.shortNote,
		startDate: parsedValues.startDate,
		endDate: parsedValues.endDate,
		isActive: values.status === 'active',
		isPublic: values.visibility === 'public',
		budgetTotal: parsedValues.budgetTotal,
		updatedAt: new Date()
	};
}

export function getRandomPreviewPhoto(photos = []) {
	const validPhotos = photos.filter((photo) => photo?.url);

	if (validPhotos.length === 0) {
		return null;
	}

	return validPhotos[Math.floor(Math.random() * validPhotos.length)];
}

export function mapPhotosForDetail(photos = []) {
	return photos.map((photo, index) => ({
		id: photo._id?.toString?.() ?? `${index}`,
		label: photo.name || `Foto ${index + 1}`,
		date: formatSwissDate(photo.date, 'Noch nicht erfasst'),
		url: photo.url || '',
		colors: PHOTO_COLORS[index % PHOTO_COLORS.length]
	}));
}

export function mapPhotosForGallery(photos = []) {
	return photos.map((photo, index) => ({
		id: photo._id?.toString?.() ?? `${index}`,
		name: photo.name || `Foto ${index + 1}`,
		url: photo.url || '',
		publicId: photo.publicId || ''
	}));
}

export function mapActivitiesForDetail(activities = []) {
	return activities
		.map((activity, index) => ({
			id: activity._id?.toString?.() ?? `${index}`,
			date: formatSwissDate(activity.date, 'Noch nicht erfasst'),
			day: getDay(activity.date),
			month: getMonth(activity.date),
			title: activity.title || 'Aktivität ohne Titel',
			place: activity.place || 'Ort offen',
			description: activity.note || 'Keine Notiz erfasst.',
			rawDate: toDate(activity.date)?.toISOString() ?? ''
		}))
		.sort((a, b) => a.rawDate.localeCompare(b.rawDate) || a.title.localeCompare(b.title));
}

export function mapExpensesForDetail(expenses = []) {
	return expenses.map((expense, index) => ({
		id: expense._id?.toString?.() ?? `${index}`,
		category: expense.category || 'Sonstiges',
		amount: Number(expense.amount ?? 0),
		description: expense.description || expense.note || '',
		color: EXPENSE_COLORS[expense.category] ?? EXPENSE_COLORS.Sonstiges
	}));
}

export function mapCommentsForDetail(comments = []) {
	return comments
		.map((comment, index) => ({
			id: comment._id?.toString?.() ?? `${index}`,
			date: formatSwissDate(comment.date, 'Noch nicht erfasst'),
			text: comment.text || comment.note || 'Kein Kommentartext erfasst.',
			displayName: comment.displayName || '',
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

export function getSchedule(travel, activities) {
	const startDate = formatSwissDate(travel.startDate, 'Noch nicht erfasst');
	const endDate = formatSwissDate(travel.endDate, 'Noch nicht erfasst');
	const nextActivity = Boolean(travel.isActive) ? getNextActivity(activities) : null;

	return {
		firstLabel: nextActivity ? 'Nächste Aktivität' : 'Hinreise',
		firstValue: nextActivity ?? `${startDate} - Hinreise`,
		returnValue: `${endDate} - Rueckreise`
	};
}

export function mapTravelToCard(travel) {
	const startDate = toDate(travel.startDate);
	const endDate = toDate(travel.endDate);
	const continent = travel.continent || 'Europa';
	const previewPhoto = getRandomPreviewPhoto(travel.photos ?? []);

	return {
		id: travel._id.toString(),
		place: travel.place || 'Unbekannter Ort',
		year: getYear(startDate, ''),
		date: `${formatSwissDate(startDate)} - ${formatSwissDate(endDate)}`,
		duration: getDuration(startDate, endDate),
		continent,
		visibility: travel.isPublic ? 'Oeffentlich' : 'Privat',
		budget: formatBudget(travel.budgetTotal),
		description: travel.shortNote || 'Noch keine Kurznotiz erfasst.',
		previewLabel: continent,
		previewUrl: previewPhoto?.url || '',
		previewAlt: previewPhoto?.name || `${travel.place || 'Reise'} Foto`,
		colors: CONTINENT_COLORS[continent] ?? ['#8aafff', '#4169be']
	};
}

export function mapTravelToDetail(travel) {
	const activities = mapActivitiesForDetail(travel.activities ?? []);

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
		photos: mapPhotosForDetail(travel.photos ?? []),
		expenses: mapExpensesForDetail(travel.expenses ?? []),
		schedule: getSchedule(travel, activities),
		activities,
		comments: mapCommentsForDetail(travel.comments ?? [])
	};
}

export function mapTravelToPhotosPage(travel) {
	return {
		id: travel._id.toString(),
		place: travel.place || 'Unbekannter Ort',
		year: getYear(travel.startDate),
		photos: mapPhotosForGallery(travel.photos ?? [])
	};
}

export function mapTravelToForm(travel) {
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
