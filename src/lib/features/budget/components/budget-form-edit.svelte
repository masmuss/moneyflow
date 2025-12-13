<script lang="ts">
	import FormEditSheet from '$lib/components/wrapper/form-edit-sheet.svelte';
	import BudgetForm from './budget-form.svelte';
	import { superValidate } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { updateBudgetSchema } from '../schema';
	import type { Category } from '$lib/features/categories/types';
	import type { BudgetWithSpending } from '../types';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { UpdateBudgetSchema } from '../schema';

	type FormData = SuperValidated<Infer<UpdateBudgetSchema>>;

	type Props = {
		budget: BudgetWithSpending | null;
		categories: Category[];
		open: boolean;
	};

	let { budget, categories, open = $bindable(false) }: Props = $props();

	async function transformToFormData(data: BudgetWithSpending): Promise<FormData> {
		return await superValidate(
			{
				id: data.id,
				categoryId: data.categoryId,
				amount: data.amount,
				month: data.month
			},
			zod4(updateBudgetSchema)
		);
	}
</script>

<FormEditSheet
	bind:open
	data={budget}
	title="Edit Budget"
	description="Update the budget amount for this category."
	transformData={transformToFormData}
>
	{#snippet children({ form, onSuccess })}
		<BudgetForm {form} {categories} month={budget?.month ?? ''} mode="update" {onSuccess} />
	{/snippet}
</FormEditSheet>
