import type { budgets, categories } from '$lib/server/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Budget = InferSelectModel<typeof budgets>;
export type CreateBudget = InferInsertModel<typeof budgets>;

export type BudgetWithCategory = Budget & {
    category: InferSelectModel<typeof categories>;
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
