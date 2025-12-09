<script lang="ts">
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { sidebarData } from '$lib/config';
	import NavMain from './nav-main.svelte';
	import Wallet from '@lucide/svelte/icons/wallet';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<div class="flex items-center gap-2 px-2 py-2">
			<div
				class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
			>
				<Wallet class="size-4" />
			</div>
			<div class="flex flex-col gap-0.5 flex-1 text-left text-sm">
				<span class="font-semibold">Finance App</span>
				<span class="text-xs text-muted-foreground">Personal</span>
			</div>
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={sidebarData.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={sidebarData.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
