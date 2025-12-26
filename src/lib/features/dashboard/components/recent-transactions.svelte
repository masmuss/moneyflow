<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Empty from '$lib/components/ui/empty';
	import { Receipt, ArrowUp, ArrowDown } from '@lucide/svelte';
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
			<Empty.State
				icon={Receipt}
				title="No Transactions"
				description="No transactions yet"
				class="border-0"
			/>
		{:else}
			<div class="space-y-4">
				{#each transactions as transaction (transaction.id)}
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div
								class="flex h-9 w-9 items-center justify-center rounded-md {transaction.type ===
								'income'
									? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
									: 'bg-destructive/30 text-destructive'}"
							>
								{#if transaction.type === 'income'}
									<ArrowUp class="h-4 w-4" />
								{:else}
									<ArrowDown class="h-4 w-4" />
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
									: 'text-destructive'}"
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
