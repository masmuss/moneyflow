import { z } from 'zod';

export const ACCOUNT_TYPES = ['cash', 'bank', 'credit_card', 'savings'] as const;
export const CURRENCY_CODES = ['IDR', 'USD', 'EUR', 'SGD', 'MYR'] as const;

export const ACCOUNT_TYPE_LABELS: Record<(typeof ACCOUNT_TYPES)[number], string> = {
	cash: 'Cash',
	bank: 'Bank Account',
	credit_card: 'Credit Card',
	savings: 'Savings Account'
};

export const CURRENCY_LABELS: Record<(typeof CURRENCY_CODES)[number], string> = {
	IDR: '🇮🇩 IDR - Indonesian Rupiah',
	USD: '🇺🇸 USD - US Dollar',
	EUR: '🇪🇺 EUR - Euro',
	SGD: '🇸🇬 SGD - Singapore Dollar',
	MYR: '🇲🇾 MYR - Malaysian Ringgit'
};

export const createAccountSchema = z.object({
	name: z
		.string()
		.min(1, 'Account name is required')
		.max(100, 'Name must be less than 100 characters'),
	type: z.enum(ACCOUNT_TYPES, {
		error: () => ({ message: 'Please select a valid account type' })
	}),
	balance: z.coerce.number().int().min(0, 'Balance must be non-negative').default(0),
	currency: z
		.enum(CURRENCY_CODES, {
			error: () => ({ message: 'Please select a valid currency' })
		})
		.default('IDR')
});

export type CreateAccountSchema = typeof createAccountSchema;

export const updateAccountSchema = z.object({
	id: z.string().uuid('Invalid account ID'),
	name: z
		.string()
		.min(1, 'Account name is required')
		.max(100, 'Name must be less than 100 characters'),
	type: z.enum(ACCOUNT_TYPES, {
		error: () => ({ message: 'Please select a valid account type' })
	}),
	balance: z.coerce.number().int().min(0, 'Balance must be non-negative'),
	currency: z.enum(CURRENCY_CODES, {
		error: () => ({ message: 'Please select a valid currency' })
	})
});

export type UpdateAccountSchema = typeof updateAccountSchema;
