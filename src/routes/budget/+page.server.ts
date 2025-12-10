import {
	getBudgetsForMonth,
	createBudget,
	updateBudget,
	deleteBudget,
	copyBudgetsFromPreviousMonth
} from '$lib/features/budget/budget.server';
import { getCategories } from '$lib/features/categories/categories.server';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { createBudgetSchema, updateBudgetSchema } from '$lib/features/budget/schema';

function getCurrentMonth(): string {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export const load: PageServerLoad = async ({ url }) => {
	const month = url.searchParams.get('month') || getCurrentMonth();

	const [budgetSummary, categories] = await Promise.all([
		getBudgetsForMonth(month),
		getCategories()
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
		const form = await superValidate(request, zod4(createBudgetSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await createBudget({
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
		const form = await superValidate(request, zod4(updateBudgetSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await updateBudget(form.data.id, {
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
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Budget ID is required' });
		}

		try {
			await deleteBudget(id);
			return { success: true };
		} catch (error) {
			console.error('Error deleting budget:', error);
			return fail(500, { error: 'Failed to delete budget' });
		}
	},

	copyFromPrevious: async ({ request }) => {
		const formData = await request.formData();
		const month = formData.get('month') as string;

		if (!month) {
			return fail(400, { error: 'Month is required' });
		}

		try {
			const copied = await copyBudgetsFromPreviousMonth(month);
			return { success: true, copiedCount: copied.length };
		} catch (error) {
			console.error('Error copying budgets:', error);
			return fail(500, { error: 'Failed to copy budgets' });
		}
	}
};
