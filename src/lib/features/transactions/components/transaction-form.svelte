<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Select from '$lib/components/ui/select';
	import {
		createTransactionSchema,
		updateTransactionSchema,
		type CreateTransactionSchema,
		type UpdateTransactionSchema,
		TRANSACTION_TYPES,
		TRANSACTION_TYPE_LABELS
	} from '../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { untrack } from 'svelte';
	import { formatIDRInput, parseIDRInput } from '$lib/utils/currency';
	import type { Category } from '$lib/features/categories/types';
	import type { Account } from '$lib/features/accounts/types';
	import CategoryIcon from '$lib/features/categories/components/category-icon.svelte';

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
					toast.success(`Transaction ${action} successfully!`, {
						duration: 4000
					});
					onSuccess?.();
				} else {
					toast.error(`Failed to ${mode} transaction. Please check the form.`);
				}
			}
		})
	);

	const { form: data, enhance, delayed } = form;

	const filteredCategories = $derived(
		$data.type ? categories.filter((c) => c.type === $data.type) : categories
	);

	let displayAmount = $state(formatIDRInput(untrack(() => formData.data.amount) || 0));

	function handleAmountInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const rawValue = parseIDRInput(input.value);
		$data.amount = rawValue;
		displayAmount = formatIDRInput(rawValue);
	}

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
				<Select.Root type="single" bind:value={$data.type} name={props.name}>
					<Select.Trigger {...props} class="w-full">
						{$data.type ? TRANSACTION_TYPE_LABELS[$data.type] : 'Select type'}
					</Select.Trigger>
					<Select.Content>
						{#each TRANSACTION_TYPES as type}
							<Select.Item value={type} label={TRANSACTION_TYPE_LABELS[type]}>
								{TRANSACTION_TYPE_LABELS[type]}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="accountId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Account</Form.Label>
				<Select.Root type="single" bind:value={$data.accountId} name={props.name}>
					<Select.Trigger {...props} class="w-full">
						{#if $data.accountId}
							{@const account = accounts.find((a) => a.id === $data.accountId)}
							{account?.name || 'Select account'}
						{:else}
							Select account
						{/if}
					</Select.Trigger>
					<Select.Content>
						{#each accounts as account}
							<Select.Item value={account.id} label={account.name}>
								{account.name}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="categoryId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Category</Form.Label>
				<Select.Root type="single" bind:value={$data.categoryId} name={props.name}>
					<Select.Trigger {...props} class="w-full">
						{#if $data.categoryId}
							{@const category = categories.find((c) => c.id === $data.categoryId)}
							{#if category}
								<div class="flex items-center gap-2">
									<CategoryIcon name={category.icon} color={category.color} size={16} />
									<span>{category.name}</span>
								</div>
							{:else}
								Select category
							{/if}
						{:else}
							Select category
						{/if}
					</Select.Trigger>
					<Select.Content>
						{#if filteredCategories.length === 0}
							<div class="text-muted-foreground px-2 py-4 text-center text-sm">
								{$data.type ? `No ${$data.type} categories found` : 'Select a type first'}
							</div>
						{:else}
							{#each filteredCategories as category}
								<Select.Item value={category.id} label={category.name}>
									<div class="flex items-center gap-2">
										<CategoryIcon name={category.icon} color={category.color} size={16} />
										<span>{category.name}</span>
									</div>
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="amount">
		<Form.Control>
			{#snippet children()}
				<Form.Label>Amount</Form.Label>
				<InputGroup.Root>
					<InputGroup.Addon>
						<InputGroup.Text>Rp</InputGroup.Text>
					</InputGroup.Addon>
					<InputGroup.Input
						type="text"
						value={displayAmount}
						oninput={handleAmountInput}
						inputmode="numeric"
						placeholder="0"
					/>
				</InputGroup.Root>
				<input type="hidden" name="amount" value={$data.amount} />
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
