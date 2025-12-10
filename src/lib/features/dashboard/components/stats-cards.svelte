<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Wallet, TrendingUp, TrendingDown, Scale } from '@lucide/svelte';
	import { formatIDR } from '$lib/utils/currency';
	import type { DashboardStats } from '../dashboard.server';

	let { stats }: { stats: DashboardStats } = $props();
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
	<!-- Total Balance -->
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Total Balance</Card.Title>
			<Wallet class="text-muted-foreground h-4 w-4" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">{formatIDR(stats.totalBalance)}</div>
			<p class="text-muted-foreground text-xs">
				Across {stats.accountCount} account{stats.accountCount !== 1 ? 's' : ''}
			</p>
		</Card.Content>
	</Card.Root>

	<!-- Income This Month -->
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Income This Month</Card.Title>
			<TrendingUp class="h-4 w-4 text-green-500" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold text-green-600 dark:text-green-400">
				+{formatIDR(stats.incomeThisMonth)}
			</div>
			<p class="text-muted-foreground text-xs">
				{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
			</p>
		</Card.Content>
	</Card.Root>

	<!-- Expense This Month -->
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Expense This Month</Card.Title>
			<TrendingDown class="h-4 w-4 text-red-500" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold text-red-600 dark:text-red-400">
				-{formatIDR(stats.expenseThisMonth)}
			</div>
			<p class="text-muted-foreground text-xs">
				{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
			</p>
		</Card.Content>
	</Card.Root>

	<!-- Net This Month -->
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Net This Month</Card.Title>
			<Scale class="text-muted-foreground h-4 w-4" />
		</Card.Header>
		<Card.Content>
			<div
				class="text-2xl font-bold {stats.netThisMonth >= 0
					? 'text-green-600 dark:text-green-400'
					: 'text-red-600 dark:text-red-400'}"
			>
				{stats.netThisMonth >= 0 ? '+' : ''}{formatIDR(stats.netThisMonth)}
			</div>
			<p class="text-muted-foreground text-xs">Income - Expense</p>
		</Card.Content>
	</Card.Root>
</div>
