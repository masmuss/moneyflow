import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { CreateAccount } from './types';

export const getAccounts = async (userId: string) => {
	return await db.select().from(accounts).where(eq(accounts.userId, userId));
};

export const createAccount = async (data: CreateAccount) => {
	return await db.insert(accounts).values(data).returning();
};
