<script lang="ts">
	import {
		StatsCards,
		RecentTransactions,
		SpendingByCategory,
		MonthlyTrendChart
	} from '$lib/features/dashboard/components';

	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard - Finance Tracker</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-6 p-4 pt-0">
	<div>
		<h1 class="text-2xl font-bold tracking-tight">Dashboard</h1>
		<p class="text-muted-foreground">Your financial overview at a glance</p>
	</div>

	<StatsCards stats={data.stats} />

	<div class="grid gap-6 lg:grid-cols-2">
		<MonthlyTrendChart data={data.trend} />

		<SpendingByCategory spending={data.spendingByCategory} />
	</div>

	<RecentTransactions transactions={data.recentTransactions} />
</div>
