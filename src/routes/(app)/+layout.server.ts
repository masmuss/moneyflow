import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { createUserRepository } from '$lib/server/repositories/base';
import { auth } from '$lib/server/auth';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { createTransactionSchema } from '$lib/features/transactions/schema';
import { getTodayString } from '$lib/utils/date';

export const load: LayoutServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		redirect(303, '/login');
	}

	const userId = session.user.id;
	const repo = createUserRepository(userId);

	const [categories, accounts, quickTransactionForm] = await Promise.all([
		repo.categories.get(),
		repo.accounts.get(),
		superValidate({ date: getTodayString() }, zod4(createTransactionSchema), {
			errors: false
		})
	]);

	return {
		user: session.user,
		session: session.session,
		categories,
		accounts,
		quickTransactionForm
	};
};
