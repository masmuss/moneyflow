<script lang="ts">
	import type { TransactionWithRelations } from '../types';
	import TransactionRow from './transaction-row.svelte';

	let {
		transactions,
		onEdit,
		onDelete
	}: {
		transactions: TransactionWithRelations[];
		onEdit?: (transaction: TransactionWithRelations) => void;
		onDelete?: (id: string) => void;
	} = $props();
</script>

<div class="flex flex-col gap-2">
	{#each transactions as transaction (transaction.id)}
		<TransactionRow {transaction} {onEdit} {onDelete} />
	{/each}
</div>
