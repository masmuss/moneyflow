import { z } from 'zod';

export const CATEGORY_TYPES = ['income', 'expense'] as const;

export const CATEGORY_TYPE_LABELS: Record<(typeof CATEGORY_TYPES)[number], string> = {
	income: 'Income',
	expense: 'Expense'
};

// Preset colors for categories
export const CATEGORY_COLORS = [
	'#ef4444', // red
	'#f97316', // orange
	'#f59e0b', // amber
	'#eab308', // yellow
	'#84cc16', // lime
	'#22c55e', // green
	'#10b981', // emerald
	'#14b8a6', // teal
	'#06b6d4', // cyan
	'#0ea5e9', // sky
	'#3b82f6', // blue
	'#6366f1', // indigo
	'#8b5cf6', // violet
	'#a855f7', // purple
	'#d946ef', // fuchsia
	'#ec4899', // pink
	'#f43f5e', // rose
	'#64748b' // slate
] as const;

// Preset icons for categories (lucide icon names)
export const CATEGORY_ICONS = [
	'Utensils', // food
	'Car', // transport
	'Home', // housing
	'ShoppingBag', // shopping
	'Gamepad2', // entertainment
	'Heart', // health
	'GraduationCap', // education
	'Plane', // travel
	'Wallet', // salary
	'TrendingUp', // investment
	'Gift', // gifts
	'Zap', // utilities
	'Phone', // phone/internet
	'Coffee', // cafe
	'Shirt', // clothing
	'Dumbbell', // fitness
	'Baby', // kids
	'PawPrint', // pets
	'MoreHorizontal' // other
] as const;

export const CATEGORY_ICON_LABELS: Record<(typeof CATEGORY_ICONS)[number], string> = {
	Utensils: 'Food & Dining',
	Car: 'Transportation',
	Home: 'Housing',
	ShoppingBag: 'Shopping',
	Gamepad2: 'Entertainment',
	Heart: 'Healthcare',
	GraduationCap: 'Education',
	Plane: 'Travel',
	Wallet: 'Salary',
	TrendingUp: 'Investment',
	Gift: 'Gifts',
	Zap: 'Utilities',
	Phone: 'Phone & Internet',
	Coffee: 'Cafe & Drinks',
	Shirt: 'Clothing',
	Dumbbell: 'Fitness',
	Baby: 'Kids',
	PawPrint: 'Pets',
	MoreHorizontal: 'Other'
};

export const createCategorySchema = z.object({
	name: z
		.string()
		.min(1, 'Category name is required')
		.max(50, 'Name must be less than 50 characters'),
	type: z.enum(CATEGORY_TYPES, {
		error: () => ({ message: 'Please select a category type' })
	}),
	color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
	icon: z.string().optional()
});

export type CreateCategorySchema = typeof createCategorySchema;

export const updateCategorySchema = z.object({
	id: z.uuid('Invalid category ID'),
	name: z
		.string()
		.min(1, 'Category name is required')
		.max(50, 'Name must be less than 50 characters'),
	type: z.enum(CATEGORY_TYPES, {
		error: () => ({ message: 'Please select a category type' })
	}),
	color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
	icon: z.string().optional()
});

export type UpdateCategorySchema = typeof updateCategorySchema;
