<script lang="ts">
	import DeleteConfirmDialog from '$lib/components/wrapper/delete-confirm-dialog.svelte';

	let {
		open = $bindable(false),
		accountName = '',
		onConfirm,
		onCancel
	}: {
		open?: boolean;
		accountName?: string;
		onConfirm?: () => void;
		onCancel?: () => void;
	} = $props();

	function handleOpenChange(value: boolean) {
		if (!value) {
			onCancel?.();
		}
	}
</script>

<DeleteConfirmDialog
	bind:open
	title="Delete Account"
	onConfirm={() => onConfirm?.()}
	onOpenChange={handleOpenChange}
>
	Are you sure you want to delete <strong>{accountName}</strong>? This action cannot be undone.
</DeleteConfirmDialog>
