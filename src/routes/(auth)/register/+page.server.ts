import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail, redirect, isRedirect } from '@sveltejs/kit';
import { registerSchema } from '$lib/features/auth/schema';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(registerSchema), { errors: false });
	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(registerSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await auth.api.signUpEmail({
				body: {
					email: form.data.email,
					password: form.data.password,
					name: form.data.name
				}
			});
		} catch (error) {
			if (isRedirect(error)) throw error;

			console.error('Registration failed:', error);
			return fail(500, { form, error: 'Failed to create account' });
		}

		redirect(303, '/dashboard');
	}
};
