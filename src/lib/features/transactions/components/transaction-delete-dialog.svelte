<script lang="ts">
	import DeleteConfirmDialog from '$lib/components/wrapper/delete-confirm-dialog.svelte';
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

<DeleteConfirmDialog bind:open title="Delete Transaction" {onConfirm}>
	Are you sure you want to delete <strong>"{description}"</strong> ({formatIDR(amount)})? This
	action cannot be undone and will update your account balance.
</DeleteConfirmDialog>
