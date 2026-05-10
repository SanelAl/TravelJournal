import { createSession, normalizeEmail, registerUser } from '$lib/server/auth.js';
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
	default: async ({ cookies, request }) => {
		const formData = await request.formData();
		const values = {
			email: readString(formData, 'email'),
			displayName: readString(formData, 'displayName')
		};
		const password = String(formData.get('password') ?? '');
		const passwordConfirm = String(formData.get('passwordConfirm') ?? '');
		const errors = {};

		if (!values.email || (!values.email.includes('@') && normalizeEmail(values.email) !== 'admin')) {
			errors.email = 'Bitte eine gueltige E-Mail erfassen.';
		}

		if (normalizeEmail(values.email) === 'admin') {
			errors.email = 'admin ist fuer den System-Admin reserviert.';
		}

		if (!values.displayName) {
			errors.displayName = 'Bitte Anzeigenamen erfassen.';
		}

		if (password.length < 6) {
			errors.password = 'Bitte mindestens 6 Zeichen verwenden.';
		}

		if (password !== passwordConfirm) {
			errors.passwordConfirm = 'Die Passwoerter stimmen nicht ueberein.';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values });
		}

		try {
			const user = await registerUser({
				email: values.email,
				displayName: values.displayName,
				password
			});

			await createSession(cookies, user);
		} catch (error) {
			if (error?.code === 11000) {
				return fail(400, {
					errors: { email: 'Diese E-Mail ist bereits registriert.' },
					values
				});
			}

			console.error('Failed to register user:', error);
			return fail(500, {
				errors: { form: 'Registrierung ist gerade nicht moeglich. Bitte versuche es erneut.' },
				values
			});
		}

		throw redirect(303, '/trips');
	}
};
