<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import CategoryForm from './category-form.svelte';
	import { superValidate } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { updateCategorySchema } from '../schema';
	import type { Category } from '../types';
	import { invalidateAll } from '$app/navigation';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { UpdateCategorySchema } from '../schema';
	import { untrack } from 'svelte';

	let {
		category,
		open = $bindable(false)
	}: {
		category: Category | null;
		open?: boolean;
	} = $props();

	let formData: SuperValidated<Infer<UpdateCategorySchema>> | null = $state(null);
	let isLoading = $state(true);
	let formKey = $state(0);

	async function loadFormData() {
		if (!category) return;
		isLoading = true;
		try {
			formData = await superValidate(
				{
					id: category.id,
					name: category.name,
					type: category.type,
					color: category.color,
					icon: category.icon || undefined
				},
				zod4(updateCategorySchema)
			);
			formKey++;
		} catch (error) {
			console.error('Error loading form data:', error);
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		if (open && category) {
			untrack(() => {
				loadFormData();
			});
		} else if (!open) {
			untrack(() => {
				formData = null;
				isLoading = true;
			});
		}
	});

	async function handleSuccess() {
		open = false;
		await invalidateAll();
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Edit Category</Sheet.Title>
			<Sheet.Description>Update your category details below.</Sheet.Description>
		</Sheet.Header>

		{#if isLoading}
			<div class="flex items-center justify-center py-8">
				<p class="text-muted-foreground">Loading...</p>
			</div>
		{:else if formData}
			{#key formKey}
				<div class="grid flex-1 auto-rows-min gap-6 px-4 py-4">
					<CategoryForm form={formData} mode="update" onSuccess={handleSuccess} />
				</div>
			{/key}
		{/if}
	</Sheet.Content>
</Sheet.Root>
