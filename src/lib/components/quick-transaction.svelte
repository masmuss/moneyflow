<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Select from '$lib/components/ui/select';
	import * as Sheet from '$lib/components/ui/sheet';
	import {
		createTransactionSchema,
		type CreateTransactionSchema,
		TRANSACTION_TYPES,
		TRANSACTION_TYPE_LABELS
	} from '$lib/features/transactions/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { untrack } from 'svelte';
	import { formatIDRInput, parseIDRInput } from '$lib/utils/currency';
	import type { Category } from '$lib/features/categories/types';
	import type { Account } from '$lib/features/accounts/types';
	import CategoryIcon from '$lib/features/categories/components/category-icon.svelte';
	import CirclePlus from '@lucide/svelte/icons/circle-plus';
	import { invalidateAll } from '$app/navigation';

	type Props = {
		form: SuperValidated<Infer<CreateTransactionSchema>>;
		categories: Category[];
		accounts: Account[];
	};

	let { form: formData, categories, accounts }: Props = $props();

	let open = $state(false);

	const form = untrack(() =>
		superForm(formData, {
			validators: zod4(createTransactionSchema),
			resetForm: true,
			onUpdated: ({ form: updatedForm }) => {
				if (updatedForm.valid) {
					toast.success('Transaction created successfully!', {
						duration: 4000
					});
					open = false;
					invalidateAll();
				} else {
					toast.error('Failed to create transaction. Please check the form.');
				}
			}
		})
	);

	const { form: data, enhance, delayed } = form;

	const filteredCategories = $derived(
		$data.type ? categories.filter((c) => c.type === $data.type) : categories
	);

	let displayAmount = $state('0');

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

	function resetForm() {
		displayAmount = '0';
	}
</script>

<Sheet.Root bind:open onOpenChange={(isOpen) => !isOpen && resetForm()}>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				class="bg-primary text-primary-foreground hover:bg-primary/90 w-full justify-start gap-2"
			>
				<CirclePlus class="h-4 w-4" />
				<span>Quick Create</span>
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content side="right" class="w-full sm:max-w-md">
		<Sheet.Header>
			<Sheet.Title>Quick Add Transaction</Sheet.Title>
			<Sheet.Description>Add a new transaction quickly from anywhere.</Sheet.Description>
		</Sheet.Header>
		<div class="grid flex-1 auto-rows-min gap-6 px-4">
			<form method="POST" action="/transactions?/create" use:enhance class="mt-6 space-y-4">
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

				<Form.Field {form} name="amount">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Amount</Form.Label>
							<InputGroup.Root>
								<InputGroup.Addon>
									<InputGroup.Text>Rp</InputGroup.Text>
								</InputGroup.Addon>
								<InputGroup.Input
									{...props}
									type="text"
									inputmode="numeric"
									value={displayAmount}
									oninput={handleAmountInput}
									placeholder="0"
								/>
							</InputGroup.Root>
							<input type="hidden" name="amount" value={$data.amount} />
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
									{#each filteredCategories as category}
										<Select.Item value={category.id} label={category.name}>
											<div class="flex items-center gap-2">
												<CategoryIcon name={category.icon} color={category.color} size={16} />
												<span>{category.name}</span>
											</div>
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Description</Form.Label>
							<InputGroup.Root>
								<InputGroup.Input
									{...props}
									type="text"
									bind:value={$data.description}
									placeholder="Enter description"
								/>
							</InputGroup.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="date">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Date</Form.Label>
							<InputGroup.Root>
								<InputGroup.Input {...props} type="date" bind:value={$data.date} />
							</InputGroup.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<div class="flex gap-2 pt-4">
					<Button type="button" variant="outline" class="flex-1" onclick={() => (open = false)}>
						Cancel
					</Button>
					<Button type="submit" class="flex-1" disabled={$delayed}>
						{$delayed ? 'Saving...' : 'Add Transaction'}
					</Button>
				</div>
			</form>
		</div>
	</Sheet.Content>
</Sheet.Root>
