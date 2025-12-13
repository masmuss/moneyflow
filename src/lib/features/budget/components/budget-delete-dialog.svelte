<script lang="ts">
	import DeleteConfirmDialog from '$lib/components/wrapper/delete-confirm-dialog.svelte';
	import { formatIDR } from '$lib/utils/currency';

	type Props = {
		open: boolean;
		categoryName: string;
		amount: number;
		onConfirm: () => void;
	};

	let { open = $bindable(false), categoryName, amount, onConfirm }: Props = $props();
</script>

<DeleteConfirmDialog bind:open title="Delete Budget" {onConfirm}>
	Are you sure you want to delete the budget for <strong>{categoryName}</strong> ({formatIDR(
		amount
	)})? This action cannot be undone.
</DeleteConfirmDialog>
