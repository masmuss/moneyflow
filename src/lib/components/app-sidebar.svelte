<script lang="ts">
	import NavUser from './nav-user.svelte';
	import TeamSwitcher from './team-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { sidebarData } from '$lib/config';
	import NavMain from './nav-main.svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={sidebarData.teams} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={sidebarData.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={sidebarData.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
