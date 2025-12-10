import { z } from 'zod';

export const TRANSACTION_TYPES = ['income', 'expense'] as const;

export const TRANSACTION_TYPE_LABELS: Record<(typeof TRANSACTION_TYPES)[number], string> = {
	income: 'Income',
	expense: 'Expense'
};

export const createTransactionSchema = z.object({
	type: z.enum(TRANSACTION_TYPES, {
		error: () => ({ message: 'Please select a transaction type' })
	}),
	categoryId: z.uuid('Please select a category'),
	accountId: z.uuid('Please select an account'),
	amount: z.coerce.number().int().positive('Amount must be positive'),
	description: z
		.string()
		.min(1, 'Description is required')
		.max(255, 'Description must be less than 255 characters'),
	date: z.string().min(1, 'Date is required')
});

export type CreateTransactionSchema = typeof createTransactionSchema;

export const updateTransactionSchema = z.object({
	id: z.uuid('Invalid transaction ID'),
	type: z.enum(TRANSACTION_TYPES, {
		error: () => ({ message: 'Please select a transaction type' })
	}),
	categoryId: z.uuid('Please select a category'),
	accountId: z.uuid('Please select an account'),
	amount: z.coerce.number().int().positive('Amount must be positive'),
	description: z
		.string()
		.min(1, 'Description is required')
		.max(255, 'Description must be less than 255 characters'),
	date: z.string().min(1, 'Date is required')
});

export type UpdateTransactionSchema = typeof updateTransactionSchema;
