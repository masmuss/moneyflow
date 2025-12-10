<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import TransactionForm from './transaction-form.svelte';
	import { superValidate } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { updateTransactionSchema } from '../schema';
	import type { TransactionWithRelations } from '../types';
	import { invalidateAll } from '$app/navigation';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { UpdateTransactionSchema } from '../schema';
	import type { Category } from '$lib/features/categories/types';
	import type { Account } from '$lib/features/accounts/types';
	import { untrack } from 'svelte';

	let {
		transaction,
		categories,
		accounts,
		open = $bindable(false)
	}: {
		transaction: TransactionWithRelations | null;
		categories: Category[];
		accounts: Account[];
		open?: boolean;
	} = $props();

	let formData: SuperValidated<Infer<UpdateTransactionSchema>> | null = $state(null);
	let isLoading = $state(true);
	let formKey = $state(0);

	async function loadFormData() {
		if (!transaction) return;
		isLoading = true;
		try {
			formData = await superValidate(
				{
					id: transaction.id,
					type: transaction.type,
					categoryId: transaction.categoryId,
					accountId: transaction.accountId,
					amount: transaction.amount,
					description: transaction.description,
					date: transaction.date
				},
				zod4(updateTransactionSchema)
			);
			formKey++;
		} catch (error) {
			console.error('Error loading form data:', error);
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		if (open && transaction) {
			untrack(() => {
				loadFormData();
			});
		} else if (!open) {
			untrack(() => {
				formData = null;
				isLoading = true;
			});
		}
	});

	async function handleSuccess() {
		open = false;
		await invalidateAll();
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Edit Transaction</Sheet.Title>
			<Sheet.Description>Update your transaction details below.</Sheet.Description>
		</Sheet.Header>

		{#if isLoading}
			<div class="flex items-center justify-center py-8">
				<p class="text-muted-foreground">Loading...</p>
			</div>
		{:else if formData}
			{#key formKey}
				<div class="grid flex-1 auto-rows-min gap-6 px-4 py-4">
					<TransactionForm
						form={formData}
						mode="update"
						{categories}
						{accounts}
						onSuccess={handleSuccess}
					/>
				</div>
			{/key}
		{/if}
	</Sheet.Content>
</Sheet.Root>
