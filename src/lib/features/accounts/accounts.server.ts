import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getAccounts = async (userId: string) => {
	return await db.select().from(accounts).where(eq(accounts.userId, userId));
};

export const createAccount = async (data: typeof accounts.$inferInsert) => {
	return await db.insert(accounts).values(data).returning();
};
