<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Chart from '$lib/components/ui/chart';
	import * as Empty from '$lib/components/ui/empty';
	import { formatIDR } from '$lib/utils/currency';
	import type { MonthlyComparison } from '../types';
	import { scaleBand } from 'd3-scale';
	import { BarChart, type ChartContextValue } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	import BarChart2 from '@lucide/svelte/icons/bar-chart-2';

	type Props = {
		data: MonthlyComparison[];
	};

	let { data }: Props = $props();

	const chartData = $derived(
		data.map((d) => ({
			label: d.label,
			income: d.income,
			expense: d.expense
		}))
	);

	const chartConfig = {
		income: { label: 'Income', color: 'var(--chart-2)' },
		expense: { label: 'Expense', color: 'var(--chart-1)' }
	} satisfies Chart.ChartConfig;

	let context = $state<ChartContextValue>();

	const hasData = $derived(
		chartData.length > 0 && !chartData.every((d) => d.income === 0 && d.expense === 0)
	);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Monthly Trend</Card.Title>
		<Card.Description>Income vs Expense ({data.length} months)</Card.Description>
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
			<Chart.Container config={chartConfig} class="h-[300px] w-full">
				<BarChart
					bind:context
					data={chartData}
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
