<script lang="ts">
	import AccountCard from './account-card.svelte';
	import type { Account } from '../types';

	let { accounts }: { accounts: Account[] } = $props();
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each accounts as account (account.id)}
		<AccountCard {account} />
	{/each}
</div>
