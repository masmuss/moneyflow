<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	let {
		open = false,
		accountName = '',
		onConfirm,
		onCancel
	}: {
		open?: boolean;
		accountName?: string;
		onConfirm?: () => void;
		onCancel?: () => void;
	} = $props();

	let isOpen = $derived(open);

	function handleConfirm() {
		onConfirm?.();
	}

	function handleCancel() {
		onCancel?.();
	}
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Account</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete <strong>{accountName}</strong>? This action cannot be
				undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={handleCancel}>Cancel</AlertDialog.Cancel>
			<Button variant="destructive" onclick={handleConfirm}>Delete</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
