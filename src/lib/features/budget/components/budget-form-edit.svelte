<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Select from '$lib/components/ui/select';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import type { Category } from '$lib/features/categories/types';
	import type { BudgetWithSpending } from '../types';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import CategoryIcon from '$lib/features/categories/components/category-icon.svelte';

	type Props = {
		budget: BudgetWithSpending | null;
		categories: Category[];
		open: boolean;
	};

	let { budget, categories, open = $bindable(false) }: Props = $props();

	let categoryId = $state('');
	let amount = $state(0);
	let displayAmount = $state('');

	// Sync state when budget changes
	$effect(() => {
		if (budget) {
			categoryId = budget.categoryId;
			amount = budget.amount;
			displayAmount = budget.amount > 0 ? budget.amount.toLocaleString('id-ID') : '';
		}
	});

	// Only expense categories
	const expenseCategories = $derived(categories.filter((c) => c.type === 'expense'));

	function handleAmountInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const value = input.value.replace(/\D/g, '');
		const numValue = parseInt(value) || 0;
		amount = numValue;
		displayAmount = numValue > 0 ? numValue.toLocaleString('id-ID') : '';
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!budget) return;

		const formData = new FormData();
		formData.append('id', budget.id);
		formData.append('categoryId', categoryId);
		formData.append('amount', amount.toString());
		formData.append('month', budget.month);

		try {
			const response = await fetch('?/update', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				toast.success('Budget updated successfully!');
				open = false;
				await invalidateAll();
			} else {
				toast.error('Failed to update budget');
			}
		} catch (error) {
			console.error('Update error:', error);
			toast.error('An error occurred');
		}
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Edit Budget</Sheet.Title>
			<Sheet.Description>Update the budget amount for this category.</Sheet.Description>
		</Sheet.Header>

		{#if budget}
			<div class="grid flex-1 auto-rows-min gap-6 px-4">
				<form onsubmit={handleSubmit} class="mt-6 space-y-4">
					<div class="space-y-2">
						<Label for="categoryId">Category</Label>
						<Select.Root type="single" name="categoryId" bind:value={categoryId}>
							<Select.Trigger id="categoryId" class="w-full">
								{@const selected = expenseCategories.find((c) => c.id === categoryId)}
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
								{#each expenseCategories as category}
									<Select.Item value={category.id}>
										<span class="flex items-center gap-2">
											<CategoryIcon name={category.icon} color={category.color} size={16} />
											{category.name}
										</span>
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
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
					</div>

					<div class="flex gap-2 pt-4">
						<Button type="submit" class="flex-1">Update Budget</Button>
						<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
					</div>
				</form>
			</div>
		{/if}
	</Sheet.Content>
</Sheet.Root>
