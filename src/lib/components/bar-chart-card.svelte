<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Chart from '$lib/components/ui/chart';
	import { BarChart, type Accessor, type ChartContextValue } from 'layerchart';
	import { scaleBand } from 'd3-scale';
	import { cubicInOut } from 'svelte/easing';
	import { formatIDR } from '$lib/utils/currency';
	import type { Snippet } from 'svelte';

	type Series = {
		key: string;
		label: string;
		color: string;
	};

	type Props<T> = {
		title: string;
		description: string;
		data: T[];
		series: Series[];
		x: keyof T;
		class?: string;
		height?: string;
		empty?: Snippet;
		footer?: Snippet;
	};

	let {
		title,
		description,
		data,
		series,
		x,
		class: className = '',
		height = 'h-[300px]',
		empty,
		footer
	}: Props<any> = $props();

	let context = $state<ChartContextValue>();
</script>

<Card.Root class={className}>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if !data || data.length === 0 || data.every((d) => series.every((s) => d[s.key] === 0))}
			{@render empty?.()}
		{:else}
			<Chart.Container
				config={Object.fromEntries(series.map((s) => [s.key, { label: s.label, color: s.color }]))}
				class={height + ' w-full'}
			>
				<BarChart
					bind:context
					{data}
					xScale={scaleBand().padding(0.25)}
					axis="x"
					x={x as Accessor}
					{series}
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
	{#if footer}
		<Card.Footer>{@render footer()}</Card.Footer>
	{/if}
</Card.Root>
