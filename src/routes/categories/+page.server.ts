import { createUserRepository } from '$lib/server/repositories/base';
import { getCurrentUserId } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { createCategorySchema, updateCategorySchema } from '$lib/features/categories/schema';

export const load: PageServerLoad = async () => {
	const userId = getCurrentUserId();
	const repo = createUserRepository(userId);
	const categories = await repo.categories.get();
	const form = await superValidate(zod4(createCategorySchema), { errors: false });
	return {
		categories,
		form
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const userId = getCurrentUserId();
		const repo = createUserRepository(userId);
		const form = await superValidate(request, zod4(createCategorySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await repo.categories.create({
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
		const userId = getCurrentUserId();
		const repo = createUserRepository(userId);
		const form = await superValidate(request, zod4(updateCategorySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await repo.categories.update(form.data.id, {
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
		const userId = getCurrentUserId();
		const repo = createUserRepository(userId);
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, { error: 'Category ID is required' });
		}

		try {
			await repo.categories.delete(id);
			return { success: true };
		} catch (error) {
			console.error('Error deleting category:', error);
			return fail(500, { error: 'Failed to delete category' });
		}
	}
};
