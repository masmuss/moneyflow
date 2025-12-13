<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Empty from '$lib/components/ui/empty';
	import { formatIDR } from '$lib/utils/currency';
	import CategoryIcon from '$lib/features/categories/components/category-icon.svelte';
	import type { CategoryBreakdown } from '../types';
	import Tags from '@lucide/svelte/icons/tags';

	type Props = {
		title: string;
		data: CategoryBreakdown[];
		emptyMessage?: string;
	};

	let { title, data, emptyMessage = 'No data available' }: Props = $props();

	const total = $derived(data.reduce((sum, d) => sum + d.amount, 0));
</script>

<Card.Root class="h-full">
	<Card.Header>
		<Card.Title class="text-base">{title}</Card.Title>
		<Card.Description>
			{data.length} categor{data.length === 1 ? 'y' : 'ies'} · {formatIDR(total)} total
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if data.length === 0}
			<Empty.State icon={Tags} title="No Categories" description={emptyMessage} class="border-0" />
		{:else}
			<div class="space-y-4">
				{#each data as category}
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full"
									style="background-color: {category.categoryColor}20"
								>
									<CategoryIcon
										name={category.categoryIcon}
										color={category.categoryColor}
										size={16}
									/>
								</div>
								<div>
									<p class="text-sm font-medium">{category.categoryName}</p>
									<p class="text-muted-foreground text-xs">
										{category.transactionCount} transaction{category.transactionCount !== 1
											? 's'
											: ''}
									</p>
								</div>
							</div>
							<div class="text-right">
								<p class="text-sm font-medium">{formatIDR(category.amount)}</p>
								<p class="text-muted-foreground text-xs">{category.percentage}%</p>
							</div>
						</div>
						<div class="bg-muted h-2 w-full overflow-hidden rounded-full">
							<div
								class="h-full rounded-full transition-all"
								style="width: {category.percentage}%; background-color: {category.categoryColor}"
							></div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
