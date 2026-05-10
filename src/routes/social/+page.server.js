import { getTravelsCollection, getUsersCollection } from '$lib/server/db.js';
import { CONTINENTS, mapTravelToCard } from '$lib/server/travel-model.js';

function normalizeSort(value) {
	return value === 'oldest' ? 'oldest' : 'newest';
}

function normalizeContinent(value) {
	return CONTINENTS.includes(value) ? value : 'all';
}

function normalizeTab(value) {
	return value === 'following' ? 'following' : 'browse';
}

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ownerNameFor(travel, owners) {
	return owners.get(travel.userId?.toString?.())?.displayName || 'Unbekannter User';
}

export async function load({ locals, url }) {
	const sort = normalizeSort(url.searchParams.get('sort'));
	const continent = normalizeContinent(url.searchParams.get('continent'));
	const tab = normalizeTab(url.searchParams.get('tab'));
	const userSearch = String(url.searchParams.get('user') ?? '').trim();
	const sortDirection = sort === 'oldest' ? 1 : -1;

	try {
		const travels = await getTravelsCollection();
		const users = await getUsersCollection();
		const query = {
			isPublic: true,
			userId: {
				$exists: true,
				$ne: locals.user.objectId
			}
		};

		if (continent !== 'all') {
			query.continent = continent;
		}

		if (tab === 'following') {
			const followingUserIds = locals.user.followingUserIds ?? [];

			if (followingUserIds.length === 0) {
				return {
					trips: [],
					filters: { sort, continent, user: userSearch, tab },
					continents: CONTINENTS,
					loadError: ''
				};
			}

			query.userId = { $in: followingUserIds };
		}

		if (userSearch) {
			const matchingUsers = await users
				.find({
					_id: { $ne: locals.user.objectId },
					displayName: { $regex: escapeRegExp(userSearch), $options: 'i' }
				})
				.project({ _id: 1 })
				.toArray();

			if (matchingUsers.length === 0) {
				return {
					trips: [],
					filters: { sort, continent, user: userSearch, tab },
					continents: CONTINENTS,
					loadError: ''
				};
			}

			const matchingUserIds = matchingUsers.map((user) => user._id);
			query.userId =
				tab === 'following'
					? {
							$in: matchingUserIds.filter((id) =>
								(locals.user.followingUserIds ?? []).some((followingId) => followingId.equals(id))
							)
						}
					: { $in: matchingUserIds };
		}

		const publicTravels = await travels.find(query).sort({ startDate: sortDirection }).toArray();
		const ownerIds = [...new Set(publicTravels.map((travel) => travel.userId?.toString?.()).filter(Boolean))];
		const ownerDocs =
			ownerIds.length === 0
				? []
				: await users
						.find({ _id: { $in: publicTravels.map((travel) => travel.userId).filter(Boolean) } })
						.project({ displayName: 1 })
						.toArray();
		const owners = new Map(ownerDocs.map((user) => [user._id.toString(), user]));

		return {
			trips: publicTravels.map((travel) => ({
				...mapTravelToCard(travel),
				ownerName: ownerNameFor(travel, owners),
				href: `/social/trips/${travel._id.toString()}`
			})),
			filters: { sort, continent, user: userSearch, tab },
			continents: CONTINENTS,
			loadError: ''
		};
	} catch (error) {
		console.error('Failed to load social travels:', error);

		return {
			trips: [],
			filters: { sort, continent, user: userSearch, tab },
			continents: CONTINENTS,
			loadError: 'Oeffentliche Reisen konnten nicht aus MongoDB geladen werden.'
		};
	}
}
