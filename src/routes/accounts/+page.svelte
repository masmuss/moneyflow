<script lang="ts">
	import AccountList from '$lib/features/accounts/components/account-list.svelte';
	import AccountFormWrapper from '$lib/features/accounts/components/account-form-wrapper.svelte';
	import AccountFormEdit from '$lib/features/accounts/components/account-form-edit.svelte';
	import AccountDeleteDialog from '$lib/features/accounts/components/account-delete-dialog.svelte';

	import type { PageData } from './$types';
	import type { Account } from '$lib/features/accounts/types';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let editingAccount = $state<Account | null>(null);
	let editSheetOpen = $state(false);
	let deleteDialogOpen = $state(false);
	let deletingAccountId = $state<string | null>(null);

	function handleEdit(account: Account) {
		editingAccount = account;
		editSheetOpen = true;
	}

	function handleDelete(id: string) {
		const account = data.accounts.find((a) => a.id === id);
		if (account) {
			deletingAccountId = id;
			deleteDialogOpen = true;
		}
	}

	async function confirmDelete() {
		if (!deletingAccountId) return;

		try {
			const formData = new FormData();
			formData.append('id', deletingAccountId);

			const response = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				toast.success('Account deleted successfully!', {
					duration: 4000
				});
				await invalidateAll();
			} else {
				toast.error('Failed to delete account');
			}
		} catch (error) {
			console.error('Delete error:', error);
			toast.error('An error occurred while deleting the account');
		}

		deleteDialogOpen = false;
		deletingAccountId = null;
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold tracking-tight">Accounts</h1>
		<AccountFormWrapper {data} />
	</div>

	<div class="space-y-6">
		{#if data.accounts.length === 0}
			<div class="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed">
				<p class="text-muted-foreground">No accounts found. Create one to get started.</p>
			</div>
		{:else}
			<AccountList accounts={data.accounts} onEdit={handleEdit} onDelete={handleDelete} />
		{/if}
	</div>
</div>

<AccountFormEdit account={editingAccount} bind:open={editSheetOpen} />

<AccountDeleteDialog
	open={deleteDialogOpen}
	accountName={data.accounts.find((a) => a.id === deletingAccountId)?.name || ''}
	onConfirm={confirmDelete}
	onCancel={() => {
		deleteDialogOpen = false;
		deletingAccountId = null;
	}}
/>
