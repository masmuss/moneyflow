<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { EllipsisVertical, Pencil, Trash2, CircleArrowUp, CircleArrowDown } from '@lucide/svelte';
	import type { TransactionWithRelations } from '../types';
	import { formatIDR } from '$lib/utils/currency';
	import CategoryIcon from '$lib/features/categories/components/category-icon.svelte';

	let {
		transaction,
		onEdit,
		onDelete
	}: {
		transaction: TransactionWithRelations;
		onEdit?: (transaction: TransactionWithRelations) => void;
		onDelete?: (id: string) => void;
	} = $props();

	const formattedDate = $derived(
		new Date(transaction.date).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		})
	);

	const formattedAmount = $derived(formatIDR(transaction.amount));
</script>

<div
	class="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
>
	<div class="flex items-center gap-4">
		<!-- Type Icon -->
		<div
			class="flex h-10 w-10 items-center justify-center rounded-full {transaction.type === 'income'
				? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
				: 'dark:bg-destructive/30 bg-destructive/10 text-destructive'}"
		>
			{#if transaction.type === 'income'}
				<CircleArrowUp class="h-5 w-5" />
			{:else}
				<CircleArrowDown class="h-5 w-5" />
			{/if}
		</div>

		<!-- Details -->
		<div class="flex flex-col">
			<span class="font-medium">{transaction.description}</span>
			<div class="text-muted-foreground flex items-center gap-2 text-sm">
				{#if transaction.category}
					<div class="flex items-center gap-1">
						<CategoryIcon
							name={transaction.category.icon}
							color={transaction.category.color}
							size={12}
						/>
						<span>{transaction.category.name}</span>
					</div>
					<span>•</span>
				{/if}
				<span>{transaction.account.name}</span>
				<span>•</span>
				<span>{formattedDate}</span>
			</div>
		</div>
	</div>

	<div class="flex items-center gap-4">
		<!-- Amount -->
		<span
			class="font-semibold {transaction.type === 'income'
				? 'text-green-600 dark:text-green-400'
				: 'text-destructive'}"
		>
			{transaction.type === 'income' ? '+' : '-'}{formattedAmount}
		</span>

		<!-- Actions -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon"
						class="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<EllipsisVertical class="h-4 w-4" />
						<span class="sr-only">Open menu</span>
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item onclick={() => onEdit?.(transaction)}>
					<Pencil class="mr-2 h-4 w-4" />
					Edit
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					class="text-destructive focus:text-destructive"
					onclick={() => onDelete?.(transaction.id)}
				>
					<Trash2 class="mr-2 h-4 w-4" />
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
