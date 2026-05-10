import { authenticateUser, createSession } from '$lib/server/auth.js';
import { fail, redirect } from '@sveltejs/kit';

function readString(formData, key) {
	return String(formData.get(key) ?? '').trim();
}

export async function load({ locals }) {
	if (locals.user) {
		throw redirect(303, '/trips');
	}

	return {};
}

export const actions = {
	default: async ({ cookies, request, url }) => {
		const formData = await request.formData();
		const email = readString(formData, 'email');
		const password = String(formData.get('password') ?? '');
		const next = url.searchParams.get('next') || '/trips';
		const values = { email };
		const errors = {};

		if (!email) {
			errors.email = 'Bitte E-Mail erfassen.';
		}

		if (!password) {
			errors.password = 'Bitte Passwort erfassen.';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values });
		}

		try {
			const user = await authenticateUser(email, password);

			if (!user) {
				return fail(400, {
					errors: { form: 'Login fehlgeschlagen. Bitte pruefe E-Mail und Passwort.' },
					values
				});
			}

			await createSession(cookies, user);
		} catch (error) {
			console.error('Failed to log in:', error);
			return fail(500, {
				errors: { form: 'Login ist gerade nicht moeglich. Bitte versuche es erneut.' },
				values
			});
		}

		throw redirect(303, next.startsWith('/trips') || next.startsWith('/social') ? next : '/trips');
	}
};
