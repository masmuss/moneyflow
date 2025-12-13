<script lang="ts">
	import {
		BudgetList,
		BudgetSummary,
		BudgetFormWrapper,
		BudgetFormEdit,
		BudgetDeleteDialog
	} from '$lib/features/budget/components';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight, Copy } from '@lucide/svelte';
	import type { PageData } from './$types';
	import type { BudgetWithSpending } from '$lib/features/budget/types';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props();

	let editingBudget = $state<BudgetWithSpending | null>(null);
	let editSheetOpen = $state(false);
	let deleteDialogOpen = $state(false);
	let deletingBudgetId = $state<string | null>(null);
	let deletingCategoryName = $state('');
	let deletingAmount = $state(0);

	// Format month for display
	function formatMonth(month: string): string {
		const [year, m] = month.split('-').map(Number);
		const date = new Date(year, m - 1);
		return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	}

	// Navigate to previous/next month
	function navigateMonth(direction: -1 | 1) {
		const [year, month] = data.month.split('-').map(Number);
		const newDate = new Date(year, month - 1 + direction);
		const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
		goto(`/budget?month=${newMonth}`);
	}

	// Get existing category IDs for filtering in form
	const existingCategoryIds = $derived(data.budgetSummary.budgets.map((b) => b.categoryId));

	function handleEdit(budget: BudgetWithSpending) {
		editingBudget = budget;
		editSheetOpen = true;
	}

	function handleDelete(id: string) {
		const budget = data.budgetSummary.budgets.find((b) => b.id === id);
		if (budget) {
			deletingBudgetId = id;
			deletingCategoryName = budget.category.name;
			deletingAmount = budget.amount;
			deleteDialogOpen = true;
		}
	}

	async function confirmDelete() {
		if (!deletingBudgetId) return;

		try {
			const formData = new FormData();
			formData.append('id', deletingBudgetId);

			const response = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				toast.success('Budget deleted successfully!');
				await invalidateAll();
			} else {
				toast.error('Failed to delete budget');
			}
		} catch (error) {
			console.error('Delete error:', error);
			toast.error('An error occurred');
		}

		deleteDialogOpen = false;
		deletingBudgetId = null;
	}

	async function copyFromPreviousMonth() {
		try {
			const formData = new FormData();
			formData.append('month', data.month);

			const response = await fetch('?/copyFromPrevious', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				if (result.data?.copiedCount > 0) {
					toast.success(`Copied ${result.data.copiedCount} budget(s) from previous month`);
					await invalidateAll();
				} else {
					toast.info('No budgets to copy from previous month');
				}
			} else {
				toast.error('Failed to copy budgets');
			}
		} catch (error) {
			console.error('Copy error:', error);
			toast.error('An error occurred');
		}
	}
</script>

<div class="flex flex-col gap-6">
	<!-- Header with month navigation -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center gap-2">
			<Button variant="outline" size="icon" onclick={() => navigateMonth(-1)}>
				<ChevronLeft class="h-4 w-4" />
			</Button>
			<h1 class="min-w-[200px] text-center text-2xl font-bold tracking-tight">
				{formatMonth(data.month)}
			</h1>
			<Button variant="outline" size="icon" onclick={() => navigateMonth(1)}>
				<ChevronRight class="h-4 w-4" />
			</Button>
		</div>

		<div class="flex gap-2">
			{#if data.budgetSummary.budgets.length === 0}
				<Button variant="outline" size="sm" onclick={copyFromPreviousMonth}>
					<Copy class="mr-2 h-4 w-4" />
					Copy from Last Month
				</Button>
			{/if}
			<BudgetFormWrapper
				categories={data.categories}
				form={data.form}
				month={data.month}
				{existingCategoryIds}
			/>
		</div>
	</div>

	<!-- Summary Card -->
	{#if data.budgetSummary.budgets.length > 0}
		<BudgetSummary summary={data.budgetSummary} />
	{/if}

	<!-- Budget List -->
	<div class="space-y-4">
		<h2 class="text-lg font-semibold">Category Budgets</h2>
		<BudgetList budgets={data.budgetSummary.budgets} onEdit={handleEdit} onDelete={handleDelete} />
	</div>
</div>

<BudgetFormEdit budget={editingBudget} categories={data.categories} bind:open={editSheetOpen} />

<BudgetDeleteDialog
	bind:open={deleteDialogOpen}
	categoryName={deletingCategoryName}
	amount={deletingAmount}
	onConfirm={confirmDelete}
/>
