import type { categories } from '$lib/server/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Category = InferSelectModel<typeof categories>;
export type CreateCategory = InferInsertModel<typeof categories>;
