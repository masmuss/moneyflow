<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import AccountForm from './account-form.svelte';
	import { superValidate } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { updateAccountSchema } from '../schema';
	import type { Account } from '../types';
	import { invalidateAll } from '$app/navigation';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { UpdateAccountSchema } from '../schema';
	import { untrack } from 'svelte';

	let {
		account,
		open = $bindable(false)
	}: {
		account: Account | null;
		open?: boolean;
	} = $props();

	let formData: SuperValidated<Infer<UpdateAccountSchema>> | null = $state(null);
	let isLoading = $state(true);
	let formKey = $state(0);

	async function loadFormData() {
		if (!account) return;
		isLoading = true;
		try {
			formData = await superValidate(
				{
					id: account.id,
					name: account.name,
					type: account.type,
					balance: account.balance,
					currency: account.currency
				},
				zod4(updateAccountSchema)
			);
			formKey++; // Force re-creation of form component
		} catch (error) {
			console.error('Error loading form data:', error);
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		if (open && account) {
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
			<Sheet.Title>Edit Account</Sheet.Title>
			<Sheet.Description>Update your account details below.</Sheet.Description>
		</Sheet.Header>

		{#if isLoading}
			<div class="flex items-center justify-center py-8">
				<p class="text-muted-foreground">Loading...</p>
			</div>
		{:else if formData}
			{#key formKey}
				<div class="grid flex-1 auto-rows-min gap-6 px-4 py-4">
					<AccountForm form={formData} mode="update" onSuccess={handleSuccess} />
				</div>
			{/key}
		{/if}
	</Sheet.Content>
</Sheet.Root>
