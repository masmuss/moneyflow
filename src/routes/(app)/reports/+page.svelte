<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select';
	import {
		ReportSummary,
		CategoryBreakdown,
		MonthlyTrendChart
	} from '$lib/features/reports/components';
	import Calendar from '@lucide/svelte/icons/calendar';

	let { data } = $props();

	function handlePeriodChange(value: string | undefined) {
		if (value) {
			const url = new URL($page.url);
			url.searchParams.set('period', value);
			goto(url.toString(), { replaceState: true, noScroll: true });
		}
	}
</script>

<div class="container py-6">
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Reports</h1>
			<p class="text-muted-foreground">
				{data.period.label}
			</p>
		</div>
		<div class="flex items-center gap-2">
			<Calendar class="text-muted-foreground h-4 w-4" />
			<Select.Root type="single" value={data.selectedPreset} onValueChange={handlePeriodChange}>
				<Select.Trigger class="w-[180px]">
					{data.presets.find((p) => p.value === data.selectedPreset)?.label || 'Select period'}
				</Select.Trigger>
				<Select.Content>
					{#each data.presets as preset}
						<Select.Item value={preset.value}>{preset.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<div class="space-y-6">
		<!-- Summary Cards -->
		<ReportSummary summary={data.summary} />

		<!-- Monthly Trend -->
		<MonthlyTrendChart data={data.monthlyComparison} />

		<!-- Category Breakdown -->
		<div class="grid gap-6 lg:grid-cols-2">
			<CategoryBreakdown
				title="Expense by Category"
				data={data.expenseByCategory}
				emptyMessage="No expenses in this period"
			/>
			<CategoryBreakdown
				title="Income by Category"
				data={data.incomeByCategory}
				emptyMessage="No income in this period"
			/>
		</div>
	</div>
</div>
