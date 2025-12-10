<script lang="ts">
	import type { Category } from '../types';
	import CategoryCard from './category-card.svelte';

	let {
		categories,
		onEdit,
		onDelete
	}: {
		categories: Category[];
		onEdit?: (category: Category) => void;
		onDelete?: (id: string) => void;
	} = $props();
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each categories as category (category.id)}
		<CategoryCard {category} {onEdit} {onDelete} />
	{/each}
</div>
