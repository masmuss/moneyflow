import type { PageServerLoad } from './$types';
import {
	getDashboardStats,
	getSpendingByCategory,
	getRecentTransactions,
	getMonthlyTrend
} from '$lib/features/dashboard/dashboard.server';
import { getCurrentUserId } from '@/server/auth';

export const load: PageServerLoad = async () => {
	const userId = getCurrentUserId();

	const [stats, spendingByCategory, recentTransactions, monthlyTrend6, monthlyTrend12] =
		await Promise.all([
			getDashboardStats(userId),
			getSpendingByCategory(userId),
			getRecentTransactions(userId, 5),
			getMonthlyTrend(userId, 6),
			getMonthlyTrend(userId, 12)
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
