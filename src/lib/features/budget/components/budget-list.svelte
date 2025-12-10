<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { formatIDR } from '$lib/utils/currency';
	import { Pencil, Trash2 } from '@lucide/svelte';
	import type { BudgetWithSpending } from '../types';
	import CategoryIcon from '$lib/features/categories/components/category-icon.svelte';

	type Props = {
		budgets: BudgetWithSpending[];
		onEdit: (budget: BudgetWithSpending) => void;
		onDelete: (id: string) => void;
	};

	let { budgets, onEdit, onDelete }: Props = $props();

	function getProgressColor(percentage: number, isOverBudget: boolean): string {
		if (isOverBudget) return '#ef4444'; // red
		if (percentage >= 80) return '#f59e0b'; // amber
		return '#22c55e'; // green
	}
</script>

<div class="space-y-4">
	{#each budgets as budget}
		{@const color = getProgressColor(budget.percentage, budget.isOverBudget)}
		<div class="rounded-lg border p-4">
			<div class="mb-3 flex items-start justify-between">
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-md"
						style="background-color: {budget.category.color}20"
					>
						<CategoryIcon name={budget.category.icon} color={budget.category.color} size={20} />
					</div>
					<div>
						<h3 class="font-medium">{budget.category.name}</h3>
						<p class="text-muted-foreground text-sm">
							{formatIDR(budget.spent)} of {formatIDR(budget.amount)}
						</p>
					</div>
				</div>
				<div class="flex items-center gap-1">
					<Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => onEdit(budget)}>
						<Pencil class="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="h-8 w-8 text-destructive"
						onclick={() => onDelete(budget.id)}
					>
						<Trash2 class="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div class="space-y-1">
				<div class="bg-muted h-2 w-full overflow-hidden rounded-full">
					<div
						class="h-full rounded-full transition-all"
						style="width: {Math.min(budget.percentage, 100)}%; background-color: {color}"
					></div>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">
						{#if budget.isOverBudget}
							<span class="font-medium text-red-500">
								Over budget by {formatIDR(Math.abs(budget.remaining))}
							</span>
						{:else}
							{formatIDR(budget.remaining)} remaining
						{/if}
					</span>
					<span
						class="font-medium"
						class:text-red-500={budget.isOverBudget}
						class:text-amber-500={!budget.isOverBudget && budget.percentage >= 80}
						class:text-green-500={!budget.isOverBudget && budget.percentage < 80}
					>
						{budget.percentage}%
					</span>
				</div>
			</div>
		</div>
	{/each}

	{#if budgets.length === 0}
		<div class="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed">
			<p class="text-muted-foreground">No budgets set for this month. Create one to get started.</p>
		</div>
	{/if}
</div>
