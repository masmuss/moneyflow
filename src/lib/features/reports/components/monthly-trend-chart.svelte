<script lang="ts">
	import BarChartCard from '$lib/components/bar-chart-card.svelte';
	import * as Empty from '$lib/components/ui/empty';
	import BarChart2 from '@lucide/svelte/icons/bar-chart-2';
	import type { MonthlyComparison } from '../types';

	type Props = {
		data: MonthlyComparison[];
	};

	let { data }: Props = $props();

	const series = [
		{ key: 'income', label: 'Income', color: 'var(--chart-2)' },
		{ key: 'expense', label: 'Expense', color: 'var(--chart-1)' }
	];
</script>

<BarChartCard
	title="Monthly Trend"
	description={`Income vs Expense (${data.length} months)`}
	data={data.map((d) => ({
		label: d.label,
		income: d.income,
		expense: d.expense
	}))}
	{series}
	x="label"
	height="h-[300px]"
>
	{#snippet empty()}
		<Empty.State
			icon={BarChart2}
			title="No Trend Data"
			description="Add transactions to see your monthly trend."
			class="border-0"
		/>
	{/snippet}
	{#snippet footer()}
		<div class="flex w-full items-center justify-center gap-6 text-sm">
			<div class="flex items-center gap-2">
				<div class="h-3 w-3 rounded-sm" style="background-color: var(--chart-2);"></div>
				<span class="text-muted-foreground">Income</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="h-3 w-3 rounded-sm" style="background-color: var(--chart-1);"></div>
				<span class="text-muted-foreground">Expense</span>
			</div>
		</div>
	{/snippet}
</BarChartCard>
