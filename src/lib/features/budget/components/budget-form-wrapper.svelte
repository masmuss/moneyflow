<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from '@lucide/svelte';
	import type { Category } from '$lib/features/categories/types';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { CreateBudgetSchema } from '../schema';
	import BudgetForm from './budget-form.svelte';

	type Props = {
		categories: Category[];
		form: SuperValidated<Infer<CreateBudgetSchema>>;
		month: string;
		existingCategoryIds: string[];
	};

	let { categories, form, month, existingCategoryIds }: Props = $props();

	let open = $state(false);

	// Filter out categories that already have budgets (for disabling button)
	const availableCategories = $derived(
		categories.filter((c) => c.type === 'expense' && !existingCategoryIds.includes(c.id))
	);

	function handleSuccess() {
		open = false;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button {...props} size="sm" disabled={availableCategories.length === 0}>
				<Plus class="mr-2 h-4 w-4" />
				Add Budget
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Add Budget</Sheet.Title>
			<Sheet.Description>Set a spending limit for a category this month.</Sheet.Description>
		</Sheet.Header>

		<div class="grid flex-1 auto-rows-min gap-6 px-4">
			<BudgetForm {categories} {form} {month} {existingCategoryIds} onSuccess={handleSuccess} />
		</div>
	</Sheet.Content>
</Sheet.Root>
