<script lang="ts">
	import * as icons from '@lucide/svelte';
	import { CATEGORY_ICONS } from '../schema';

	let {
		name,
		color = '#6366f1',
		size = 16
	}: {
		name: string | null | undefined;
		color?: string;
		size?: number;
	} = $props();

	// Get the icon component from lucide
	const iconName = $derived((name || 'MoreHorizontal') as (typeof CATEGORY_ICONS)[number]);
	const IconComponent = $derived(icons[iconName] || icons.MoreHorizontal);
</script>

<IconComponent {size} style="color: {color};" />
