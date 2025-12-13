<script lang="ts">
	import type { Snippet, Component } from 'svelte';
	import * as Empty from '$lib/components/ui/empty';
	import { cn } from '$lib/utils';

	type Props = {
		title: string;
		description: string;
		icon: Component<{ class?: string }>;
		class?: string;
		children?: Snippet;
	};

	let { title, description, icon: Icon, class: className, children }: Props = $props();
</script>

<Empty.Root class={cn('border', className)}>
	<Empty.Header>
		<Empty.Media variant="icon">
			<Icon />
		</Empty.Media>
		<Empty.Title>{title}</Empty.Title>
		<Empty.Description>{description}</Empty.Description>
	</Empty.Header>
	{#if children}
		<Empty.Content>
			{@render children()}
		</Empty.Content>
	{/if}
</Empty.Root>
