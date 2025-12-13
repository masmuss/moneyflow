<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS } from '$lib/features/transactions/schema';

	type Props = {
		value: string;
		name?: string;
		label?: string;
		placeholder?: string;
		includeAll?: boolean;
	};

	let {
		value = $bindable(),
		name,
		label = 'Type',
		placeholder = 'Select type',
		includeAll = false
	}: Props = $props();
</script>

{#if label}
	<span class="text-sm font-medium">{label}</span>
{/if}
<Select.Root type="single" bind:value {name}>
	<Select.Trigger class="w-full">
		{#if value}
			{TRANSACTION_TYPE_LABELS[value as keyof typeof TRANSACTION_TYPE_LABELS] || placeholder}
		{:else if includeAll}
			All Types
		{:else}
			{placeholder}
		{/if}
	</Select.Trigger>
	<Select.Content>
		{#if includeAll}
			<Select.Item value="">All Types</Select.Item>
		{/if}
		{#each TRANSACTION_TYPES as type}
			<Select.Item value={type} label={TRANSACTION_TYPE_LABELS[type]}>
				{TRANSACTION_TYPE_LABELS[type]}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
