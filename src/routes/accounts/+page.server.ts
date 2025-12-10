import {
	createAccount,
	getAccounts,
	updateAccount,
	deleteAccount
} from '$lib/features/accounts/accounts.server';
import { getCurrentUserId } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { createAccountSchema, updateAccountSchema } from '$lib/features/accounts/schema';

export const load: PageServerLoad = async () => {
	const userId = getCurrentUserId();
	const accounts = await getAccounts(userId);
	const form = await superValidate(zod4(createAccountSchema), { errors: false });
	return {
		accounts,
		form
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const userId = getCurrentUserId();
		const form = await superValidate(request, zod4(createAccountSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await createAccount({
				name: form.data.name,
				type: form.data.type,
				balance: form.data.balance,
				currency: form.data.currency,
				userId
			});
			return { form };
		} catch (error) {
			console.error('Failed to create account:', error);
			return fail(500, { form, message: 'Failed to create account' });
		}
	},
	update: async ({ request }) => {
		const userId = getCurrentUserId();
		const form = await superValidate(request, zod4(updateAccountSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await updateAccount(form.data.id, userId, {
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
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { message: 'Account ID is required' });
		}

		try {
			await deleteAccount(id, userId);
			return { success: true };
		} catch (error) {
			console.error('Failed to delete account:', error);
			return fail(500, { message: 'Failed to delete account' });
		}
	}
};
