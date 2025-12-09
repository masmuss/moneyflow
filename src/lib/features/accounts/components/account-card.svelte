<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { formatCurrency } from '$lib/utils/currency';
	import type { accounts } from '$lib/server/db/schema';

	let { account }: { account: typeof accounts.$inferSelect } = $props();
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title class="text-sm font-medium">
			{account.name}
		</Card.Title>
		<span class="text-muted-foreground text-xs uppercase">{account.type}</span>
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold">
			{formatCurrency(account.balance ?? 0, account.currency)}
		</div>
	</Card.Content>
</Card.Root>
