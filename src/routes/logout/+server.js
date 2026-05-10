import { clearSession } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

export async function POST({ cookies }) {
	await clearSession(cookies);
	throw redirect(303, '/');
}
