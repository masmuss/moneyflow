import type { LayoutServerLoad } from './$types';
import { createUserRepository } from '$lib/server/repositories/base';
import { getCurrentUserId } from '$lib/server/auth';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { createTransactionSchema } from '$lib/features/transactions/schema';
import { getTodayString } from '$lib/utils/date';

export const load: LayoutServerLoad = async () => {
	const userId = getCurrentUserId();
	const repo = createUserRepository(userId);

	const [categories, accounts, quickTransactionForm] = await Promise.all([
		repo.categories.get(),
		repo.accounts.get(),
		superValidate({ date: getTodayString() }, zod4(createTransactionSchema), {
			errors: false
		})
	]);

	return {
		categories,
		accounts,
		quickTransactionForm
	};
};
