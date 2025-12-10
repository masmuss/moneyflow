<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { formatIDR } from '$lib/utils/currency';

	let {
		open = $bindable(false),
		description = '',
		amount = 0,
		onConfirm
	}: {
		open?: boolean;
		description?: string;
		amount?: number;
		onConfirm: () => void;
	} = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Transaction</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete <strong>"{description}"</strong> ({formatIDR(amount)})? This
				action cannot be undone and will update your account balance.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<Button variant="destructive" onclick={onConfirm}>Delete</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
