import { createUserRepository } from '$lib/server/repositories/base';
import { getCurrentUserId } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { createAccountSchema, updateAccountSchema } from '$lib/features/accounts/schema';

export const load: PageServerLoad = async () => {
	const userId = getCurrentUserId();
	const repo = createUserRepository(userId);
	const accounts = await repo.accounts.get();
	const form = await superValidate(zod4(createAccountSchema), { errors: false });
	return {
		accounts,
		form
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const userId = getCurrentUserId();
		const repo = createUserRepository(userId);
		const form = await superValidate(request, zod4(createAccountSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await repo.accounts.create({
				name: form.data.name,
				type: form.data.type,
				balance: form.data.balance,
				currency: form.data.currency
			});
			return { form };
		} catch (error) {
			console.error('Failed to create account:', error);
			return fail(500, { form, message: 'Failed to create account' });
		}
	},
	update: async ({ request }) => {
		const userId = getCurrentUserId();
		const repo = createUserRepository(userId);
		const form = await superValidate(request, zod4(updateAccountSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await repo.accounts.update(form.data.id, {
				name: form.data.name,
				type: form.data.type,
				balance: form.data.balance,
				currency: form.data.currency
			});
			return { form };
		} catch (error) {
			console.error('Failed to update account:', error);
			return fail(500, { form, message: 'Failed to update account' });
		}
	},
	delete: async ({ request }) => {
		const userId = getCurrentUserId();
		const repo = createUserRepository(userId);
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { message: 'Account ID is required' });
		}

		try {
			await repo.accounts.delete(id);
			return { success: true };
		} catch (error) {
			console.error('Failed to delete account:', error);
			return fail(500, { message: 'Failed to delete account' });
		}
	}
};
