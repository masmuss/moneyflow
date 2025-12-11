<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import type { Category } from '$lib/features/categories/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { CreateBudgetInput } from '../schema';
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import CategoryIcon from '$lib/features/categories/components/category-icon.svelte';

	type Props = {
		categories: Category[];
		form: SuperValidated<CreateBudgetInput>;
		month: string;
		existingCategoryIds: string[];
		onSuccess?: () => void;
	};

	let { categories, form: formData, month, existingCategoryIds, onSuccess }: Props = $props();

	// Filter out categories that already have budgets
	const availableCategories = $derived(
		categories.filter((c) => c.type === 'expense' && !existingCategoryIds.includes(c.id))
	);

	const form = superForm(
		{
			get data() {
				return formData;
			}
		}.data,
		{
			onResult: ({ result }) => {
				if (result.type === 'success') {
					toast.success('Budget created successfully!');
					onSuccess?.();
					invalidateAll();
				}
			},
			onError: ({ result }) => {
				toast.error(result.error?.message || 'Failed to create budget');
			}
		}
	);

	const { form: formStore, enhance, errors } = form;

	// Set month
	$effect(() => {
		$formStore.month = month;
	});

	// Format amount for display
	let displayAmount = $state('');

	function handleAmountInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const value = input.value.replace(/\D/g, '');
		const numValue = parseInt(value) || 0;
		$formStore.amount = numValue;
		displayAmount = numValue > 0 ? numValue.toLocaleString('id-ID') : '';
	}

	// Sync display when form value changes externally
	$effect(() => {
		if ($formStore.amount && $formStore.amount > 0) {
			displayAmount = $formStore.amount.toLocaleString('id-ID');
		}
	});
</script>

<form method="POST" action="?/create" use:enhance class="space-y-4">
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
		<Button type="submit" class="flex-1">Create Budget</Button>
	</div>
</form>
