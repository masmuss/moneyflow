<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { formatCurrency } from '$lib/utils/currency';
	import type { Account } from '../types';
	import { EllipsisVertical, Pencil, Trash2 } from '@lucide/svelte';

	let {
		account,
		onEdit,
		onDelete
	}: {
		account: Account;
		onEdit?: (account: Account) => void;
		onDelete?: (id: string) => void;
	} = $props();
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<div class="flex-1">
			<Card.Title class="text-sm font-medium">
				{account.name}
			</Card.Title>
			<span class="text-muted-foreground text-xs uppercase">{account.type}</span>
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button variant="ghost" size="sm" class="h-8 w-8 p-0">
					<EllipsisVertical class="h-4 w-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item onclick={() => onEdit?.(account)}>
					<Pencil class="mr-2 h-4 w-4" />
					Edit
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="text-destructive" onclick={() => onDelete?.(account.id)}>
					<Trash2 class="mr-2 h-4 w-4" />
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold">
			{formatCurrency(account.balance ?? 0, account.currency)}
		</div>
	</Card.Content>
</Card.Root>
