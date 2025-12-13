<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { formatCurrency } from '$lib/utils/currency';
	import type { Account } from '../types';
	import { ACCOUNT_TYPE_LABELS } from '../schema';
	import {
		EllipsisVertical,
		Pencil,
		Trash2,
		Wallet,
		Landmark,
		CreditCard,
		PiggyBank
	} from '@lucide/svelte';

	let {
		account,
		onEdit,
		onDelete
	}: {
		account: Account;
		onEdit?: (account: Account) => void;
		onDelete?: (id: string) => void;
	} = $props();

	const accountIcons = {
		cash: Wallet,
		bank: Landmark,
		credit_card: CreditCard,
		savings: PiggyBank
	} as const;

	const AccountIcon = $derived(accountIcons[account.type as keyof typeof accountIcons] || Wallet);
</script>

<Card.Root class="group relative transition-shadow hover:shadow-md">
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<div class="flex items-center gap-3">
			<div class="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-lg">
				<AccountIcon class="h-6 w-6" />
			</div>
			<div>
				<Card.Title class="text-base font-medium">{account.name}</Card.Title>
				<Badge variant="default" class="mt-1">
					{ACCOUNT_TYPE_LABELS[account.type]}
				</Badge>
			</div>
		</div>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon"
						class="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<EllipsisVertical class="h-4 w-4" />
						<span class="sr-only">Open menu</span>
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item onclick={() => onEdit?.(account)}>
					<Pencil class="mr-2 h-4 w-4" />
					Edit
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					class="text-destructive focus:text-destructive"
					onclick={() => onDelete?.(account.id)}
				>
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
