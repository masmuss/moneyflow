import type { accounts } from '$lib/server/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Account = InferSelectModel<typeof accounts>;
export type CreateAccount = InferInsertModel<typeof accounts>;
