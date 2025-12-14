import { db } from '$lib/server/db';
import { transactions, accounts, categories } from '$lib/server/db/schema';
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';
import type { CreateTransaction, TransactionWithRelations, TransactionFilter } from './types';

const transactionSelectFields = {
	id: transactions.id,
	type: transactions.type,
	userId: transactions.userId,
	categoryId: transactions.categoryId,
	accountId: transactions.accountId,
	amount: transactions.amount,
	description: transactions.description,
	date: transactions.date,
	createdAt: transactions.createdAt,
	updatedAt: transactions.updatedAt,
	category: categories,
	account: accounts
};

function buildTransactionQuery() {
	return db
		.select(transactionSelectFields)
		.from(transactions)
		.leftJoin(categories, eq(transactions.categoryId, categories.id))
		.innerJoin(accounts, eq(transactions.accountId, accounts.id));
}

export async function getTransactions(
	userId: string,
	filter?: TransactionFilter
): Promise<TransactionWithRelations[]> {
	const conditions = [];

	if (filter?.accountId) {
		conditions.push(eq(transactions.accountId, filter.accountId));
	}

	if (filter?.categoryId) {
		conditions.push(eq(transactions.categoryId, filter.categoryId));
	}

	if (filter?.type) {
		conditions.push(eq(transactions.type, filter.type));
	}

	if (filter?.startDate) {
		conditions.push(gte(transactions.date, filter.startDate));
	}

	if (filter?.endDate) {
		conditions.push(lte(transactions.date, filter.endDate));
	}

	const query = buildTransactionQuery().orderBy(
		desc(transactions.date),
		desc(transactions.createdAt)
	);

	if (conditions.length > 0) {
		return await query.where(and(eq(transactions.userId, userId), ...conditions));
	}

	return await query.where(eq(transactions.userId, userId));
}

export async function getTransactionById(
	id: string,
	userId: string
): Promise<TransactionWithRelations | null> {
	const result = await buildTransactionQuery()
		.where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
		.limit(1);

	return result[0] || null;
}

export async function createTransaction(data: CreateTransaction) {
	return await db.transaction(async (tx) => {
		const [newTransaction] = await tx.insert(transactions).values(data).returning();

		const balanceChange = data.type === 'income' ? data.amount : -data.amount;

		await tx
			.update(accounts)
			.set({
				balance: sql`${accounts.balance} + ${balanceChange}`
			})
			.where(eq(accounts.id, data.accountId));

		return newTransaction;
	});
}

export async function updateTransaction(
	id: string,
	userId: string,
	data: Partial<CreateTransaction>
) {
	return await db.transaction(async (tx) => {
		const [oldTransaction] = await tx
			.select()
			.from(transactions)
			.where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
			.limit(1);

		if (!oldTransaction) {
			throw new Error('Transaction not found');
		}

		const oldBalanceChange =
			oldTransaction.type === 'income' ? -oldTransaction.amount : oldTransaction.amount;

		const newType = data.type || oldTransaction.type;
		const newAmount = data.amount ?? oldTransaction.amount;
		const newBalanceChange = newType === 'income' ? newAmount : -newAmount;

		if (data.accountId && data.accountId !== oldTransaction.accountId) {
			await tx
				.update(accounts)
				.set({
					balance: sql`${accounts.balance} + ${oldBalanceChange}`
				})
				.where(eq(accounts.id, oldTransaction.accountId));

			await tx
				.update(accounts)
				.set({
					balance: sql`${accounts.balance} + ${newBalanceChange}`
				})
				.where(eq(accounts.id, data.accountId));
		} else {
			const netChange = oldBalanceChange + newBalanceChange;
			await tx
				.update(accounts)
				.set({
					balance: sql`${accounts.balance} + ${netChange}`
				})
				.where(eq(accounts.id, oldTransaction.accountId));
		}

		const [updatedTransaction] = await tx
			.update(transactions)
			.set({
				...data,
				updatedAt: new Date()
			})
			.where(eq(transactions.id, id))
			.returning();

		return updatedTransaction;
	});
}

export async function deleteTransaction(id: string, userId: string) {
	return await db.transaction(async (tx) => {
		const [transaction] = await tx
			.select()
			.from(transactions)
			.where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
			.limit(1);

		if (!transaction) {
			throw new Error('Transaction not found');
		}

		// Reverse the transaction effect on account balance
		const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;

		await tx
			.update(accounts)
			.set({
				balance: sql`${accounts.balance} + ${balanceChange}`
			})
			.where(eq(accounts.id, transaction.accountId));

		const [deleted] = await tx.delete(transactions).where(eq(transactions.id, id)).returning();

		return deleted;
	});
}
