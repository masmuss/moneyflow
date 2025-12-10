<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { CircleChevronUp, CircleChevronDown } from '@lucide/svelte';
	import { formatIDR } from '$lib/utils/currency';
	import type { RecentTransaction } from '../dashboard.server';
	import CategoryIcon from '$lib/features/categories/components/category-icon.svelte';

	let { transactions }: { transactions: RecentTransaction[] } = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Recent Transactions</Card.Title>
		<Card.Description>Your latest financial activities</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if transactions.length === 0}
			<div class="flex min-h-[100px] items-center justify-center">
				<p class="text-muted-foreground text-sm">No transactions yet</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each transactions as transaction (transaction.id)}
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div
								class="flex h-9 w-9 items-center justify-center rounded-full {transaction.type ===
								'income'
									? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
									: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}"
							>
								{#if transaction.type === 'income'}
									<CircleChevronUp class="h-4 w-4" />
								{:else}
									<CircleChevronDown class="h-4 w-4" />
								{/if}
							</div>
							<div class="flex flex-col">
								<span class="text-sm font-medium">{transaction.description}</span>
								<div class="text-muted-foreground flex items-center gap-1 text-xs">
									{#if transaction.categoryName}
										<CategoryIcon
											name={transaction.categoryIcon}
											color={transaction.categoryColor || '#6366f1'}
											size={10}
										/>
										<span>{transaction.categoryName}</span>
										<span>•</span>
									{/if}
									<span>{transaction.accountName}</span>
								</div>
							</div>
						</div>
						<div class="text-right">
							<span
								class="text-sm font-medium {transaction.type === 'income'
									? 'text-green-600 dark:text-green-400'
									: 'text-red-600 dark:text-red-400'}"
							>
								{transaction.type === 'income' ? '+' : '-'}{formatIDR(transaction.amount)}
							</span>
							<p class="text-muted-foreground text-xs">
								{new Date(transaction.date).toLocaleDateString('id-ID', {
									day: 'numeric',
									month: 'short'
								})}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
