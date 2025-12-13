import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import type { CreateCategory } from './types';

export async function getCategories(userId: string) {
	return await db
		.select()
		.from(categories)
		.where(and(eq(categories.userId, userId), eq(categories.isActive, true)));
}

export async function getCategoryById(id: string, userId: string) {
	const result = await db
		.select()
		.from(categories)
		.where(and(eq(categories.id, id), eq(categories.userId, userId), eq(categories.isActive, true)))
		.limit(1);
	return result[0] || null;
}

export async function createCategory(data: CreateCategory) {
	const result = await db
		.insert(categories)
		.values({ ...data, isActive: true })
		.returning();
	return result[0] ?? null;
}

export async function updateCategory(id: string, userId: string, data: Partial<CreateCategory>) {
	const result = await db
		.update(categories)
		.set({
			...data,
			updatedAt: new Date()
		})
		.where(and(eq(categories.id, id), eq(categories.userId, userId)))
		.returning();
	return result[0] ?? null;
}

export async function deleteCategory(id: string, userId: string) {
	const result = await db
		.update(categories)
		.set({
			isActive: false,
			updatedAt: new Date()
		})
		.where(and(eq(categories.id, id), eq(categories.userId, userId)))
		.returning();

	return result[0] ?? null;
}

export async function getCategoriesByType(userId: string, type: 'income' | 'expense') {
	return await db
		.select()
		.from(categories)
		.where(
			and(eq(categories.userId, userId), eq(categories.type, type), eq(categories.isActive, true))
		);
}
