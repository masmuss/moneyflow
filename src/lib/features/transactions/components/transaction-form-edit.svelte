<script lang="ts">
	import FormEditSheet from '$lib/components/wrapper/form-edit-sheet.svelte';
	import TransactionForm from './transaction-form.svelte';
	import { superValidate } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { updateTransactionSchema } from '../schema';
	import type { TransactionWithRelations } from '../types';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { UpdateTransactionSchema } from '../schema';
	import type { Category } from '$lib/features/categories/types';
	import type { Account } from '$lib/features/accounts/types';

	type FormData = SuperValidated<Infer<UpdateTransactionSchema>>;

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

	async function transformToFormData(data: TransactionWithRelations): Promise<FormData> {
		return await superValidate(
			{
				id: data.id,
				type: data.type,
				categoryId: data.categoryId,
				accountId: data.accountId,
				amount: data.amount,
				description: data.description,
				date: data.date
			},
			zod4(updateTransactionSchema)
		);
	}
</script>

<FormEditSheet
	bind:open
	data={transaction}
	title="Edit Transaction"
	description="Update your transaction details below."
	transformData={transformToFormData}
>
	{#snippet children({ form, onSuccess })}
		<TransactionForm {form} mode="update" {categories} {accounts} {onSuccess} />
	{/snippet}
</FormEditSheet>
