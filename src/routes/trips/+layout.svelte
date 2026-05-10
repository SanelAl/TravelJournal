<script>
	import AppFooter from '$lib/components/AppFooter.svelte';
	import AppNav from '$lib/components/AppNav.svelte';

	let { children, data } = $props();
</script>

<div class="app-shell">
	<AppNav user={data.user} />
	<main class="app-main">
		{@render children()}
	</main>
	<AppFooter />
</div>

<style>
	:global(html),
	:global(body) {
		height: 100%;
	}

	:global(body) {
		margin: 0;
		font-family:
			Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		color: #14213d;
		background: linear-gradient(135deg, #8aafff 0%, #dbe7ff 42%, #ffffff 100%);
	}

	:global(*) {
		box-sizing: border-box;
	}

	.app-shell {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		height: 100dvh;
		overflow: hidden;
	}

	.app-main {
		min-height: 0;
		overflow: hidden;
	}
</style>
