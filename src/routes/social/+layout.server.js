import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
	if (!locals.user) {
		throw redirect(303, `/?next=${encodeURIComponent(url.pathname + url.search)}`);
	}

	return {
		user: {
			displayName: locals.user.displayName,
			email: locals.user.email,
			role: locals.user.role
		},
		activeSection: 'social'
	};
}
