import type { accounts } from '@/server/db/schema';

export type Account = typeof accounts.$inferSelect;
export type CreateAccount = typeof accounts.$inferInsert;
