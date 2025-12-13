import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { CreateAccount } from './types';

export const getAccounts = async (userId: string) => {
	return await db.select().from(accounts).where(eq(accounts.userId, userId));
};

export const getAccountById = async (id: string, userId: string) => {
	const result = await db
		.select()
		.from(accounts)
		.where(and(eq(accounts.id, id), eq(accounts.userId, userId)));

	return result[0] ?? null;
};

export const createAccount = async (data: CreateAccount) => {
	const query = await db.insert(accounts).values(data).returning();

	return query[0];
};

export const updateAccount = async (id: string, userId: string, data: Partial<CreateAccount>) => {
	const query = await db
		.update(accounts)
		.set(data)
		.where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
		.returning();

	return query[0];
};

export const deleteAccount = async (id: string, userId: string) => {
	return await db.delete(accounts).where(and(eq(accounts.id, id), eq(accounts.userId, userId)));
};
