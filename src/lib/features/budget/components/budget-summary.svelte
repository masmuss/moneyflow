<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { formatIDR } from '$lib/utils/currency';
	import type { MonthlyBudgetSummary } from '../types';

	type Props = {
		summary: MonthlyBudgetSummary;
	};

	let { summary }: Props = $props();

	const progressColor = $derived(() => {
		if (summary.percentage > 100) return '#ef4444';
		if (summary.percentage >= 80) return '#f59e0b';
		return '#22c55e';
	});
</script>

<Card.Root>
	<Card.Header class="pb-2">
		<Card.Title class="text-base">Monthly Overview</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-4">
		<div class="grid grid-cols-3 gap-4 text-center">
			<div>
				<p class="text-muted-foreground text-sm">Budget</p>
				<p class="text-lg font-semibold">{formatIDR(summary.totalBudget)}</p>
			</div>
			<div>
				<p class="text-muted-foreground text-sm">Spent</p>
				<p class="text-lg font-semibold">{formatIDR(summary.totalSpent)}</p>
			</div>
			<div>
				<p class="text-muted-foreground text-sm">Remaining</p>
				<p
					class="text-lg font-semibold"
					class:text-red-500={summary.totalRemaining < 0}
					class:text-green-500={summary.totalRemaining >= 0}
				>
					{formatIDR(summary.totalRemaining)}
				</p>
			</div>
		</div>

		<div class="space-y-1">
			<div class="bg-muted h-2 w-full overflow-hidden rounded-full">
				<div
					class="h-full rounded-full transition-all"
					style="width: {Math.min(summary.percentage, 100)}%; background-color: {progressColor()}"
				></div>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-muted-foreground">
					{summary.budgets.length} budget{summary.budgets.length !== 1 ? 's' : ''} set
				</span>
				<span
					class="font-medium"
					class:text-red-500={summary.percentage > 100}
					class:text-amber-500={summary.percentage >= 80 && summary.percentage <= 100}
					class:text-green-500={summary.percentage < 80}
				>
					{summary.percentage}% used
				</span>
			</div>
		</div>
	</Card.Content>
</Card.Root>
