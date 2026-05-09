<script>
	import logo from '$lib/assets/Logo.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={logo} />
</svelte:head>

{@render children()}
