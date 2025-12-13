import { db } from '$lib/server/db';
import { accounts, transactions, categories } from '$lib/server/db/schema';
import { eq, sql, and, gte, lte, desc } from 'drizzle-orm';
import { toDateString, formatShortMonth } from '$lib/utils/date';
import type { DashboardStats, SpendingByCategory, RecentTransaction, MonthlyTrend } from './types';

export type { DashboardStats, SpendingByCategory, RecentTransaction, MonthlyTrend } from './types';

function getCurrentMonthRange(): { firstDay: string; lastDay: string } {
	const now = new Date();
	const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

	return {
		firstDay: toDateString(firstDayOfMonth),
		lastDay: toDateString(lastDayOfMonth)
	};
}

function getMonthRange(date: Date): { firstDay: string; lastDay: string } {
	const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
	const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

	return {
		firstDay: toDateString(firstDayOfMonth),
		lastDay: toDateString(lastDayOfMonth)
	};
}

async function getTransactionSum(
	userId: string,
	type: 'income' | 'expense',
	firstDay: string,
	lastDay: string
): Promise<number> {
	const result = await db
		.select({
			total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
		})
		.from(transactions)
		.innerJoin(accounts, eq(transactions.accountId, accounts.id))
		.where(
			and(
				eq(accounts.userId, userId),
				eq(transactions.type, type),
				gte(transactions.date, firstDay),
				lte(transactions.date, lastDay)
			)
		);

	return Number(result[0]?.total || 0);
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
	// Get total balance and account count
	const accountsResult = await db
		.select({
			totalBalance: sql<number>`COALESCE(SUM(${accounts.balance}), 0)`,
			accountCount: sql<number>`COUNT(*)`
		})
		.from(accounts)
		.where(eq(accounts.userId, userId));

	const totalBalance = Number(accountsResult[0]?.totalBalance || 0);
	const accountCount = Number(accountsResult[0]?.accountCount || 0);

	// Get current month transactions
	const { firstDay, lastDay } = getCurrentMonthRange();
	const [incomeThisMonth, expenseThisMonth] = await Promise.all([
		getTransactionSum(userId, 'income', firstDay, lastDay),
		getTransactionSum(userId, 'expense', firstDay, lastDay)
	]);

	return {
		totalBalance,
		incomeThisMonth,
		expenseThisMonth,
		netThisMonth: incomeThisMonth - expenseThisMonth,
		accountCount
	};
}

export async function getSpendingByCategory(userId: string): Promise<SpendingByCategory[]> {
	const { firstDay, lastDay } = getCurrentMonthRange();

	const result = await db
		.select({
			categoryId: categories.id,
			categoryName: categories.name,
			categoryColor: categories.color,
			categoryIcon: categories.icon,
			total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
		})
		.from(transactions)
		.innerJoin(accounts, eq(transactions.accountId, accounts.id))
		.innerJoin(categories, eq(transactions.categoryId, categories.id))
		.where(
			and(
				eq(accounts.userId, userId),
				eq(transactions.type, 'expense'),
				gte(transactions.date, firstDay),
				lte(transactions.date, lastDay)
			)
		)
		.groupBy(categories.id, categories.name, categories.color, categories.icon)
		.orderBy(desc(sql`SUM(${transactions.amount})`));

	return result.map((r) => ({
		...r,
		total: Number(r.total)
	}));
}

export async function getRecentTransactions(
	userId: string,
	limit: number = 5
): Promise<RecentTransaction[]> {
	const result = await db
		.select({
			id: transactions.id,
			type: transactions.type,
			amount: transactions.amount,
			description: transactions.description,
			date: transactions.date,
			categoryName: categories.name,
			categoryColor: categories.color,
			categoryIcon: categories.icon,
			accountName: accounts.name
		})
		.from(transactions)
		.innerJoin(accounts, eq(transactions.accountId, accounts.id))
		.leftJoin(categories, eq(transactions.categoryId, categories.id))
		.where(eq(accounts.userId, userId))
		.orderBy(desc(transactions.date), desc(transactions.createdAt))
		.limit(limit);

	return result;
}

export async function getMonthlyTrend(userId: string, months: number = 6): Promise<MonthlyTrend[]> {
	const now = new Date();

	const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
	const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

	const firstDay = toDateString(startDate);
	const lastDay = toDateString(endDate);

	const result = await db
		.select({
			month: sql<string>`TO_CHAR(${transactions.date}::date, 'YYYY-MM')`,
			type: transactions.type,
			total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
		})
		.from(transactions)
		.innerJoin(accounts, eq(transactions.accountId, accounts.id))
		.where(
			and(
				eq(accounts.userId, userId),
				gte(transactions.date, firstDay),
				lte(transactions.date, lastDay)
			)
		)
		.groupBy(sql`TO_CHAR(${transactions.date}::date, 'YYYY-MM')`, transactions.type);

	const monthlyData = new Map<string, { income: number; expense: number }>();

	for (const row of result) {
		if (!monthlyData.has(row.month)) {
			monthlyData.set(row.month, { income: 0, expense: 0 });
		}
		const data = monthlyData.get(row.month)!;
		if (row.type === 'income') {
			data.income = Number(row.total);
		} else {
			data.expense = Number(row.total);
		}
	}

	const trends: MonthlyTrend[] = Array.from({ length: months }, (_, i) => {
		const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
		const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
		const monthLabel = formatShortMonth(date);

		const data = monthlyData.get(month) || { income: 0, expense: 0 };

		return {
			month,
			monthLabel,
			income: data.income,
			expense: data.expense
		};
	});

	return trends;
}
