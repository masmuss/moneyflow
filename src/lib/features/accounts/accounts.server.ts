import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { CreateAccount } from './types';

export const getAccounts = async (userId: string) => {
	return await db.select().from(accounts).where(eq(accounts.userId, userId));
};

export const createAccount = async (data: CreateAccount) => {
	return await db.insert(accounts).values(data).returning();
};

export const updateAccount = async (id: string, userId: string, data: Partial<CreateAccount>) => {
	return await db
		.update(accounts)
		.set(data)
		.where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
		.returning();
};

export const deleteAccount = async (id: string, userId: string) => {
	return await db.delete(accounts).where(and(eq(accounts.id, id), eq(accounts.userId, userId)));
};
