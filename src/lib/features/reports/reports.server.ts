import { db } from '$lib/server/db';
import { transactions, categories, accounts } from '$lib/server/db/schema';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import {
	toDateString,
	formatMonthYear,
	formatShortMonth,
	formatDateRange
} from '$lib/utils/date';
import type {
	ReportPeriod,
	IncomeExpenseSummary,
	CategoryBreakdown,
	MonthlyComparison,
	ReportData
} from './types';

export function getPresetPeriods(): { value: string; label: string; period: ReportPeriod }[] {
	const today = new Date();

	// This month
	const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
	const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

	// Last month
	const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
	const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

	// This year
	const thisYearStart = new Date(today.getFullYear(), 0, 1);
	const thisYearEnd = new Date(today.getFullYear(), 11, 31);

	// Last 3 months
	const last3MonthsStart = new Date(today.getFullYear(), today.getMonth() - 2, 1);

	// Last 6 months
	const last6MonthsStart = new Date(today.getFullYear(), today.getMonth() - 5, 1);

	return [
		{
			value: 'this-month',
			label: 'This Month',
			period: {
				startDate: toDateString(thisMonthStart),
				endDate: toDateString(thisMonthEnd),
				label: formatMonthYear(thisMonthStart, 'en-US')
			}
		},
		{
			value: 'last-month',
			label: 'Last Month',
			period: {
				startDate: toDateString(lastMonthStart),
				endDate: toDateString(lastMonthEnd),
				label: formatMonthYear(lastMonthStart, 'en-US')
			}
		},
		{
			value: 'last-3-months',
			label: 'Last 3 Months',
			period: {
				startDate: toDateString(last3MonthsStart),
				endDate: toDateString(thisMonthEnd),
				label: formatDateRange(last3MonthsStart, thisMonthEnd)
			}
		},
		{
			value: 'last-6-months',
			label: 'Last 6 Months',
			period: {
				startDate: toDateString(last6MonthsStart),
				endDate: toDateString(thisMonthEnd),
				label: formatDateRange(last6MonthsStart, thisMonthEnd)
			}
		},
		{
			value: 'this-year',
			label: 'This Year',
			period: {
				startDate: toDateString(thisYearStart),
				endDate: toDateString(thisYearEnd),
				label: today.getFullYear().toString()
			}
		}
	];
}

export async function getIncomeExpenseSummary(
	userId: string,
	startDate: string,
	endDate: string
): Promise<IncomeExpenseSummary> {
	const result = await db
		.select({
			type: transactions.type,
			total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
		})
		.from(transactions)
		.innerJoin(accounts, eq(transactions.accountId, accounts.id))
		.where(
			and(
				eq(accounts.userId, userId),
				gte(transactions.date, startDate),
				lte(transactions.date, endDate)
			)
		)
		.groupBy(transactions.type);

	const incomeRow = result.find((r) => r.type === 'income');
	const expenseRow = result.find((r) => r.type === 'expense');

	const totalIncome = Number(incomeRow?.total || 0);
	const totalExpense = Number(expenseRow?.total || 0);
	const netFlow = totalIncome - totalExpense;
	const savingsRate = totalIncome > 0 ? Math.round((netFlow / totalIncome) * 100) : 0;

	return {
		totalIncome,
		totalExpense,
		netFlow,
		savingsRate
	};
}

export async function getCategoryBreakdown(
	userId: string,
	startDate: string,
	endDate: string,
	type: 'income' | 'expense'
): Promise<CategoryBreakdown[]> {
	const result = await db
		.select({
			categoryId: transactions.categoryId,
			categoryName: categories.name,
			categoryColor: categories.color,
			categoryIcon: categories.icon,
			amount: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
			transactionCount: sql<number>`COUNT(*)`
		})
		.from(transactions)
		.innerJoin(categories, eq(transactions.categoryId, categories.id))
		.innerJoin(accounts, eq(transactions.accountId, accounts.id))
		.where(
			and(
				eq(accounts.userId, userId),
				eq(transactions.type, type),
				gte(transactions.date, startDate),
				lte(transactions.date, endDate)
			)
		)
		.groupBy(transactions.categoryId, categories.name, categories.color, categories.icon)
		.orderBy(desc(sql`SUM(${transactions.amount})`));

	const total = result.reduce((sum, r) => sum + Number(r.amount), 0);

	return result.map((r) => ({
		categoryId: r.categoryId,
		categoryName: r.categoryName,
		categoryColor: r.categoryColor,
		categoryIcon: r.categoryIcon,
		amount: Number(r.amount),
		percentage: total > 0 ? Math.round((Number(r.amount) / total) * 100) : 0,
		transactionCount: Number(r.transactionCount)
	}));
}

export async function getMonthlyComparison(
	userId: string,
	startDate: string,
	endDate: string
): Promise<MonthlyComparison[]> {
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
				gte(transactions.date, startDate),
				lte(transactions.date, endDate)
			)
		)
		.groupBy(sql`TO_CHAR(${transactions.date}::date, 'YYYY-MM')`, transactions.type)
		.orderBy(sql`TO_CHAR(${transactions.date}::date, 'YYYY-MM')`);

	// Group by month
	const monthMap = new Map<string, { income: number; expense: number }>();

	for (const row of result) {
		const month = row.month;
		if (!monthMap.has(month)) {
			monthMap.set(month, { income: 0, expense: 0 });
		}
		const data = monthMap.get(month)!;
		if (row.type === 'income') {
			data.income = Number(row.total);
		} else {
			data.expense = Number(row.total);
		}
	}

	// Convert to array with labels
	return Array.from(monthMap.entries()).map(([month, data]) => {
		const [year, m] = month.split('-').map(Number);
		const date = new Date(year, m - 1);
		return {
			month,
			label: formatShortMonth(date, 'en-US'),
			income: data.income,
			expense: data.expense,
			netFlow: data.income - data.expense
		};
	});
}

export async function getReportData(userId: string, period: ReportPeriod): Promise<ReportData> {
	const [summary, expenseByCategory, incomeByCategory, monthlyComparison] = await Promise.all([
		getIncomeExpenseSummary(userId, period.startDate, period.endDate),
		getCategoryBreakdown(userId, period.startDate, period.endDate, 'expense'),
		getCategoryBreakdown(userId, period.startDate, period.endDate, 'income'),
		getMonthlyComparison(userId, period.startDate, period.endDate)
	]);

	return {
		period,
		summary,
		expenseByCategory,
		incomeByCategory,
		monthlyComparison
	};
}
