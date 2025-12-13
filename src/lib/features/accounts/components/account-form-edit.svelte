<script lang="ts">
	import FormEditSheet from '$lib/components/wrapper/form-edit-sheet.svelte';
	import AccountForm from './account-form.svelte';
	import { superValidate } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { updateAccountSchema } from '../schema';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { UpdateAccountSchema } from '../schema';
	import type { Account } from '../types';

	type FormData = SuperValidated<Infer<UpdateAccountSchema>>;

	let {
		account,
		open = $bindable(false)
	}: {
		account: Account | null;
		open?: boolean;
	} = $props();

	async function transformToFormData(data: Account): Promise<FormData> {
		return await superValidate(
			{
				id: data.id,
				name: data.name,
				type: data.type,
				balance: data.balance ?? 0,
				currency: data.currency
			},
			zod4(updateAccountSchema)
		);
	}
</script>

<FormEditSheet
	bind:open
	data={account}
	title="Edit Account"
	description="Update your account details below."
	transformData={transformToFormData}
>
	{#snippet children({ form, onSuccess })}
		<AccountForm {form} mode="update" {onSuccess} />
	{/snippet}
</FormEditSheet>
