import type { budgets } from '$lib/server/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { Category } from '../categories/types';

export type Budget = InferSelectModel<typeof budgets>;
export type CreateBudget = InferInsertModel<typeof budgets>;

export type BudgetWithCategory = Budget & {
	category: Category;
};

export type BudgetWithSpending = BudgetWithCategory & {
	spent: number;
	remaining: number;
	percentage: number;
	isOverBudget: boolean;
};

export type MonthlyBudgetSummary = {
	totalBudget: number;
	totalSpent: number;
	totalRemaining: number;
	percentage: number;
	budgets: BudgetWithSpending[];
};
