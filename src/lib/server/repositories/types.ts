import type { Account, CreateAccount } from '@/features/accounts/types';
import type { Category, CreateCategory } from '@/features/categories/types';
import type {
	CreateTransaction,
	Transaction,
	TransactionWithRelations,
	TransactionFilter
} from '@/features/transactions/types';
import type { Budget, MonthlyBudgetSummary } from '@/features/budget/types';

type WithoutUserId<T> = Omit<T, 'userId'>;

type BudgetInput = {
	categoryId: string;
	amount: number;
	month: string;
};

type AccountRepository = {
	get: () => Promise<Account[]>;
	getById: (id: string) => Promise<Account | null>;
	create: (data: WithoutUserId<CreateAccount>) => Promise<Account>;
	update: (id: string, data: Partial<WithoutUserId<CreateAccount>>) => Promise<Account>;
	delete: (id: string) => Promise<void>;
};

type CategoryRepository = {
	get: () => Promise<Category[]>;
	getById: (id: string) => Promise<Category | null>;
	getByType: (type: 'income' | 'expense') => Promise<Category[]>;
	create: (data: WithoutUserId<CreateCategory>) => Promise<Category>;
	update: (id: string, data: Partial<WithoutUserId<CreateCategory>>) => Promise<Category>;
	delete: (id: string) => Promise<Category>;
};

type TransactionRepository = {
	get: (filter?: TransactionFilter) => Promise<TransactionWithRelations[]>;
	getById: (id: string) => Promise<TransactionWithRelations | null>;
	create: (data: CreateTransaction) => Promise<Transaction>;
	update: (id: string, data: Partial<CreateTransaction>) => Promise<Transaction>;
	delete: (id: string) => Promise<Transaction>;
};

type BudgetRepository = {
	getForMonth: (month: string) => Promise<MonthlyBudgetSummary>;
	create: (data: BudgetInput) => Promise<Budget>;
	update: (id: string, data: BudgetInput) => Promise<Budget>;
	delete: (id: string) => Promise<void>;
	copyFromPreviousMonth: (targetMonth: string) => Promise<Budget[]>;
};

export type UserRepository = {
	accounts: AccountRepository;
	categories: CategoryRepository;
	transactions: TransactionRepository;
	budgets: BudgetRepository;
};
