<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { Account } from '$lib/features/accounts/types';

	type Props = {
		value: string;
		accounts: Account[];
		name?: string;
		label?: string;
		placeholder?: string;
	};

	let {
		value = $bindable(),
		accounts,
		name,
		label = 'Account',
		placeholder = 'Select account'
	}: Props = $props();
</script>

{#if label}
	<span class="text-sm font-medium">{label}</span>
{/if}
<Select.Root type="single" bind:value {name}>
	<Select.Trigger class="w-full">
		{#if value}
			{@const account = accounts.find((a) => a.id === value)}
			{account?.name || placeholder}
		{:else}
			{placeholder}
		{/if}
	</Select.Trigger>
	<Select.Content>
		{#each accounts as account}
			<Select.Item value={account.id} label={account.name}>
				{account.name}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
