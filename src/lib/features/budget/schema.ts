import { z } from 'zod';

export const createBudgetSchema = z.object({
	categoryId: z.uuid('Please select a category'),
	amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
	month: z.string().regex(/^\d{4}-\d{2}$/, 'Invalid month format')
});

export const updateBudgetSchema = createBudgetSchema.extend({
	id: z.uuid()
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
