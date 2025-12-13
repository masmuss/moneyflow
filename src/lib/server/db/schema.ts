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

export const users = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const sessions = pgTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: timestamp('expires_at').notNull(),
		token: text('token').notNull().unique(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' })
	},
	(table) => [index('session_userId_idx').on(table.userId)]
);

export const oauthAccounts = pgTable(
	'account',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at'),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
		scope: text('scope'),
		password: text('password'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index('account_userId_idx').on(table.userId)]
);

export const verifications = pgTable(
	'verification',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index('verification_identifier_idx').on(table.identifier)]
);

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	oauthAccounts: many(oauthAccounts),
	categories: many(categories),
	budgets: many(budgets),
	accounts: many(accounts),
	transactions: many(transactions)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
	user: one(users, {
		fields: [oauthAccounts.userId],
		references: [users.id]
	})
}));

export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);
export const categoryTypeEnum = pgEnum('category_type', ['income', 'expense']);
export const accountTypeEnum = pgEnum('account_type', ['cash', 'bank', 'credit_card', 'savings']);
export const currencyEnum = pgEnum('currency', ['IDR', 'USD', 'EUR', 'SGD', 'MYR']);

export const categories = pgTable(
	'categories',
	{
		id: uuid('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		type: categoryTypeEnum('type').notNull(),
		color: text('color').default('#6366f1').notNull(),
		icon: text('icon'),
		isActive: boolean('is_active').default(true).notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [index('categories_user_id_idx').on(table.userId)]
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	user: one(users, {
		fields: [categories.userId],
		references: [users.id]
	}),
	transactions: many(transactions),
	budgets: many(budgets)
}));

export const accounts = pgTable(
	'accounts',
	{
		id: uuid('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		type: accountTypeEnum('type').notNull(),
		balance: bigint('balance', { mode: 'number' }).default(0),
		currency: currencyEnum('currency').default('IDR').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [index('accounts_user_id_idx').on(table.userId)]
);

export const accountsRelations = relations(accounts, ({ one, many }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
	transactions: many(transactions)
}));

export const transactions = pgTable(
	'transactions',
	{
		id: uuid('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		type: transactionTypeEnum('type').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
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
	(table) => [
		index('transactions_user_id_idx').on(table.userId),
		index('transactions_category_id_idx').on(table.categoryId),
		index('transactions_account_id_idx').on(table.accountId)
	]
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
	user: one(users, {
		fields: [transactions.userId],
		references: [users.id]
	}),
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
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
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
	user: one(users, {
		fields: [budgets.userId],
		references: [users.id]
	}),
	category: one(categories, {
		fields: [budgets.categoryId],
		references: [categories.id]
	})
}));
