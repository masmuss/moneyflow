<script lang="ts">
	import { LoginForm } from '$lib/features/auth';

	let { data } = $props();
</script>

<svelte:head>
	<title>Login - Moneyflow</title>
</svelte:head>

<LoginForm data={data.form} />
