import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail, redirect, isRedirect } from '@sveltejs/kit';
import { loginSchema } from '$lib/features/auth/schema';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(loginSchema), { errors: false });
	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await auth.api.signInEmail({
				body: {
					email: form.data.email,
					password: form.data.password
				}
			});
		} catch (error) {
			if (isRedirect(error)) throw error;

			console.error('Login failed:', error);
			return fail(500, { form, error: 'Invalid email or password' });
		}

		redirect(303, '/dashboard');
	}
};
