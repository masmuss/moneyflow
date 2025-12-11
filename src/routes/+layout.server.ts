import type { LayoutServerLoad } from './$types';
import { createUserRepository } from '$lib/server/repositories/base';
import { getCurrentUserId } from '$lib/server/auth';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { createTransactionSchema } from '$lib/features/transactions/schema';

export const load: LayoutServerLoad = async () => {
	const userId = getCurrentUserId();
	const repo = createUserRepository(userId);

	const [categories, accounts, quickTransactionForm] = await Promise.all([
		repo.categories.get(),
		repo.accounts.get(),
		superValidate({ date: new Date().toISOString().split('T')[0] }, zod4(createTransactionSchema), {
			errors: false
		})
	]);

	return {
		categories,
		accounts,
		quickTransactionForm
	};
};
