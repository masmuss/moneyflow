<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import * as Form from '$lib/components/ui/form';
	import { CurrencyInput } from '$lib/components/ui/currency-input';
	import { Button } from '$lib/components/ui/button';
	import type { Category } from '$lib/features/categories/types';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import {
		createBudgetSchema,
		updateBudgetSchema,
		type CreateBudgetSchema,
		type UpdateBudgetSchema
	} from '../schema';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import CategoryIcon from '$lib/features/categories/components/category-icon.svelte';
	import { untrack } from 'svelte';

	type CreateFormData = SuperValidated<Infer<CreateBudgetSchema>>;
	type UpdateFormData = SuperValidated<Infer<UpdateBudgetSchema>>;

	type Props = {
		categories: Category[];
		form: CreateFormData | UpdateFormData;
		month: string;
		existingCategoryIds?: string[];
		mode?: 'create' | 'update';
		onSuccess?: () => void;
	};

	let {
		categories,
		form: formData,
		month,
		existingCategoryIds = [],
		mode = 'create',
		onSuccess
	}: Props = $props();

	// Filter out categories that already have budgets (only for create mode)
	const availableCategories = $derived(
		categories.filter(
			(c) => c.type === 'expense' && (mode === 'update' || !existingCategoryIds.includes(c.id))
		)
	);

	const form = untrack(() =>
		superForm(formData, {
			validators: mode === 'create' ? zod4(createBudgetSchema) : zod4(updateBudgetSchema),
			onUpdated: ({ form: updatedForm }) => {
				if (updatedForm.valid) {
					const action = mode === 'create' ? 'created' : 'updated';
					toast.success(`Budget ${action} successfully!`);
					onSuccess?.();
				} else {
					toast.error(`Failed to ${mode} budget. Please check the form.`);
				}
			}
		})
	);

	const { form: formStore, enhance, errors } = form;

	// Set month
	$effect(() => {
		$formStore.month = month;
	});
</script>

<form method="POST" action="?/{mode}" use:enhance class="space-y-4">
	{#if mode === 'update' && 'id' in $formStore}
		<input type="hidden" name="id" value={$formStore.id} />
	{/if}
	<input type="hidden" name="month" value={month} />

	<Form.Field {form} name="categoryId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Category</Form.Label>
				<Select.Root type="single" name={props.name} bind:value={$formStore.categoryId}>
					<Select.Trigger id="categoryId" class="w-full">
						{@const selected = availableCategories.find((c) => c.id === $formStore.categoryId)}
						{#if selected}
							<span class="flex items-center gap-2">
								<CategoryIcon name={selected.icon} color={selected.color} size={16} />
								{selected.name}
							</span>
						{:else}
							Select category
						{/if}
					</Select.Trigger>
					<Select.Content>
						{#each availableCategories as category}
							<Select.Item value={category.id}>
								<span class="flex items-center gap-2">
									<CategoryIcon name={category.icon} color={category.color} size={16} />
									{category.name}
								</span>
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="amount">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Budget Amount</Form.Label>
				<CurrencyInput bind:value={$formStore.amount} name={props.name} id={props.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<div class="flex gap-2 pt-4">
		<Button type="submit" class="flex-1">
			{mode === 'create' ? 'Create Budget' : 'Update Budget'}
		</Button>
	</div>
</form>
