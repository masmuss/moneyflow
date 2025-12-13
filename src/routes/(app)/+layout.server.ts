import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { createUserRepository } from '$lib/server/repositories/base';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { createTransactionSchema } from '$lib/features/transactions/schema';
import { getTodayString } from '$lib/utils/date';

export const load: LayoutServerLoad = async ({ locals, request }) => {
	if (!locals.session) {
		redirect(303, '/login');
	}

	const userId = locals.user!.id;
	const repo = createUserRepository(userId);

	const [categories, accounts, quickTransactionForm] = await Promise.all([
		repo.categories.get(),
		repo.accounts.get(),
		superValidate({ date: getTodayString() }, zod4(createTransactionSchema), {
			errors: false
		})
	]);

	return {
		user: locals.user,
		session: locals.session,
		categories,
		accounts,
		quickTransactionForm
	};
};
