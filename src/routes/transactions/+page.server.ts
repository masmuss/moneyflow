import { createUserRepository } from '$lib/server/repositories/base';
import { getCurrentUserId } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {
	createTransactionSchema,
	updateTransactionSchema
} from '$lib/features/transactions/schema';
import { getTodayString } from '$lib/utils/date';
import type { TransactionFilter } from '$lib/features/transactions/types';

export const load: PageServerLoad = async ({ url }) => {
	const userId = getCurrentUserId();
	const repo = createUserRepository(userId);

	// Parse filter from URL
	const filter: TransactionFilter = {};
	const startDate = url.searchParams.get('startDate');
	const endDate = url.searchParams.get('endDate');
	const type = url.searchParams.get('type');
	const categoryId = url.searchParams.get('categoryId');
	const accountId = url.searchParams.get('accountId');

	if (startDate) filter.startDate = startDate;
	if (endDate) filter.endDate = endDate;
	if (type === 'income' || type === 'expense') filter.type = type;
	if (categoryId) filter.categoryId = categoryId;
	if (accountId) filter.accountId = accountId;

	const [transactions, categories, accounts] = await Promise.all([
		repo.transactions.get(filter),
		repo.categories.get(),
		repo.accounts.get()
	]);

	const form = await superValidate(
		{ date: getTodayString() },
		zod4(createTransactionSchema),
		{ errors: false }
	);

	return {
		transactions,
		categories,
		accounts,
		form,
		filter
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const userId = getCurrentUserId();
		const repo = createUserRepository(userId);
		const form = await superValidate(request, zod4(createTransactionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await repo.transactions.create({
				type: form.data.type,
				categoryId: form.data.categoryId,
				accountId: form.data.accountId,
				amount: form.data.amount,
				description: form.data.description,
				date: form.data.date
			});

			return { form };
		} catch (error) {
			console.error('Error creating transaction:', error);
			return fail(500, { form, error: 'Failed to create transaction' });
		}
	},

	update: async ({ request }) => {
		const userId = getCurrentUserId();
		const repo = createUserRepository(userId);
		const form = await superValidate(request, zod4(updateTransactionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await repo.transactions.update(form.data.id, {
				type: form.data.type,
				categoryId: form.data.categoryId,
				accountId: form.data.accountId,
				amount: form.data.amount,
				description: form.data.description,
				date: form.data.date
			});

			return { form };
		} catch (error) {
			console.error('Error updating transaction:', error);
			return fail(500, { form, error: 'Failed to update transaction' });
		}
	},

	delete: async ({ request }) => {
		const userId = getCurrentUserId();
		const repo = createUserRepository(userId);
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, { error: 'Transaction ID is required' });
		}

		try {
			await repo.transactions.delete(id);
			return { success: true };
		} catch (error) {
			console.error('Error deleting transaction:', error);
			return fail(500, { error: 'Failed to delete transaction' });
		}
	}
};
