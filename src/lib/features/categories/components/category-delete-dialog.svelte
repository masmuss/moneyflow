<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';

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

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Category</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete <strong>"{categoryName}"</strong>? This action cannot be
				undone. Transactions using this category will have their category set to null.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<Button variant="destructive" onclick={onConfirm}>Delete</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
