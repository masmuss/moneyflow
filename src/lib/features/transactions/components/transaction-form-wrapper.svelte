<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import TransactionForm from './transaction-form.svelte';
	import { Plus } from '@lucide/svelte';
	import { invalidateAll } from '$app/navigation';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { CreateTransactionSchema } from '../schema';
	import type { Category } from '$lib/features/categories/types';
	import type { Account } from '$lib/features/accounts/types';

	let {
		data
	}: {
		data: {
			form: SuperValidated<Infer<CreateTransactionSchema>>;
			categories: Category[];
			accounts: Account[];
		};
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
				Add Transaction
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Create New Transaction</Sheet.Title>
			<Sheet.Description>Record a new income or expense.</Sheet.Description>
		</Sheet.Header>
		<div class="grid flex-1 auto-rows-min gap-6 px-4 py-4">
			<TransactionForm
				form={data.form}
				mode="create"
				categories={data.categories}
				accounts={data.accounts}
				onSuccess={handleSuccess}
			/>
		</div>
	</Sheet.Content>
</Sheet.Root>
