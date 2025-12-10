import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import type { CreateCategory } from './types';

export async function getCategories() {
	return await db.select().from(categories).where(eq(categories.isActive, true));
}

export async function getCategoryById(id: string) {
	const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
	return result[0] || null;
}

export async function createCategory(data: CreateCategory) {
	const result = await db
		.insert(categories)
		.values({
			name: data.name,
			type: data.type,
			color: data.color,
			icon: data.icon,
			isActive: true
		})
		.returning();
	return result[0];
}

export async function updateCategory(id: string, data: Partial<CreateCategory>) {
	const result = await db
		.update(categories)
		.set({
			...data,
			updatedAt: new Date()
		})
		.where(eq(categories.id, id))
		.returning();
	return result[0];
}

export async function deleteCategory(id: string) {
	const result = await db
		.update(categories)
		.set({
			isActive: false,
			updatedAt: new Date()
		})
		.where(eq(categories.id, id))
		.returning();
	return result[0];
}

export async function getCategoriesByType(type: 'income' | 'expense') {
	return await db
		.select()
		.from(categories)
		.where(and(eq(categories.type, type), eq(categories.isActive, true)));
}
