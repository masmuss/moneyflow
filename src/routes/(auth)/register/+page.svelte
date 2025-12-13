<script lang="ts">
	import { RegisterForm } from '$lib/features/auth';

	let { data } = $props();
</script>

<svelte:head>
	<title>Sign Up - Moneyflow</title>
</svelte:head>

<RegisterForm data={data.form} />
