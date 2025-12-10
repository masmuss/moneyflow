<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { formatIDR } from '$lib/utils/currency';

	type Props = {
		open: boolean;
		categoryName: string;
		amount: number;
		onConfirm: () => void;
	};

	let { open = $bindable(false), categoryName, amount, onConfirm }: Props = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Budget</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete the budget for <strong>{categoryName}</strong> ({formatIDR(
					amount
				)})? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<Button variant="destructive" onclick={onConfirm}>Delete</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
