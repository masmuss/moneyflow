import {
	getCategories,
	createCategory,
	updateCategory,
	deleteCategory
} from '$lib/features/categories/categories.server';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { createCategorySchema, updateCategorySchema } from '$lib/features/categories/schema';

export const load: PageServerLoad = async () => {
	const categories = await getCategories();
	const form = await superValidate(zod4(createCategorySchema));
	return {
		categories,
		form
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await superValidate(request, zod4(createCategorySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await createCategory({
				name: form.data.name,
				type: form.data.type,
				color: form.data.color,
				icon: form.data.icon
			});

			return { form };
		} catch (error) {
			console.error('Error creating category:', error);
			return fail(500, { form, error: 'Failed to create category' });
		}
	},

	update: async ({ request }) => {
		const form = await superValidate(request, zod4(updateCategorySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await updateCategory(form.data.id, {
				name: form.data.name,
				type: form.data.type,
				color: form.data.color,
				icon: form.data.icon
			});

			return { form };
		} catch (error) {
			console.error('Error updating category:', error);
			return fail(500, { form, error: 'Failed to update category' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, { error: 'Category ID is required' });
		}

		try {
			await deleteCategory(id);
			return { success: true };
		} catch (error) {
			console.error('Error deleting category:', error);
			return fail(500, { error: 'Failed to delete category' });
		}
	}
};
