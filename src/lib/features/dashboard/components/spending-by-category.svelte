<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { formatIDR } from '$lib/utils/currency';
	import type { SpendingByCategory } from '../dashboard.server';
	import CategoryIcon from '$lib/features/categories/components/category-icon.svelte';

	let { spending }: { spending: SpendingByCategory[] } = $props();

	const totalSpending = $derived(spending.reduce((sum, s) => sum + s.total, 0));

	function getPercentage(amount: number): number {
		if (totalSpending === 0) return 0;
		return Math.round((amount / totalSpending) * 100);
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Spending by Category</Card.Title>
		<Card.Description>
			{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if spending.length === 0}
			<div class="flex min-h-[100px] items-center justify-center">
				<p class="text-muted-foreground text-sm">No expenses this month</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each spending as category (category.categoryId)}
					{@const percentage = getPercentage(category.total)}
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<div
									class="flex h-6 w-6 items-center justify-center rounded"
									style="background-color: {category.categoryColor}20;"
								>
									<CategoryIcon
										name={category.categoryIcon}
										color={category.categoryColor}
										size={14}
									/>
								</div>
								<span class="text-sm font-medium">{category.categoryName}</span>
							</div>
							<div class="text-right">
								<span class="text-sm font-medium">{formatIDR(category.total)}</span>
								<span class="text-muted-foreground ml-2 text-xs">({percentage}%)</span>
							</div>
						</div>
						<div class="bg-muted h-2 w-full overflow-hidden rounded-full">
							<div
								class="h-2 rounded-full transition-all duration-500"
								style="width: {percentage}%; background-color: {category.categoryColor};"
							></div>
						</div>
					</div>
				{/each}

				<!-- Total -->
				<div class="border-t pt-4">
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium">Total Spending</span>
						<span class="text-lg font-bold">{formatIDR(totalSpending)}</span>
					</div>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
