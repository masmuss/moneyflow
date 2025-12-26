<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { EllipsisVertical, Pencil, Trash2 } from '@lucide/svelte';
	import type { Category } from '../types';
	import { CATEGORY_TYPE_LABELS } from '../schema';
	import CategoryIcon from './category-icon.svelte';

	let {
		category,
		onEdit,
		onDelete
	}: {
		category: Category;
		onEdit?: (category: Category) => void;
		onDelete?: (id: string) => void;
	} = $props();
</script>

<Card.Root class="group relative transition-shadow hover:shadow-md">
	<Card.Header class="flex flex-row items-center justify-between space-y-0">
		<div class="flex items-center gap-3">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-lg"
				style="background-color: {category.color}20;"
			>
				<CategoryIcon name={category.icon} color={category.color} size={20} />
			</div>
			<div>
				<Card.Title class="text-base font-medium">{category.name}</Card.Title>
				<Card.Description class="text-xs">
					{CATEGORY_TYPE_LABELS[category.type]}
				</Card.Description>
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
				<DropdownMenu.Item onclick={() => onEdit?.(category)}>
					<Pencil class="mr-2 h-4 w-4" />
					Edit
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					class="text-destructive focus:text-destructive"
					onclick={() => onDelete?.(category.id)}
				>
					<Trash2 class="mr-2 h-4 w-4" />
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Card.Header>
</Card.Root>
