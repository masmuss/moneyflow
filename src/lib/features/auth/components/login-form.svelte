<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Alert from '$lib/components/ui/alert';
	import { CircleAlert } from '@lucide/svelte';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { loginSchema, type LoginSchema } from '../schema';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	type Props = {
		data: SuperValidated<Infer<LoginSchema>>;
	};

	let { data }: Props = $props();

	let serverError = $state<string | null>(null);

	const form = superForm(data, {
		validators: zod4(loginSchema),
		onSubmit: () => {
			serverError = null;
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Login successful!');
				goto('/dashboard');
			} else if (result.type === 'failure' && result.data?.error) {
				serverError = result.data.error as string;
			}
		},
		onError: ({ result }) => {
			serverError = result.error.message || 'Login failed';
		}
	});

	const { form: formData, enhance, delayed } = form;
</script>

<Card.Root>
	<Card.Header class="text-center">
		<Card.Title class="text-xl">Welcome back</Card.Title>
		<Card.Description>Login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:enhance class="grid gap-6">
			{#if serverError}
				<Alert.Root variant="destructive">
					<CircleAlert class="size-4" />
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>{serverError}</Alert.Description>
				</Alert.Root>
			{/if}

			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input
							{...props}
							type="email"
							placeholder="m@example.com"
							bind:value={$formData.email}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex items-center">
							<Form.Label>Password</Form.Label>
							<a href="/forgot-password" class="ml-auto text-sm underline-offset-4 hover:underline">
								Forgot password?
							</a>
						</div>
						<Input {...props} type="password" bind:value={$formData.password} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Button type="submit" class="w-full" disabled={$delayed}>
				{$delayed ? 'Logging in...' : 'Login'}
			</Button>

			<div class="text-center text-sm">
				Don&apos;t have an account?{' '}
				<a href="/register" class="underline underline-offset-4">Sign up</a>
			</div>
		</form>
	</Card.Content>
</Card.Root>
