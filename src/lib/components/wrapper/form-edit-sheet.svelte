<script lang="ts" generics="TData, TForm">
	import * as Sheet from '$lib/components/ui/sheet';
	import type { Snippet } from 'svelte';
	import Skeleton from '../ui/skeleton/skeleton.svelte';
	import { invalidateAll } from '$app/navigation';
	import { untrack } from 'svelte';

	type Props = {
		open: boolean;
		data: TData | null;
		title: string;
		description: string;
		transformData: (data: TData) => Promise<TForm>;
		onOpenChange?: (open: boolean) => void;
		children: Snippet<[{ form: TForm; formKey: number; onSuccess: () => Promise<void> }]>;
	};

	let {
		open = $bindable(),
		data,
		title,
		description,
		transformData,
		onOpenChange,
		children
	}: Props = $props();

	let loading = $state<boolean>(false);
	let form = $state<TForm | null>(null);
	let formKey = $state<number>(0);

	$effect(() => {
		if (open && data) {
			untrack(() => {
				loading = true;
				transformData(data)
					.then((transformed) => {
						form = transformed;
						formKey++;
					})
					.catch((error) => {
						console.error('Error transforming data:', error);
					})
					.finally(() => {
						loading = false;
					});
			});
		} else if (!open) {
			untrack(() => {
				form = null;
			});
		}
	});

	async function handleSuccess() {
		open = false;
		onOpenChange?.(false);
		await invalidateAll();
	}

	function handleOpenChange(value: boolean) {
		open = value;
		onOpenChange?.(value);
	}
</script>

<Sheet.Root bind:open onOpenChange={handleOpenChange}>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>{title}</Sheet.Title>
			<Sheet.Description>{description}</Sheet.Description>
		</Sheet.Header>
		{#if loading}
			<div class="space-y-4 p-4">
				<Skeleton class="h-10 w-full" />
				<Skeleton class="h-10 w-full" />
				<Skeleton class="h-10 w-full" />
			</div>
		{:else if form}
			<div class="grid flex-1 auto-rows-min gap-6 px-4 py-4">
				{#key formKey}
					{@render children({ form, formKey, onSuccess: handleSuccess })}
				{/key}
			</div>
		{/if}
	</Sheet.Content>
</Sheet.Root>
