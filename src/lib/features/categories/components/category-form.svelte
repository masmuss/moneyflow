<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import {
		createCategorySchema,
		updateCategorySchema,
		type CreateCategorySchema,
		type UpdateCategorySchema,
		CATEGORY_TYPES,
		CATEGORY_TYPE_LABELS,
		CATEGORY_COLORS,
		CATEGORY_ICONS,
		CATEGORY_ICON_LABELS
	} from '../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { untrack } from 'svelte';
	import CategoryIcon from './category-icon.svelte';

	type CreateFormData = SuperValidated<Infer<CreateCategorySchema>>;
	type UpdateFormData = SuperValidated<Infer<UpdateCategorySchema>>;

	let {
		form: formData,
		mode = 'create',
		onSuccess
	}: {
		form: CreateFormData | UpdateFormData;
		mode?: 'create' | 'update';
		onSuccess?: () => void;
	} = $props();

	const form = untrack(() =>
		superForm(formData, {
			validators: mode === 'create' ? zod4(createCategorySchema) : zod4(updateCategorySchema),
			onUpdated: ({ form: updatedForm }) => {
				if (updatedForm.valid) {
					const action = mode === 'create' ? 'created' : 'updated';
					toast.success(`Category ${action} successfully!`, {
						description: `Category "${updatedForm.data.name}" has been ${action}.`,
						duration: 4000
					});
					onSuccess?.();
				} else {
					toast.error(`Failed to ${mode} category. Please check the form.`);
				}
			}
		})
	);

	const { form: data, enhance, delayed } = form;
</script>

<form
	method="POST"
	action={mode === 'create' ? '?/create' : '?/update'}
	use:enhance
	class="space-y-4"
>
	{#if mode === 'update' && 'id' in $data}
		<input type="hidden" name="id" value={$data.id} />
	{/if}

	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Category Name</Form.Label>
				<Input {...props} bind:value={$data.name} placeholder="e.g. Food & Dining" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="type">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Category Type</Form.Label>
				<Select.Root type="single" bind:value={$data.type} name={props.name}>
					<Select.Trigger {...props} class="w-full">
						{$data.type ? CATEGORY_TYPE_LABELS[$data.type] : 'Select type'}
					</Select.Trigger>
					<Select.Content>
						{#each CATEGORY_TYPES as type}
							<Select.Item value={type} label={CATEGORY_TYPE_LABELS[type]}>
								{CATEGORY_TYPE_LABELS[type]}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="icon">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Icon</Form.Label>
				<Select.Root type="single" bind:value={$data.icon} name={props.name}>
					<Select.Trigger {...props} class="w-full">
						{#if $data.icon}
							<div class="flex items-center gap-2">
								<CategoryIcon name={$data.icon} color={$data.color} size={16} />
								<span
									>{CATEGORY_ICON_LABELS[$data.icon as keyof typeof CATEGORY_ICON_LABELS] ||
										$data.icon}</span
								>
							</div>
						{:else}
							Select icon
						{/if}
					</Select.Trigger>
					<Select.Content class="max-h-60">
						{#each CATEGORY_ICONS as icon}
							<Select.Item value={icon} label={CATEGORY_ICON_LABELS[icon]}>
								<div class="flex items-center gap-2">
									<CategoryIcon name={icon} color={$data.color} size={16} />
									<span>{CATEGORY_ICON_LABELS[icon]}</span>
								</div>
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="color">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Color</Form.Label>
				<div class="grid grid-cols-9 gap-2">
					{#each CATEGORY_COLORS as color}
						<button
							type="button"
							class="h-8 w-8 rounded-lg border-2 transition-transform hover:scale-110 {$data.color ===
							color
								? 'border-foreground ring-2 ring-offset-2'
								: 'border-transparent'}"
							style="background-color: {color};"
							onclick={() => ($data.color = color)}
						>
							<span class="sr-only">{color}</span>
						</button>
					{/each}
				</div>
				<input type="hidden" name="color" bind:value={$data.color} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Button type="submit" class="w-full" disabled={$delayed}>
		{$delayed
			? mode === 'create'
				? 'Creating...'
				: 'Updating...'
			: mode === 'create'
				? 'Create Category'
				: 'Update Category'}
	</Button>
</form>
