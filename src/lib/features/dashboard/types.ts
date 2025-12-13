export type DashboardStats = {
	totalBalance: number;
	incomeThisMonth: number;
	expenseThisMonth: number;
	netThisMonth: number;
	accountCount: number;
};

export type SpendingByCategory = {
	categoryId: string;
	categoryName: string;
	categoryColor: string;
	categoryIcon: string | null;
	total: number;
};

export type RecentTransaction = {
	id: string;
	type: 'income' | 'expense';
	amount: number;
	description: string;
	date: string;
	categoryName: string | null;
	categoryColor: string | null;
	categoryIcon: string | null;
	accountName: string;
};

export type MonthlyTrend = {
	month: string;
	monthLabel: string;
	income: number;
	expense: number;
};

export interface TrendData {
	sixMonths: MonthlyTrend[];
	twelveMonths: MonthlyTrend[];
}
