<script lang="ts">
	import TransactionList from '$lib/features/transactions/components/transaction-list.svelte';
	import TransactionFormWrapper from '$lib/features/transactions/components/transaction-form-wrapper.svelte';
	import TransactionFormEdit from '$lib/features/transactions/components/transaction-form-edit.svelte';
	import TransactionDeleteDialog from '$lib/features/transactions/components/transaction-delete-dialog.svelte';
	import TransactionFilter from '$lib/features/transactions/components/transaction-filter.svelte';

	import type { PageData } from './$types';
	import type { TransactionWithRelations } from '$lib/features/transactions/types';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let editingTransaction = $state<TransactionWithRelations | null>(null);
	let editSheetOpen = $state(false);
	let deleteDialogOpen = $state(false);
	let deletingTransactionId = $state<string | null>(null);
	let deletingTransactionDescription = $state('');
	let deletingTransactionAmount = $state(0);

	function handleEdit(transaction: TransactionWithRelations) {
		editingTransaction = transaction;
		editSheetOpen = true;
	}

	function handleDelete(id: string) {
		const transaction = data.transactions.find((t) => t.id === id);
		if (transaction) {
			deletingTransactionId = id;
			deletingTransactionDescription = transaction.description;
			deletingTransactionAmount = transaction.amount;
			deleteDialogOpen = true;
		}
	}

	async function confirmDelete() {
		if (!deletingTransactionId) return;

		try {
			const formData = new FormData();
			formData.append('id', deletingTransactionId);

			const response = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				toast.success('Transaction deleted successfully!', {
					duration: 4000
				});
				await invalidateAll();
			} else {
				toast.error('Failed to delete transaction');
			}
		} catch (error) {
			console.error('Delete error:', error);
			toast.error('An error occurred while deleting the transaction');
		}

		deleteDialogOpen = false;
		deletingTransactionId = null;
		deletingTransactionDescription = '';
		deletingTransactionAmount = 0;
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold tracking-tight">Transactions</h1>
		<TransactionFormWrapper {data} />
	</div>

	<TransactionFilter
		categories={data.categories}
		accounts={data.accounts}
		currentFilter={data.filter}
	/>

	<div class="space-y-6">
		{#if data.transactions.length === 0}
			<div class="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed">
				<p class="text-muted-foreground">No transactions found. Try adjusting your filters.</p>
			</div>
		{:else}
			<TransactionList
				transactions={data.transactions}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
		{/if}
	</div>
</div>

<TransactionFormEdit
	transaction={editingTransaction}
	categories={data.categories}
	accounts={data.accounts}
	bind:open={editSheetOpen}
/>

<TransactionDeleteDialog
	bind:open={deleteDialogOpen}
	description={deletingTransactionDescription}
	amount={deletingTransactionAmount}
	onConfirm={confirmDelete}
/>
