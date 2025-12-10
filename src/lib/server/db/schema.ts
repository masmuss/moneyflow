import { relations } from 'drizzle-orm';
import {
	bigint,
	boolean,
	date,
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid
} from 'drizzle-orm/pg-core';

export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);
export const categoryTypeEnum = pgEnum('category_type', ['income', 'expense']);
export const accountTypeEnum = pgEnum('account_type', ['cash', 'bank', 'credit_card', 'savings']);
export const currencyEnum = pgEnum('currency', ['IDR', 'USD', 'EUR', 'SGD', 'MYR']);

export const categories = pgTable('categories', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	type: categoryTypeEnum('type').notNull(),
	color: text('color').default('#6366f1').notNull(),
	icon: text('icon'),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	transactions: many(transactions)
}));

export const transactions = pgTable(
	'transactions',
	{
		id: uuid('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		type: transactionTypeEnum('type').notNull(),
		categoryId: uuid('category_id')
			.references(() => categories.id, { onDelete: 'set null' })
			.notNull(),
		accountId: uuid('account_id')
			.references(() => accounts.id, { onDelete: 'cascade' })
			.notNull(),
		amount: bigint('amount', { mode: 'number' }).notNull(),
		description: text('description').notNull(),
		date: date('date').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [index('transactions_category_id_idx').on(table.categoryId)]
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
	category: one(categories, {
		fields: [transactions.categoryId],
		references: [categories.id]
	}),
	account: one(accounts, {
		fields: [transactions.accountId],
		references: [accounts.id]
	})
}));

export const budgets = pgTable(
	'budgets',
	{
		id: uuid('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text('user_id').notNull(),
		categoryId: uuid('category_id')
			.references(() => categories.id, { onDelete: 'cascade' })
			.notNull(),
		amount: bigint('amount', { mode: 'number' }).notNull(),
		month: text('month').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [
		index('budgets_user_month_idx').on(table.userId, table.month),
		index('budgets_category_idx').on(table.categoryId)
	]
);

export const budgetsRelations = relations(budgets, ({ one }) => ({
	category: one(categories, {
		fields: [budgets.categoryId],
		references: [categories.id]
	})
}));

export const accounts = pgTable('accounts', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	type: accountTypeEnum('type').notNull(),
	balance: bigint('balance', { mode: 'number' }).default(0),
	currency: currencyEnum('currency').default('IDR').notNull(),
	userId: text('user_id').notNull()
});

export const accountsRelations = relations(accounts, ({ many }) => ({
	transactions: many(transactions)
}));
