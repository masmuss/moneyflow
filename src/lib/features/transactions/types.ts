import type { transactions } from '$lib/server/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { Category } from '../categories/types';
import type { Account } from '../accounts/types';

export type Transaction = InferSelectModel<typeof transactions>;
export type CreateTransaction = InferInsertModel<typeof transactions>;

export type TransactionWithRelations = Transaction & {
	category: Category | null;
	account: Account;
};

export type TransactionFilter = {
	startDate?: string;
	endDate?: string;
	categoryId?: string;
	accountId?: string;
	type?: 'income' | 'expense';
};
