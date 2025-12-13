<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group';
	import { formatIDRInput, parseIDRInput } from '$lib/utils/currency';

	type Props = {
		value: number;
		placeholder?: string;
		name?: string;
		id?: string;
	};

	let { value = $bindable(), placeholder = '0', name, id }: Props = $props();

	let displayValue = $state(formatIDRInput(value || 0));

	function handleInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const rawValue = parseIDRInput(input.value);
		value = rawValue;
		displayValue = formatIDRInput(rawValue);
	}

	// Sync display value when external value changes
	$effect(() => {
		const formatted = formatIDRInput(value || 0);
		if (formatted !== displayValue) {
			displayValue = formatted;
		}
	});
</script>

<InputGroup.Root>
	<InputGroup.Addon>
		<InputGroup.Text>Rp</InputGroup.Text>
	</InputGroup.Addon>
	<InputGroup.Input
		type="text"
		value={displayValue}
		oninput={handleInput}
		inputmode="numeric"
		{placeholder}
		{id}
	/>
</InputGroup.Root>
{#if name}
	<input type="hidden" {name} {value} />
{/if}
