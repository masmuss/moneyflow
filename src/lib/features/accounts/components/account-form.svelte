<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import {
		createAccountSchema,
		updateAccountSchema,
		type CreateAccountSchema,
		type UpdateAccountSchema,
		ACCOUNT_TYPES,
		ACCOUNT_TYPE_LABELS,
		CURRENCY_CODES,
		CURRENCY_LABELS
	} from '../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { untrack } from 'svelte';
	import CurrencyInput from '$lib/components/ui/currency-input/currency-input.svelte';

	type CreateFormData = SuperValidated<Infer<CreateAccountSchema>>;
	type UpdateFormData = SuperValidated<Infer<UpdateAccountSchema>>;

	let {
		form: formData,
		mode = 'create',
		onSuccess
	}: {
		form: CreateFormData | UpdateFormData;
		mode?: 'create' | 'update';
		onSuccess?: () => void;
	} = $props();

	const form = untrack(() =>
		superForm(formData, {
			validators: mode === 'create' ? zod4(createAccountSchema) : zod4(updateAccountSchema),
			onUpdated: ({ form: updatedForm }) => {
				if (updatedForm.valid) {
					const action = mode === 'create' ? 'created' : 'updated';
					toast.success(`Account ${action} successfully!`, {
						description: `Account "${updatedForm.data.name}" has been ${action}.`,
						duration: 4000
					});
					onSuccess?.();
				} else {
					toast.error(`Failed to ${mode} account. Please check the form.`);
				}
			}
		})
	);

	const { form: data, enhance, delayed } = form;
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

	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Account Name</Form.Label>
				<Input {...props} bind:value={$data.name} placeholder="e.g. Main Wallet" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="type">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Account Type</Form.Label>
				<Select.Root type="single" bind:value={$data.type} name={props.name}>
					<Select.Trigger {...props} class="w-full">
						{$data.type ? ACCOUNT_TYPE_LABELS[$data.type] : 'Select account type'}
					</Select.Trigger>
					<Select.Content>
						{#each ACCOUNT_TYPES as type}
							<Select.Item value={type} label={ACCOUNT_TYPE_LABELS[type]}>
								{ACCOUNT_TYPE_LABELS[type]}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="balance">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Initial Balance</Form.Label>
				<CurrencyInput bind:value={$data.balance} name={props.name} />
			{/snippet}
		</Form.Control>
		<Form.Description>Enter amount in Rupiah (e.g., 10.000 for Rp 10.000)</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="currency">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Currency</Form.Label>
				<Select.Root type="single" bind:value={$data.currency} name={props.name}>
					<Select.Trigger {...props} class="w-full">
						{$data.currency
							? CURRENCY_LABELS[$data.currency as (typeof CURRENCY_CODES)[number]]
							: 'Select currency'}
					</Select.Trigger>
					<Select.Content>
						{#each CURRENCY_CODES as currency}
							<Select.Item value={currency} label={CURRENCY_LABELS[currency]}>
								{CURRENCY_LABELS[currency]}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
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
				? 'Create Account'
				: 'Update Account'}
	</Button>
</form>
