import type { accounts, categories, transactions } from '$lib/server/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Transaction = InferSelectModel<typeof transactions>;
export type CreateTransaction = InferInsertModel<typeof transactions>;

export type TransactionWithRelations = Transaction & {
	category: InferSelectModel<typeof categories> | null;
	account: InferSelectModel<typeof accounts>;
};

export type TransactionFilter = {
	startDate?: string;
	endDate?: string;
	categoryId?: string;
	accountId?: string;
	type?: 'income' | 'expense';
};
