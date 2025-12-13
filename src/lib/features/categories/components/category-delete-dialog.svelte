<script lang="ts">
	import DeleteConfirmDialog from '$lib/components/wrapper/delete-confirm-dialog.svelte';

	let {
		open = $bindable(false),
		categoryName = '',
		onConfirm
	}: {
		open?: boolean;
		categoryName?: string;
		onConfirm: () => void;
	} = $props();
</script>

<DeleteConfirmDialog bind:open title="Delete Category" {onConfirm}>
	Are you sure you want to delete <strong>"{categoryName}"</strong>? This action cannot be undone.
	Transactions using this category will have their category set to null.
</DeleteConfirmDialog>
