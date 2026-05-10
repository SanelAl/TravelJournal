import { getUserFromSession } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	event.locals.user = await getUserFromSession(event.cookies);

	if (event.url.pathname.startsWith('/trips') && !event.locals.user) {
		throw redirect(303, `/?next=${encodeURIComponent(event.url.pathname + event.url.search)}`);
	}

	return resolve(event);
}
