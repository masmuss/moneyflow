import type { LayoutServerLoad } from './$types';
import { getCategories } from '$lib/features/categories/categories.server';
import { getAccounts } from '$lib/features/accounts/accounts.server';
import { getCurrentUserId } from '$lib/server/auth';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { createTransactionSchema } from '$lib/features/transactions/schema';

export const load: LayoutServerLoad = async () => {
	const userId = getCurrentUserId();

	const [categories, accounts, quickTransactionForm] = await Promise.all([
		getCategories(),
		getAccounts(userId),
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
