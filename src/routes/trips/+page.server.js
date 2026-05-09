import { getTravelsCollection } from '$lib/server/db.js';

const CONTINENT_COLORS = {
	Europa: ['#8aafff', '#4169be'],
	Asien: ['#ffc857', '#4169be'],
	Afrika: ['#e56b6f', '#355070'],
	Nordamerika: ['#7bdff2', '#3a506b'],
	Suedamerika: ['#f6bd60', '#6d597a'],
	Ozeanien: ['#2f9c95', '#4169be'],
	Antarktis: ['#d7efff', '#5d789c']
};

const CONTINENTS = ['Europa', 'Asien', 'Afrika', 'Nordamerika', 'Suedamerika', 'Ozeanien', 'Antarktis'];
const DAY_IN_MS = 1000 * 60 * 60 * 24;

function normalizeSort(value) {
	return value === 'oldest' ? 'oldest' : 'newest';
}

function normalizeContinent(value) {
	return CONTINENTS.includes(value) ? value : 'all';
}

function formatDate(date) {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
		return '';
	}

	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const year = date.getUTCFullYear();

	return `${day}.${month}.${year}`;
}

function getYear(date) {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
		return '';
	}

	return String(date.getUTCFullYear());
}

function getDuration(startDate, endDate) {
	if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
		return 'Dauer offen';
	}

	const days = Math.round((endDate.getTime() - startDate.getTime()) / DAY_IN_MS) + 1;

	if (!Number.isFinite(days) || days < 1) {
		return 'Dauer offen';
	}

	return days === 1 ? '1 Tag' : `${days} Tage`;
}

function formatBudget(amount) {
	const budget = Number(amount ?? 0);

	return `CHF ${budget.toLocaleString('de-CH', { maximumFractionDigits: 0 })}`;
}

function mapTravelToCard(travel) {
	const startDate = travel.startDate instanceof Date ? travel.startDate : new Date(travel.startDate);
	const endDate = travel.endDate instanceof Date ? travel.endDate : new Date(travel.endDate);
	const continent = travel.continent || 'Europa';

	return {
		id: travel._id.toString(),
		place: travel.place || 'Unbekannter Ort',
		year: getYear(startDate),
		date: `${formatDate(startDate)} - ${formatDate(endDate)}`,
		duration: getDuration(startDate, endDate),
		continent,
		visibility: travel.isPublic ? 'Oeffentlich' : 'Privat',
		budget: formatBudget(travel.budgetTotal),
		description: travel.shortNote || 'Noch keine Kurznotiz erfasst.',
		previewLabel: continent,
		colors: CONTINENT_COLORS[continent] ?? ['#8aafff', '#4169be']
	};
}

export async function load({ url }) {
	const sort = normalizeSort(url.searchParams.get('sort'));
	const continent = normalizeContinent(url.searchParams.get('continent'));
	const query = continent === 'all' ? {} : { continent };
	const sortDirection = sort === 'oldest' ? 1 : -1;

	try {
		const collection = await getTravelsCollection();
		const travels = await collection.find(query).sort({ startDate: sortDirection }).toArray();

		return {
			trips: travels.map(mapTravelToCard),
			filters: {
				sort,
				continent
			},
			continents: CONTINENTS,
			loadError: ''
		};
	} catch (error) {
		console.error('Failed to load travels:', error);

		return {
			trips: [],
			filters: {
				sort,
				continent
			},
			continents: CONTINENTS,
			loadError: 'Reisen konnten nicht aus MongoDB geladen werden.'
		};
	}
}
