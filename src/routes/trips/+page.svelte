<svelte:head>
	<title>TravelJournal | Reisen</title>
	<meta name="description" content="Übersicht deiner gespeicherten Reisen im TravelJournal." />
</svelte:head>

<script>
	import TravelCard from '$lib/components/TravelCard.svelte';

	let { data } = $props();
</script>

<section class="overview-page" aria-labelledby="overview-title">
	<div class="overview-container container-xxl">
		<header class="overview-header">
			<div>
				<p class="eyebrow">Meine Reisen</p>
				<h1 id="overview-title">Reiseübersicht</h1>
				<p>Alle gespeicherten Reisen an einem Ort, direkt aus deiner MongoDB Collection.</p>
			</div>

			<div class="header-actions">
				<form class="controls" method="GET" aria-label="Sortierung und Filter">
					<label>
						<span>Sortieren</span>
						<select name="sort">
							<option value="newest" selected={data.filters.sort === 'newest'}>Neueste zuerst</option>
							<option value="oldest" selected={data.filters.sort === 'oldest'}>Älteste zuerst</option>
						</select>
					</label>

					<label>
						<span>Kontinent</span>
						<select name="continent">
							<option value="all" selected={data.filters.continent === 'all'}>Alle</option>
							{#each data.continents as continent}
								<option value={continent} selected={data.filters.continent === continent}>{continent}</option>
							{/each}
						</select>
					</label>

					<button class="filter-button" type="submit">Anwenden</button>
				</form>

				<a class="new-trip-link" href="/trips/new">Neue Reise erfassen</a>
			</div>
		</header>

		<div class="travel-list" aria-label="Reisen">
			{#if data.loadError}
				<div class="empty-state" role="alert">
					<h2>Keine Verbindung</h2>
					<p>{data.loadError}</p>
				</div>
			{:else if data.trips.length === 0}
				<div class="empty-state">
					<h2>Keine Reisen gefunden</h2>
					<p>Erfasse eine neue Reise oder passe den Kontinent-Filter an.</p>
					<a href="/trips/new">Neue Reise erfassen</a>
				</div>
			{:else}
				{#each data.trips as trip}
					<TravelCard {trip} />
				{/each}
			{/if}
		</div>
	</div>
</section>

<style>
	.overview-page {
		height: 100%;
		min-height: 0;
		padding: 24px 28px;
	}

	.overview-container {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 20px;
		height: 100%;
		min-height: 0;
	}

	.overview-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
		padding: 24px;
		border: 1px solid rgba(255, 255, 255, 0.86);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
		box-shadow: 0 18px 52px rgba(51, 87, 158, 0.16);
		backdrop-filter: blur(18px);
	}

	.eyebrow {
		margin: 0 0 8px;
		color: #355aa2;
		font-size: 0.78rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	h1 {
		margin: 0 0 10px;
		font-size: clamp(2rem, 4vw, 3.3rem);
		line-height: 1;
	}

	.overview-header p:last-child {
		max-width: 560px;
		margin: 0;
		color: #52617b;
		line-height: 1.55;
	}

	.header-actions {
		display: grid;
		justify-items: end;
		gap: 14px;
		flex: 0 0 auto;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 10px;
	}

	label {
		display: grid;
		gap: 6px;
		color: #52617b;
		font-size: 0.78rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	select {
		min-width: 152px;
		min-height: 40px;
		border: 1px solid rgba(65, 105, 190, 0.2);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.9);
		color: #14213d;
		font: inherit;
		font-size: 0.9rem;
		font-weight: 800;
		padding: 0 12px;
	}

	.filter-button {
		align-self: end;
		min-height: 40px;
		padding: 0 14px;
		border: 1px solid rgba(65, 105, 190, 0.24);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.9);
		color: #14213d;
		font-weight: 900;
	}

	.filter-button:hover {
		background: rgba(138, 175, 255, 0.18);
	}

	.new-trip-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 0 16px;
		border-radius: 8px;
		background: #14213d;
		color: #ffffff;
		font-weight: 900;
		text-decoration: none;
		box-shadow: 0 12px 28px rgba(20, 33, 61, 0.22);
	}

	.new-trip-link:hover {
		background: #22345b;
	}

	.travel-list {
		display: grid;
		align-content: start;
		grid-auto-rows: 172px;
		gap: 14px;
		min-height: 0;
		overflow-y: auto;
		padding-right: 8px;
		scrollbar-color: rgba(47, 95, 200, 0.55) rgba(255, 255, 255, 0.45);
	}

	.empty-state {
		display: grid;
		place-items: center;
		align-content: center;
		gap: 10px;
		min-height: 260px;
		padding: 28px;
		border: 1px dashed rgba(65, 105, 190, 0.32);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.68);
		color: #52617b;
		text-align: center;
	}

	.empty-state h2 {
		margin: 0;
		color: #14213d;
		font-size: 1.4rem;
	}

	.empty-state p {
		margin: 0;
	}

	.empty-state a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 40px;
		padding: 0 14px;
		border-radius: 8px;
		background: #14213d;
		color: #ffffff;
		font-weight: 900;
		text-decoration: none;
	}

	.travel-list::-webkit-scrollbar {
		width: 10px;
	}

	.travel-list::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.45);
		border-radius: 999px;
	}

	.travel-list::-webkit-scrollbar-thumb {
		background: rgba(47, 95, 200, 0.55);
		border-radius: 999px;
	}

	@media (max-width: 880px) {
		.overview-page {
			padding: 16px;
		}

		.overview-header {
			align-items: stretch;
			flex-direction: column;
		}

		.header-actions,
		.controls {
			justify-items: stretch;
			justify-content: stretch;
		}

		.controls,
		.new-trip-link {
			width: 100%;
		}

		label,
		select {
			width: 100%;
		}
	}
</style>
