<script lang="ts">
	import AccountList from '$lib/features/accounts/components/account-list.svelte';
	import AccountFormWrapper from '@/features/accounts/components/account-form-wrapper.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold tracking-tight">Accounts</h1>
		<AccountFormWrapper {data} />
	</div>

	<div class="space-y-6">
		{#if data.accounts.length === 0}
			<div class="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed">
				<p class="text-muted-foreground">No accounts found. Create one to get started.</p>
			</div>
		{:else}
			<AccountList accounts={data.accounts} />
		{/if}
	</div>
</div>
