import {
    createAccount,
    deleteAccount,
    getAccounts,
    updateAccount
} from '@/features/accounts/accounts.server';
import type { Account, CreateAccount } from '@/features/accounts/types';
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoriesByType,
    getCategoryById,
    updateCategory
} from '@/features/categories/categories.server';
import type { Category, CreateCategory } from '@/features/categories/types';
import {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
} from '@/features/transactions/transactions.server';
import type {
    CreateTransaction,
    Transaction,
    TransactionWithRelations,
    TransactionFilter
} from '@/features/transactions/types';
import {
    getBudgetsForMonth,
    createBudget,
    updateBudget,
    deleteBudget,
    copyBudgetsFromPreviousMonth
} from '@/features/budget/budget.server';
import type { Budget, MonthlyBudgetSummary } from '@/features/budget/types';

// Account Repository Type
type AccountRepository = {
    get: () => Promise<Account[]>;
    create: (data: Omit<CreateAccount, 'userId'>) => Promise<Account>;
    update: (id: string, data: Partial<CreateAccount>) => Promise<Account>;
    delete: (id: string) => Promise<void>;
};

// Category Repository Type
type CategoryRepository = {
    get: () => Promise<Category[]>;
    getById: (id: string) => Promise<Category | null>;
    getByType: (type: 'income' | 'expense') => Promise<Category[]>;
    create: (data: Omit<CreateCategory, 'userId'>) => Promise<Category>;
    update: (id: string, data: Partial<Omit<CreateCategory, 'userId'>>) => Promise<Category>;
    delete: (id: string) => Promise<Category>;
};

// Transaction Repository Type
type TransactionRepository = {
    get: (filter?: TransactionFilter) => Promise<TransactionWithRelations[]>;
    getById: (id: string) => Promise<TransactionWithRelations | null>;
    create: (data: CreateTransaction) => Promise<Transaction>;
    update: (id: string, data: Partial<CreateTransaction>) => Promise<Transaction>;
    delete: (id: string) => Promise<Transaction>;
};

// Budget Repository Type
type BudgetRepository = {
    getForMonth: (month: string) => Promise<MonthlyBudgetSummary>;
    create: (data: { categoryId: string; amount: number; month: string }) => Promise<Budget>;
    update: (
        id: string,
        data: { categoryId: string; amount: number; month: string }
    ) => Promise<Budget>;
    delete: (id: string) => Promise<void>;
    copyFromPreviousMonth: (targetMonth: string) => Promise<Budget[]>;
};

// Combined User Repository Type
export type UserRepository = {
    accounts: AccountRepository;
    categories: CategoryRepository;
    transactions: TransactionRepository;
    budgets: BudgetRepository;
};

export function createUserRepository(userId: string): UserRepository {
    return {
        accounts: {
            get: () => getAccounts(userId),
            create: (data) => createAccount({ ...data, userId }),
            update: (id, data) => updateAccount(id, userId, data),
            delete: async (id) => {
                await deleteAccount(id, userId);
            }
        },
        categories: {
            get: () => getCategories(userId),
            getById: (id) => getCategoryById(id, userId),
            getByType: (type) => getCategoriesByType(userId, type),
            create: (data) => createCategory({ ...data, userId }),
            update: (id, data) => updateCategory(id, userId, data),
            delete: (id) => deleteCategory(id, userId)
        },
        transactions: {
            get: (filter) => getTransactions(userId, filter),
            getById: (id) => getTransactionById(id),
            create: (data) => createTransaction(data),
            update: (id, data) => updateTransaction(id, data),
            delete: (id) => deleteTransaction(id)
        },
        budgets: {
            getForMonth: (month) => getBudgetsForMonth(userId, month),
            create: (data) => createBudget(userId, data),
            update: (id, data) => updateBudget(id, userId, data),
            delete: (id) => deleteBudget(id, userId),
            copyFromPreviousMonth: (targetMonth) => copyBudgetsFromPreviousMonth(userId, targetMonth)
        }
    };
}
