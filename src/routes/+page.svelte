<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import { TrendingUp, Zap } from '@lucide/svelte';

	const session = authClient.useSession();
</script>

<svelte:head>
	<title>Moneyflow - Take Control of Your Financial Future</title>
</svelte:head>

<div class="min-h-screen bg-background">
	<header
		class="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50"
	>
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
						<TrendingUp class="h-5 w-5 text-primary-foreground" />
					</div>
					<span class="text-xl font-semibold text-foreground">Moneyflow</span>
				</div>

				<div class="flex items-center gap-4">
					{#if $session}
						<Button
							size="sm"
							class="bg-primary hover:bg-primary/90 text-primary-foreground"
							href="/dashboard">Go to Dashboard</Button
						>
					{:else}
						<Button variant="ghost" size="sm" class="hidden sm:flex" href="/login">Sign In</Button>
					{/if}
				</div>
			</div>
		</div>
	</header>

	<section class="relative overflow-hidden py-20 sm:py-28 lg:py-32">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="mx-auto max-w-3xl text-center">
				<div
					class="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
				>
					<Zap class="h-3.5 w-3.5" />
					Track your money flow effortlessly
				</div>

				<h1 class="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl mb-6">
					Take Control of Your <span class="text-primary">Financial Future</span>
				</h1>

				<p class="text-lg text-muted-foreground text-pretty mb-8 leading-relaxed">
					Beautiful charts, smart insights, and powerful tracking. Moneyflow helps you understand
					where your money goes and make better financial decisions. No credit card required.
				</p>
			</div>
		</div>
	</section>
</div>
