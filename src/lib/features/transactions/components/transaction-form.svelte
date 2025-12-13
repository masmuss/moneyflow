<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { CurrencyInput } from '$lib/components/ui/currency-input';
	import { AccountSelect, CategorySelect, TypeSelect } from '$lib/components/form-fields';
	import {
		createTransactionSchema,
		updateTransactionSchema,
		type CreateTransactionSchema,
		type UpdateTransactionSchema
	} from '../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { untrack } from 'svelte';
	import type { Category } from '$lib/features/categories/types';
	import type { Account } from '$lib/features/accounts/types';

	type CreateFormData = SuperValidated<Infer<CreateTransactionSchema>>;
	type UpdateFormData = SuperValidated<Infer<UpdateTransactionSchema>>;

	let {
		form: formData,
		mode = 'create',
		categories,
		accounts,
		onSuccess
	}: {
		form: CreateFormData | UpdateFormData;
		mode?: 'create' | 'update';
		categories: Category[];
		accounts: Account[];
		onSuccess?: () => void;
	} = $props();

	const form = untrack(() =>
		superForm(formData, {
			validators: mode === 'create' ? zod4(createTransactionSchema) : zod4(updateTransactionSchema),
			onUpdated: ({ form: updatedForm }) => {
				if (updatedForm.valid) {
					const action = mode === 'create' ? 'created' : 'updated';
					toast.success(`Transaction ${action} successfully!`, { duration: 4000 });
					onSuccess?.();
				} else {
					toast.error(`Failed to ${mode} transaction. Please check the form.`);
				}
			}
		})
	);

	const { form: data, enhance, delayed } = form;

	$effect(() => {
		const currentType = $data.type;
		if (currentType) {
			const currentCategory = categories.find((c) => c.id === $data.categoryId);
			if (currentCategory && currentCategory.type !== currentType) {
				$data.categoryId = '';
			}
		}
	});
</script>

<form
	method="POST"
	action={mode === 'create' ? '?/create' : '?/update'}
	use:enhance
	class="space-y-4"
>
	{#if mode === 'update' && 'id' in $data}
		<input type="hidden" name="id" value={$data.id} />
	{/if}

	<Form.Field {form} name="type">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Type</Form.Label>
				<TypeSelect bind:value={$data.type} name={props.name} label="" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="accountId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Account</Form.Label>
				<AccountSelect bind:value={$data.accountId} {accounts} name={props.name} label="" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="categoryId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Category</Form.Label>
				<CategorySelect
					bind:value={$data.categoryId}
					{categories}
					filterByType={$data.type}
					name={props.name}
					label=""
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="amount">
		<Form.Control>
			{#snippet children()}
				<Form.Label>Amount</Form.Label>
				<CurrencyInput bind:value={$data.amount} name="amount" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Input {...props} bind:value={$data.description} placeholder="e.g. Lunch at restaurant" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="date">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Date</Form.Label>
				<Input {...props} type="date" bind:value={$data.date} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Button type="submit" class="w-full" disabled={$delayed}>
		{$delayed
			? mode === 'create'
				? 'Creating...'
				: 'Updating...'
			: mode === 'create'
				? 'Create Transaction'
				: 'Update Transaction'}
	</Button>
</form>
