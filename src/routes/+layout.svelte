<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { page } from '$app/state';
	import { sidebarData } from '$lib/config';
	import { Toaster } from '@/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();

	let currentPath = $derived(page.url.pathname);
	let activeItem = $derived(sidebarData.navMain.find((item) => item.url === currentPath));
	let breadcrumbTitle = $derived(activeItem?.title ?? 'Dashboard');
</script>

<svelte:head>
	<title>{breadcrumbTitle} - Finance App</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<Sidebar.Provider>
	<AppSidebar variant="inset" collapsible="offcanvas" />
	<Sidebar.Inset>
		<header
			class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ms-1" />
				<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Page>{breadcrumbTitle}</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
			<Toaster />
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
