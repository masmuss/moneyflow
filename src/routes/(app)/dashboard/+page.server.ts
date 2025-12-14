import type { PageServerLoad } from './$types';
import {
	getDashboardStats,
	getSpendingByCategory,
	getRecentTransactions,
	getMonthlyTrend
} from '$lib/features/dashboard/dashboard.server';
import { getUserIdFromRequest } from '$lib/server/auth';
import {
	DEFAULT_RECENT_TRANSACTIONS_LIMIT,
	DEFAULT_TREND_MONTHS_SHORT,
	DEFAULT_TREND_MONTHS_LONG
} from '$lib/constants';

export const load: PageServerLoad = async ({ request }) => {
	const userId = await getUserIdFromRequest(request.headers);

	const [stats, spendingByCategory, recentTransactions, monthlyTrend6, monthlyTrend12] =
		await Promise.all([
			getDashboardStats(userId),
			getSpendingByCategory(userId),
			getRecentTransactions(userId, DEFAULT_RECENT_TRANSACTIONS_LIMIT),
			getMonthlyTrend(userId, DEFAULT_TREND_MONTHS_SHORT),
			getMonthlyTrend(userId, DEFAULT_TREND_MONTHS_LONG)
		]);

	return {
		stats,
		spendingByCategory,
		recentTransactions,
		trend: {
			sixMonths: monthlyTrend6,
			twelveMonths: monthlyTrend12
		}
	};
};
