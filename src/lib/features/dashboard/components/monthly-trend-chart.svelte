<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Chart from '$lib/components/ui/chart';
	import * as Empty from '$lib/components/ui/empty';
	import * as Tabs from '$lib/components/ui/tabs';
	import { formatIDR } from '$lib/utils/currency';
	import type { MonthlyTrend } from '../dashboard.server';
	import { scaleBand } from 'd3-scale';
	import { BarChart, type ChartContextValue } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	import BarChart2 from '@lucide/svelte/icons/bar-chart-2';

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

	const chartConfig = {
		income: { label: 'Income', color: 'var(--chart-2)' },
		expense: { label: 'Expense', color: 'var(--chart-1)' }
	} satisfies Chart.ChartConfig;

	let context = $state<ChartContextValue>();

	const hasData = $derived(
		currentData().length > 0 && !currentData().every((d) => d.income === 0 && d.expense === 0)
	);
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<div>
			<Card.Title>Monthly Trend</Card.Title>
			<Card.Description>
				Income vs Expense ({periodDescription})
			</Card.Description>
		</div>
		<Tabs.Root value={selectedPeriod} onValueChange={(v) => (selectedPeriod = v as '6M' | '12M')}>
			<Tabs.List class="h-8">
				<Tabs.Trigger value="6M" class="px-3 text-xs">6M</Tabs.Trigger>
				<Tabs.Trigger value="12M" class="px-3 text-xs">12M</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</Card.Header>
	<Card.Content>
		{#if !hasData}
			<Empty.State
				icon={BarChart2}
				title="No Trend Data"
				description="Add transactions to see your monthly trend."
				class="border-0"
			/>
		{:else}
			<Chart.Container config={chartConfig} class="h-full">
				<BarChart
					bind:context
					data={currentData()}
					xScale={scaleBand().padding(0.25)}
					x="label"
					axis="x"
					series={[
						{ key: 'income', label: 'Income', color: chartConfig.income.color },
						{ key: 'expense', label: 'Expense', color: chartConfig.expense.color }
					]}
					x1Scale={scaleBand().paddingInner(0.2)}
					seriesLayout="group"
					props={{
						bars: {
							stroke: 'none',
							strokeWidth: 0,
							rounded: 'all',
							initialY: context?.height,
							initialHeight: 0,
							motion: {
								y: { type: 'tween', duration: 500, easing: cubicInOut },
								height: { type: 'tween', duration: 500, easing: cubicInOut }
							}
						},
						highlight: { area: { fill: 'none' } },
						xAxis: { format: (d: string) => d },
						yAxis: { format: (d: number) => formatIDR(d) }
					}}
				>
					{#snippet tooltip()}
						<Chart.Tooltip indicator="line" />
					{/snippet}
				</BarChart>
			</Chart.Container>
		{/if}
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full items-center justify-center gap-6 text-sm">
			<div class="flex items-center gap-2">
				<div class="h-3 w-3 rounded-sm" style="background-color: {chartConfig.income.color};"></div>
				<span class="text-muted-foreground">Income</span>
			</div>
			<div class="flex items-center gap-2">
				<div
					class="h-3 w-3 rounded-sm"
					style="background-color: {chartConfig.expense.color};"
				></div>
				<span class="text-muted-foreground">Expense</span>
			</div>
		</div>
	</Card.Footer>
</Card.Root>
