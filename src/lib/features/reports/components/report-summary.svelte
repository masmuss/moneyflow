<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { formatIDR } from '$lib/utils/currency';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import TrendingDown from '@lucide/svelte/icons/trending-down';
	import Wallet from '@lucide/svelte/icons/wallet';
	import PiggyBank from '@lucide/svelte/icons/piggy-bank';
	import type { IncomeExpenseSummary } from '../types';

	type Props = {
		summary: IncomeExpenseSummary;
	};

	let { summary }: Props = $props();
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between pb-2">
			<Card.Title class="text-sm font-medium">Total Income</Card.Title>
			<TrendingUp class="text-muted-foreground h-4 w-4" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold text-green-600">{formatIDR(summary.totalIncome)}</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between pb-2">
			<Card.Title class="text-sm font-medium">Total Expense</Card.Title>
			<TrendingDown class="text-muted-foreground h-4 w-4" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold text-destructive">{formatIDR(summary.totalExpense)}</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between pb-2">
			<Card.Title class="text-sm font-medium">Net Flow</Card.Title>
			<Wallet class="text-muted-foreground h-4 w-4" />
		</Card.Header>
		<Card.Content>
			<div
				class="text-2xl font-bold"
				class:text-green-600={summary.netFlow >= 0}
				class:text-destructive={summary.netFlow < 0}
			>
				{formatIDR(summary.netFlow)}
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between pb-2">
			<Card.Title class="text-sm font-medium">Savings Rate</Card.Title>
			<PiggyBank class="text-muted-foreground h-4 w-4" />
		</Card.Header>
		<Card.Content>
			<div
				class="text-2xl font-bold"
				class:text-green-600={summary.savingsRate >= 0}
				class:text-destructive={summary.savingsRate < 0}
			>
				{summary.savingsRate}%
			</div>
			<p class="text-muted-foreground text-xs">of income saved</p>
		</Card.Content>
	</Card.Root>
</div>
