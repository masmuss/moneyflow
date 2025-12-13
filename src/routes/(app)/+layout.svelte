<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Toaster } from '$lib/components/ui/sonner';
	import { page } from '$app/state';
	import { sidebarData } from '$lib/config';

	let { children, data } = $props();

	let currentPath = $derived(page.url.pathname);
	let activeItem = $derived(sidebarData.navMain.find((item) => item.url === currentPath));
	let breadcrumbTitle = $derived(activeItem?.title ?? 'Dashboard');
</script>

<svelte:head>
	<title>{breadcrumbTitle} - Moneyflow</title>
</svelte:head>

<Sidebar.Provider>
	<AppSidebar
		variant="inset"
		collapsible="offcanvas"
		categories={data.categories}
		accounts={data.accounts}
		quickTransactionForm={data.quickTransactionForm}
		user={data.user}
	/>
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
