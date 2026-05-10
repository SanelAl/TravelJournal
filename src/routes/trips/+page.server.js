import { getTravelsCollection } from '$lib/server/db.js';
import { CONTINENTS, mapTravelToCard } from '$lib/server/travel-model.js';

function normalizeSort(value) {
	return value === 'oldest' ? 'oldest' : 'newest';
}

function normalizeContinent(value) {
	return CONTINENTS.includes(value) ? value : 'all';
}

export async function load({ locals, url }) {
	const sort = normalizeSort(url.searchParams.get('sort'));
	const continent = normalizeContinent(url.searchParams.get('continent'));
	const query = continent === 'all' ? { userId: locals.user.objectId } : { userId: locals.user.objectId, continent };
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
