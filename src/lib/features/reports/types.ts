export type ReportPeriod = {
	startDate: string;
	endDate: string;
	label: string;
};

export type IncomeExpenseSummary = {
	totalIncome: number;
	totalExpense: number;
	netFlow: number;
	savingsRate: number; // percentage
};

export type CategoryBreakdown = {
	categoryId: string;
	categoryName: string;
	categoryColor: string;
	categoryIcon: string | null;
	amount: number;
	percentage: number;
	transactionCount: number;
};

export type MonthlyComparison = {
	month: string;
	label: string;
	income: number;
	expense: number;
	netFlow: number;
};

export type ReportData = {
	period: ReportPeriod;
	summary: IncomeExpenseSummary;
	expenseByCategory: CategoryBreakdown[];
	incomeByCategory: CategoryBreakdown[];
	monthlyComparison: MonthlyComparison[];
};
