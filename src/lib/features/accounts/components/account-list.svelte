<script lang="ts">
	import AccountCard from './account-card.svelte';
	import type { Account } from '../types';

	let {
		accounts,
		onEdit,
		onDelete
	}: {
		accounts: Account[];
		onEdit?: (account: Account) => void;
		onDelete?: (id: string) => void;
	} = $props();
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each accounts as account (account.id)}
		<AccountCard {account} {onEdit} {onDelete} />
	{/each}
</div>
