<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import CategoryIcon from '$lib/features/categories/components/category-icon.svelte';
	import type { Category } from '$lib/features/categories/types';

	type Props = {
		value: string;
		categories: Category[];
		filterByType?: 'income' | 'expense' | '';
		name?: string;
		label?: string;
		placeholder?: string;
		showEmptyMessage?: boolean;
	};

	let {
		value = $bindable(),
		categories,
		filterByType = '',
		name,
		label = 'Category',
		placeholder = 'Select category',
		showEmptyMessage = true
	}: Props = $props();

	const filteredCategories = $derived(
		filterByType ? categories.filter((c) => c.type === filterByType) : categories
	);

	const selectedCategory = $derived(categories.find((c) => c.id === value));
</script>

{#if label}
	<span class="text-sm font-medium">{label}</span>
{/if}
<Select.Root type="single" bind:value {name}>
	<Select.Trigger class="w-full">
		{#if value && selectedCategory}
			<div class="flex items-center gap-2">
				<CategoryIcon name={selectedCategory.icon} color={selectedCategory.color} size={16} />
				<span>{selectedCategory.name}</span>
			</div>
		{:else}
			{placeholder}
		{/if}
	</Select.Trigger>
	<Select.Content>
		{#if filteredCategories.length === 0 && showEmptyMessage}
			<div class="text-muted-foreground px-2 py-4 text-center text-sm">
				{filterByType ? `No ${filterByType} categories found` : 'No categories available'}
			</div>
		{:else}
			{#each filteredCategories as category}
				<Select.Item value={category.id} label={category.name}>
					<div class="flex items-center gap-2">
						<CategoryIcon name={category.icon} color={category.color} size={16} />
						<span>{category.name}</span>
					</div>
				</Select.Item>
			{/each}
		{/if}
	</Select.Content>
</Select.Root>
