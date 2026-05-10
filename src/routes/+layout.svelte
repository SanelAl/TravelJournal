<script>
	import logo from '$lib/assets/Logo.png';
	import worldMap from '$lib/assets/world.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={logo} />
</svelte:head>

<div class="world-map-background" aria-hidden="true">
	<img src={worldMap} alt="" />
</div>

<div class="route-content">
	{@render children()}
</div>

<style>
	.world-map-background {
		position: fixed;
		inset: 0;
		z-index: 0;
		display: grid;
		place-items: center;
		overflow: hidden;
		pointer-events: none;
	}

	.world-map-background img {
		width: max(1700px, 118vw);
		max-width: none;
		height: auto;
		min-height: 112vh;
		opacity: 0.12;
		mix-blend-mode: multiply;
		object-fit: cover;
		transform: translateY(8px);
	}

	.route-content {
		position: relative;
		min-height: 100%;
	}
</style>
