<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Select from '$lib/components/ui/select';
	import {
		createAccountSchema,
		type CreateAccountSchema,
		ACCOUNT_TYPES,
		ACCOUNT_TYPE_LABELS,
		CURRENCY_CODES,
		CURRENCY_LABELS
	} from '../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { formatIDRInput, parseIDRInput } from '$lib/utils/currency';

	let {
		form: formData,
		onSuccess
	}: {
		form: SuperValidated<Infer<CreateAccountSchema>>;
		onSuccess?: () => void;
	} = $props();

	const form = $derived(
		superForm(formData, {
			validators: zod4Client(createAccountSchema),
			onUpdated: ({ form: updatedForm }) => {
				if (updatedForm.valid) {
					toast.success('Account created successfully!', {
						description: `Account "${updatedForm.data.name}" has been created.`,
						duration: 4000
					});
					onSuccess?.();
				} else {
					toast.error('Failed to create account. Please check the form.');
				}
			}
		})
	);

	const { form: data, enhance, delayed } = $derived(form);

	let displayBalance = $state(formatIDRInput($data.balance || 0));

	function handleBalanceInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const rawValue = parseIDRInput(input.value);
		$data.balance = rawValue;
		displayBalance = formatIDRInput(rawValue);
	}
</script>

<form method="POST" action="?/create" use:enhance class="space-y-4">
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
			{#snippet children()}
				<Form.Label>Initial Balance</Form.Label>
				<InputGroup.Root>
					<InputGroup.Addon>
						<InputGroup.Text>Rp</InputGroup.Text>
					</InputGroup.Addon>
					<InputGroup.Input
						type="text"
						value={displayBalance}
						oninput={handleBalanceInput}
						inputmode="numeric"
						placeholder="0"
					/>
				</InputGroup.Root>
				<input type="hidden" name="balance" value={$data.balance} />
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
		{$delayed ? 'Creating...' : 'Create Account'}
	</Button>
</form>
