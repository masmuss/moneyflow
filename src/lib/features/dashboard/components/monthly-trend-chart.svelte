<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import BarChartCard from '$lib/components/bar-chart-card.svelte';
	import * as Empty from '$lib/components/ui/empty';
	import BarChart2 from '@lucide/svelte/icons/bar-chart-2';
	import type { MonthlyTrend } from '../dashboard.server';
	import type { ChartContextValue } from 'layerchart';

	interface Props {
		data: {
			sixMonths: MonthlyTrend[];
			twelveMonths: MonthlyTrend[];
		};
	}

	let { data }: Props = $props();

	let selectedPeriod = $state<'6M' | '12M'>('6M');

	const currentData = $derived(() => {
		if (selectedPeriod === '6M') {
			return data.sixMonths.map((d) => ({
				label: d.monthLabel,
				income: d.income,
				expense: d.expense
			}));
		} else {
			return data.twelveMonths.map((d) => ({
				label: d.monthLabel,
				income: d.income,
				expense: d.expense
			}));
		}
	});

	const periodDescription = $derived(`last ${selectedPeriod === '6M' ? '6' : '12'} months`);

	const series = [
		{ key: 'income', label: 'Income', color: 'var(--chart-2)' },
		{ key: 'expense', label: 'Expense', color: 'var(--chart-1)' }
	];
</script>

<div>
	<div class="flex flex-row items-center justify-between space-y-0 pb-2">
		<div>
			<h2 class="text-lg font-semibold">Monthly Trend</h2>
			<p class="text-muted-foreground text-sm">Income vs Expense ({periodDescription})</p>
		</div>
		<Tabs.Root value={selectedPeriod} onValueChange={(v) => (selectedPeriod = v as '6M' | '12M')}>
			<Tabs.List class="h-8">
				<Tabs.Trigger value="6M" class="px-3 text-xs">6M</Tabs.Trigger>
				<Tabs.Trigger value="12M" class="px-3 text-xs">12M</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</div>
	<BarChartCard title="" description="" data={currentData()} {series} x="label" height="h-full">
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
</div>
