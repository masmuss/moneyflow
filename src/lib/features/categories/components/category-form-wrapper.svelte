<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import CategoryForm from './category-form.svelte';
	import { Plus } from '@lucide/svelte';
	import { invalidateAll } from '$app/navigation';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { CreateCategorySchema } from '../schema';

	let {
		data
	}: {
		data: { form: SuperValidated<Infer<CreateCategorySchema>> };
	} = $props();

	let open = $state(false);

	async function handleSuccess() {
		open = false;
		await invalidateAll();
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button {...props}>
				<Plus class="mr-2 h-4 w-4" />
				Add Category
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Create New Category</Sheet.Title>
			<Sheet.Description>Add a new category to organize your transactions.</Sheet.Description>
		</Sheet.Header>
		<div class="grid flex-1 auto-rows-min gap-6 px-4 py-4">
			<CategoryForm form={data.form} mode="create" onSuccess={handleSuccess} />
		</div>
	</Sheet.Content>
</Sheet.Root>
