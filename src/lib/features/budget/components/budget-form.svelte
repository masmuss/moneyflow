<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import type { Category } from '$lib/features/categories/types';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import {
		createBudgetSchema,
		updateBudgetSchema,
		type CreateBudgetSchema,
		type UpdateBudgetSchema
	} from '../schema';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import CategoryIcon from '$lib/features/categories/components/category-icon.svelte';
	import { untrack } from 'svelte';

	type CreateFormData = SuperValidated<Infer<CreateBudgetSchema>>;
	type UpdateFormData = SuperValidated<Infer<UpdateBudgetSchema>>;

	type Props = {
		categories: Category[];
		form: CreateFormData | UpdateFormData;
		month: string;
		existingCategoryIds?: string[];
		mode?: 'create' | 'update';
		onSuccess?: () => void;
	};

	let {
		categories,
		form: formData,
		month,
		existingCategoryIds = [],
		mode = 'create',
		onSuccess
	}: Props = $props();

	// Filter out categories that already have budgets (only for create mode)
	const availableCategories = $derived(
		categories.filter(
			(c) => c.type === 'expense' && (mode === 'update' || !existingCategoryIds.includes(c.id))
		)
	);

	const form = untrack(() =>
		superForm(formData, {
			validators: mode === 'create' ? zod4(createBudgetSchema) : zod4(updateBudgetSchema),
			onUpdated: ({ form: updatedForm }) => {
				if (updatedForm.valid) {
					const action = mode === 'create' ? 'created' : 'updated';
					toast.success(`Budget ${action} successfully!`);
					onSuccess?.();
				} else {
					toast.error(`Failed to ${mode} budget. Please check the form.`);
				}
			}
		})
	);

	const { form: formStore, enhance, errors } = form;

	// Set month
	$effect(() => {
		$formStore.month = month;
	});

	// Format amount for display
	let displayAmount = $state(
		untrack(() => formData.data.amount) > 0
			? untrack(() => formData.data.amount).toLocaleString('id-ID')
			: ''
	);

	function handleAmountInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const value = input.value.replace(/\D/g, '');
		const numValue = parseInt(value) || 0;
		$formStore.amount = numValue;
		displayAmount = numValue > 0 ? numValue.toLocaleString('id-ID') : '';
	}
</script>

<form method="POST" action="?/{mode}" use:enhance class="space-y-4">
	{#if mode === 'update' && 'id' in $formStore}
		<input type="hidden" name="id" value={$formStore.id} />
	{/if}
	<input type="hidden" name="month" value={month} />

	<div class="space-y-2">
		<Label for="categoryId">Category</Label>
		<Select.Root type="single" name="categoryId" bind:value={$formStore.categoryId}>
			<Select.Trigger id="categoryId" class="w-full">
				{@const selected = availableCategories.find((c) => c.id === $formStore.categoryId)}
				{#if selected}
					<span class="flex items-center gap-2">
						<CategoryIcon name={selected.icon} color={selected.color} size={16} />
						{selected.name}
					</span>
				{:else}
					Select category
				{/if}
			</Select.Trigger>
			<Select.Content>
				{#each availableCategories as category}
					<Select.Item value={category.id}>
						<span class="flex items-center gap-2">
							<CategoryIcon name={category.icon} color={category.color} size={16} />
							{category.name}
						</span>
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		{#if $errors.categoryId}
			<p class="text-sm text-red-500">{$errors.categoryId}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="amount">Budget Amount</Label>
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
		<input type="hidden" name="amount" value={$formStore.amount} />
		{#if $errors.amount}
			<p class="text-sm text-red-500">{$errors.amount}</p>
		{/if}
	</div>

	<div class="flex gap-2 pt-4">
		<Button type="submit" class="flex-1">
			{mode === 'create' ? 'Create Budget' : 'Update Budget'}
		</Button>
	</div>
</form>
