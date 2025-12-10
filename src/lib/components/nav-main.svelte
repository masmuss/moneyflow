<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import QuickTransaction from '$lib/components/quick-transaction.svelte';
	import type { NavItem } from '$lib/types';
	import type { Category } from '$lib/features/categories/types';
	import type { Account } from '$lib/features/accounts/types';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { CreateTransactionSchema } from '$lib/features/transactions/schema';

	type Props = {
		items: NavItem[];
		categories: Category[];
		accounts: Account[];
		quickTransactionForm: SuperValidated<Infer<CreateTransactionSchema>>;
	};

	let { items, categories, accounts, quickTransactionForm }: Props = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupContent class="flex flex-col gap-2">
		<Sidebar.Menu>
			<Sidebar.MenuItem class="flex items-center gap-2">
				<QuickTransaction form={quickTransactionForm} {categories} {accounts} />
			</Sidebar.MenuItem>
		</Sidebar.Menu>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton tooltipContent={item.title}>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								{#if item.icon}
									<item.icon />
								{/if}
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
