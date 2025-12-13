<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { registerSchema, type RegisterSchema } from '../schema';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';

	type Props = {
		data: SuperValidated<Infer<RegisterSchema>>;
	};

	let { data }: Props = $props();

	const form = untrack(() =>
		superForm(data, {
			validators: zod4(registerSchema),
			onResult: ({ result }) => {
				if (result.type === 'success') {
					toast.success('Account created successfully!');
					goto('/dashboard');
				}
			},
			onError: ({ result }) => {
				toast.error(result.error.message || 'Registration failed');
			}
		})
	);

	const { form: formData, enhance, delayed } = form;
</script>

<Card.Root>
	<Card.Header class="text-center">
		<Card.Title class="text-xl">Create an account</Card.Title>
		<Card.Description>Enter your details to get started</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:enhance class="grid gap-6">
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Full Name</Form.Label>
						<Input {...props} type="text" placeholder="John Doe" bind:value={$formData.name} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

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
						<Form.Label>Password</Form.Label>
						<Input
							{...props}
							type="password"
							placeholder="At least 8 characters"
							bind:value={$formData.password}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="confirmPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Confirm Password</Form.Label>
						<Input
							{...props}
							type="password"
							placeholder="Confirm your password"
							bind:value={$formData.confirmPassword}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Button type="submit" class="w-full" disabled={$delayed}>
				{$delayed ? 'Creating account...' : 'Create account'}
			</Button>

			<div class="text-center text-sm">
				Already have an account?{' '}
				<a href="/login" class="underline underline-offset-4">Login</a>
			</div>
		</form>
	</Card.Content>
</Card.Root>
