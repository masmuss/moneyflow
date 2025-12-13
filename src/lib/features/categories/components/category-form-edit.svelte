<script lang="ts">
	import FormEditSheet from '$lib/components/wrapper/form-edit-sheet.svelte';
	import CategoryForm from './category-form.svelte';
	import { superValidate } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { updateCategorySchema } from '../schema';
	import type { Category } from '../types';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { UpdateCategorySchema } from '../schema';

	type FormData = SuperValidated<Infer<UpdateCategorySchema>>;

	let {
		category,
		open = $bindable(false)
	}: {
		category: Category | null;
		open?: boolean;
	} = $props();

	async function transformToFormData(data: Category): Promise<FormData> {
		return await superValidate(
			{
				id: data.id,
				name: data.name,
				type: data.type,
				color: data.color,
				icon: data.icon || undefined
			},
			zod4(updateCategorySchema)
		);
	}
</script>

<FormEditSheet
	bind:open
	data={category}
	title="Edit Category"
	description="Update your category details below."
	transformData={transformToFormData}
>
	{#snippet children({ form, onSuccess })}
		<CategoryForm {form} mode="update" {onSuccess} />
	{/snippet}
</FormEditSheet>
