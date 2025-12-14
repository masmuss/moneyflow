import { createUserRepository } from '$lib/server/repositories/base';
import { getUserIdFromRequest } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { createBudgetSchema, updateBudgetSchema } from '$lib/features/budget/schema';

function getCurrentMonth(): string {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export const load: PageServerLoad = async ({ url, request }) => {
	const userId = await getUserIdFromRequest(request.headers);
	const repo = createUserRepository(userId);
	const month = url.searchParams.get('month') || getCurrentMonth();

	const [budgetSummary, categories] = await Promise.all([
		repo.budgets.getForMonth(month),
		repo.categories.get()
	]);

	const form = await superValidate(zod4(createBudgetSchema), { errors: false });

	return {
		budgetSummary,
		categories,
		month,
		form
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const userId = await getUserIdFromRequest(request.headers);
		const repo = createUserRepository(userId);
		const form = await superValidate(request, zod4(createBudgetSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await repo.budgets.create({
				categoryId: form.data.categoryId,
				amount: form.data.amount,
				month: form.data.month
			});

			return { form };
		} catch (error) {
			console.error('Error creating budget:', error);
			return fail(500, { form, error: 'Failed to create budget' });
		}
	},

	update: async ({ request }) => {
		const userId = await getUserIdFromRequest(request.headers);
		const repo = createUserRepository(userId);
		const form = await superValidate(request, zod4(updateBudgetSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await repo.budgets.update(form.data.id, {
				categoryId: form.data.categoryId,
				amount: form.data.amount,
				month: form.data.month
			});

			return { form };
		} catch (error) {
			console.error('Error updating budget:', error);
			return fail(500, { form, error: 'Failed to update budget' });
		}
	},

	delete: async ({ request }) => {
		const userId = await getUserIdFromRequest(request.headers);
		const repo = createUserRepository(userId);
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Budget ID is required' });
		}

		try {
			await repo.budgets.delete(id);
			return { success: true };
		} catch (error) {
			console.error('Error deleting budget:', error);
			return fail(500, { error: 'Failed to delete budget' });
		}
	},

	copyFromPrevious: async ({ request }) => {
		const userId = await getUserIdFromRequest(request.headers);
		const repo = createUserRepository(userId);
		const formData = await request.formData();
		const month = formData.get('month') as string;

		if (!month) {
			return fail(400, { error: 'Month is required' });
		}

		try {
			const copied = await repo.budgets.copyFromPreviousMonth(month);
			return { success: true, copiedCount: copied.length };
		} catch (error) {
			console.error('Error copying budgets:', error);
			return fail(500, { error: 'Failed to copy budgets' });
		}
	}
};
