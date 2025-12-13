<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { AccountSelect, CategorySelect, TypeSelect } from '$lib/components/form-fields';
	import { Funnel, X } from '@lucide/svelte';
	import type { Category } from '$lib/features/categories/types';
	import type { Account } from '$lib/features/accounts/types';
	import type { TransactionFilter } from '../types';
	import { goto } from '$app/navigation';

	type Props = {
		categories: Category[];
		accounts: Account[];
		currentFilter: TransactionFilter;
	};

	let { categories, accounts, currentFilter }: Props = $props();

	let startDate = $state('');
	let endDate = $state('');
	let selectedType = $state('');
	let selectedCategoryId = $state('');
	let selectedAccountId = $state('');

	// Sync state when currentFilter changes (e.g., on navigation)
	$effect(() => {
		startDate = currentFilter.startDate || '';
		endDate = currentFilter.endDate || '';
		selectedType = currentFilter.type || '';
		selectedCategoryId = currentFilter.categoryId || '';
		selectedAccountId = currentFilter.accountId || '';
	});

	let showFilters = $state(false);

	const hasActiveFilters = $derived(
		startDate || endDate || selectedType || selectedCategoryId || selectedAccountId
	);

	const activeFilterCount = $derived(
		[startDate, endDate, selectedType, selectedCategoryId, selectedAccountId].filter(Boolean).length
	);

	function applyFilters() {
		const params = new URLSearchParams();
		if (startDate) params.set('startDate', startDate);
		if (endDate) params.set('endDate', endDate);
		if (selectedType) params.set('type', selectedType);
		if (selectedCategoryId) params.set('categoryId', selectedCategoryId);
		if (selectedAccountId) params.set('accountId', selectedAccountId);
		goto(`/transactions?${params.toString()}`, { invalidateAll: true });
	}

	function clearFilters() {
		startDate = '';
		endDate = '';
		selectedType = '';
		selectedCategoryId = '';
		selectedAccountId = '';
		goto('/transactions', { invalidateAll: true });
	}

	function setQuickFilter(period: 'today' | 'week' | 'month' | 'year') {
		const today = new Date();
		const formatDate = (d: Date) => d.toISOString().split('T')[0];

		endDate = formatDate(today);

		switch (period) {
			case 'today':
				startDate = formatDate(today);
				break;
			case 'week':
				const weekAgo = new Date(today);
				weekAgo.setDate(today.getDate() - 7);
				startDate = formatDate(weekAgo);
				break;
			case 'month':
				const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
				startDate = formatDate(monthStart);
				break;
			case 'year':
				const yearStart = new Date(today.getFullYear(), 0, 1);
				startDate = formatDate(yearStart);
				break;
		}

		applyFilters();
	}
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center gap-2">
		<Button variant="outline" size="sm" onclick={() => (showFilters = !showFilters)} class="gap-2">
			<Funnel class="h-4 w-4" />
			Filters
			{#if activeFilterCount > 0}
				<span
					class="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs"
				>
					{activeFilterCount}
				</span>
			{/if}
		</Button>

		<!-- Quick filters -->
		<div class="hidden items-center gap-1 sm:flex">
			<Button variant="ghost" size="sm" onclick={() => setQuickFilter('today')}>Today</Button>
			<Button variant="ghost" size="sm" onclick={() => setQuickFilter('week')}>This Week</Button>
			<Button variant="ghost" size="sm" onclick={() => setQuickFilter('month')}>This Month</Button>
			<Button variant="ghost" size="sm" onclick={() => setQuickFilter('year')}>This Year</Button>
		</div>

		{#if hasActiveFilters}
			<Button variant="ghost" size="sm" onclick={clearFilters} class="text-muted-foreground gap-1">
				<X class="h-4 w-4" />
				Clear
			</Button>
		{/if}
	</div>

	{#if showFilters}
		<div
			class="bg-muted/50 grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-5"
		>
			<div class="space-y-2">
				<Label for="startDate">Start Date</Label>
				<Input type="date" id="startDate" bind:value={startDate} />
			</div>

			<div class="space-y-2">
				<Label for="endDate">End Date</Label>
				<Input type="date" id="endDate" bind:value={endDate} />
			</div>

			<div class="space-y-2">
				<TypeSelect bind:value={selectedType} includeAll={true} />
			</div>

			<div class="space-y-2">
				<CategorySelect bind:value={selectedCategoryId} {categories} placeholder="All Categories" />
			</div>

			<div class="space-y-2">
				<AccountSelect bind:value={selectedAccountId} {accounts} placeholder="All Accounts" />
			</div>

			<div class="flex items-end sm:col-span-2 lg:col-span-5">
				<Button onclick={applyFilters} class="w-full sm:w-auto">Apply Filters</Button>
			</div>
		</div>
	{/if}
</div>
