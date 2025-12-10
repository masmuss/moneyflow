<script lang="ts">
	import AccountForm from '$lib/features/accounts/components/account-form.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { buttonVariants } from '$lib/components/ui/button';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { invalidateAll } from '$app/navigation';

	let open = $state(false);
	let { data } = $props();

	async function handleSuccess() {
		open = false;
		await invalidateAll();
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger class={buttonVariants()}>
		<PlusIcon class="size-4" />
		Add Account
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Create Account</Sheet.Title>
			<Sheet.Description>Add a new account to track your transactions.</Sheet.Description>
		</Sheet.Header>
		<div class="grid flex-1 auto-rows-min gap-6 px-4">
			<AccountForm form={data.form} onSuccess={handleSuccess} />
		</div>
	</Sheet.Content>
</Sheet.Root>
