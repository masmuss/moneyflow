import { db } from '$lib/server/db';
import { budgets, categories, transactions } from '$lib/server/db/schema';
import { eq, and, sql, gte, lte } from 'drizzle-orm';
import { getCurrentUserId } from '$lib/server/auth';
import type { BudgetWithSpending, MonthlyBudgetSummary } from './types';

export async function getBudgetsForMonth(month: string): Promise<MonthlyBudgetSummary> {
	const userId = getCurrentUserId();

	// Get first and last day of the month
	const [year, monthNum] = month.split('-').map(Number);
	const firstDay = `${month}-01`;
	const lastDay = new Date(year, monthNum, 0).toISOString().split('T')[0];

	// Get all budgets for this month with their categories
	const budgetList = await db
		.select({
			id: budgets.id,
			userId: budgets.userId,
			categoryId: budgets.categoryId,
			amount: budgets.amount,
			month: budgets.month,
			createdAt: budgets.createdAt,
			updatedAt: budgets.updatedAt,
			category: categories
		})
		.from(budgets)
		.innerJoin(categories, eq(budgets.categoryId, categories.id))
		.where(and(eq(budgets.userId, userId), eq(budgets.month, month)));

	// Get spending per category for this month
	const spendingByCategory = await db
		.select({
			categoryId: transactions.categoryId,
			total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
		})
		.from(transactions)
		.where(
			and(
				eq(transactions.type, 'expense'),
				gte(transactions.date, firstDay),
				lte(transactions.date, lastDay)
			)
		)
		.groupBy(transactions.categoryId);

	// Create a map for quick lookup
	const spendingMap = new Map(spendingByCategory.map((s) => [s.categoryId, Number(s.total)]));

	// Calculate spending for each budget
	const budgetsWithSpending: BudgetWithSpending[] = budgetList.map((budget) => {
		const spent = spendingMap.get(budget.categoryId) || 0;
		const remaining = budget.amount - spent;
		const percentage = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;

		return {
			...budget,
			spent,
			remaining,
			percentage,
			isOverBudget: spent > budget.amount
		};
	});

	// Calculate totals
	const totalBudget = budgetsWithSpending.reduce((sum, b) => sum + b.amount, 0);
	const totalSpent = budgetsWithSpending.reduce((sum, b) => sum + b.spent, 0);
	const totalRemaining = totalBudget - totalSpent;
	const percentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

	return {
		totalBudget,
		totalSpent,
		totalRemaining,
		percentage,
		budgets: budgetsWithSpending
	};
}

export async function createBudget(data: { categoryId: string; amount: number; month: string }) {
	const userId = getCurrentUserId();

	// Check if budget already exists for this category and month
	const existing = await db
		.select()
		.from(budgets)
		.where(
			and(
				eq(budgets.userId, userId),
				eq(budgets.categoryId, data.categoryId),
				eq(budgets.month, data.month)
			)
		)
		.limit(1);

	if (existing.length > 0) {
		// Update existing budget
		const [updated] = await db
			.update(budgets)
			.set({ amount: data.amount, updatedAt: new Date() })
			.where(eq(budgets.id, existing[0].id))
			.returning();
		return updated;
	}

	// Create new budget
	const [newBudget] = await db
		.insert(budgets)
		.values({
			userId,
			categoryId: data.categoryId,
			amount: data.amount,
			month: data.month
		})
		.returning();

	return newBudget;
}

export async function updateBudget(
	id: string,
	data: {
		categoryId: string;
		amount: number;
		month: string;
	}
) {
	const userId = getCurrentUserId();

	const [updated] = await db
		.update(budgets)
		.set({
			categoryId: data.categoryId,
			amount: data.amount,
			month: data.month,
			updatedAt: new Date()
		})
		.where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
		.returning();

	return updated;
}

export async function deleteBudget(id: string) {
	const userId = getCurrentUserId();

	await db.delete(budgets).where(and(eq(budgets.id, id), eq(budgets.userId, userId)));
}

export async function copyBudgetsFromPreviousMonth(targetMonth: string) {
	const userId = getCurrentUserId();

	// Calculate previous month
	const [year, month] = targetMonth.split('-').map(Number);
	const prevDate = new Date(year, month - 2, 1);
	const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

	// Get budgets from previous month
	const prevBudgets = await db
		.select()
		.from(budgets)
		.where(and(eq(budgets.userId, userId), eq(budgets.month, prevMonth)));

	if (prevBudgets.length === 0) {
		return [];
	}

	// Check existing budgets for target month
	const existingBudgets = await db
		.select({ categoryId: budgets.categoryId })
		.from(budgets)
		.where(and(eq(budgets.userId, userId), eq(budgets.month, targetMonth)));

	const existingCategoryIds = new Set(existingBudgets.map((b) => b.categoryId));

	// Filter out budgets that already exist
	const budgetsToCreate = prevBudgets.filter((b) => !existingCategoryIds.has(b.categoryId));

	if (budgetsToCreate.length === 0) {
		return [];
	}

	// Create new budgets
	const newBudgets = await db
		.insert(budgets)
		.values(
			budgetsToCreate.map((b) => ({
				userId,
				categoryId: b.categoryId!,
				amount: b.amount,
				month: targetMonth
			}))
		)
		.returning();

	return newBudgets;
}
