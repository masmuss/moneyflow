import {
	createAccount,
	deleteAccount,
	getAccounts,
	updateAccount
} from '@/features/accounts/accounts.server';

import {
	createCategory,
	deleteCategory,
	getCategories,
	getCategoriesByType,
	getCategoryById,
	updateCategory
} from '@/features/categories/categories.server';

import {
	getTransactions,
	getTransactionById,
	createTransaction,
	updateTransaction,
	deleteTransaction
} from '@/features/transactions/transactions.server';

import {
	getBudgetsForMonth,
	createBudget,
	updateBudget,
	deleteBudget,
	copyBudgetsFromPreviousMonth
} from '@/features/budget/budget.server';
import type { UserRepository } from './types';

export function createUserRepository(userId: string): UserRepository {
	return {
		accounts: {
			get: () => getAccounts(userId),
			create: (data) => createAccount({ ...data, userId }),
			update: (id, data) => updateAccount(id, userId, data),
			delete: async (id) => {
				await deleteAccount(id, userId);
			}
		},
		categories: {
			get: () => getCategories(userId),
			getById: (id) => getCategoryById(id, userId),
			getByType: (type) => getCategoriesByType(userId, type),
			create: (data) => createCategory({ ...data, userId }),
			update: (id, data) => updateCategory(id, userId, data),
			delete: (id) => deleteCategory(id, userId)
		},
		transactions: {
			get: (filter) => getTransactions(userId, filter),
			getById: (id) => getTransactionById(id),
			create: (data) => createTransaction(data),
			update: (id, data) => updateTransaction(id, data),
			delete: (id) => deleteTransaction(id)
		},
		budgets: {
			getForMonth: (month) => getBudgetsForMonth(userId, month),
			create: (data) => createBudget(userId, data),
			update: (id, data) => updateBudget(id, userId, data),
			delete: (id) => deleteBudget(id, userId),
			copyFromPreviousMonth: (targetMonth) => copyBudgetsFromPreviousMonth(userId, targetMonth)
		}
	};
}
