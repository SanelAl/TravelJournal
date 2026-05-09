<svelte:head>
	<title>TravelJournal | Reisen</title>
	<meta name="description" content="Statische Uebersicht deiner Reisen im TravelJournal Prototyp." />
</svelte:head>

<script>
	import TravelCard from '$lib/components/TravelCard.svelte';

	const trips = [
		{
			id: 'kyoto-2026',
			place: 'Kyoto',
			year: '2026',
			date: '12.04.2026 - 20.04.2026',
			duration: '9 Tage',
			continent: 'Asien',
			visibility: 'Privat',
			budget: 'CHF 2\'000',
			description: 'Tempel, Streetfood und ruhige Morgen zwischen Bambuswaeldern und Altstadtgassen.',
			previewLabel: 'Japan',
			colors: ['#ffc857', '#4169be']
		},
		{
			id: 'lisbon-2025',
			place: 'Lissabon',
			year: '2025',
			date: '03.09.2025 - 08.09.2025',
			duration: '6 Tage',
			continent: 'Europa',
			visibility: 'Oeffentlich',
			budget: 'CHF 980',
			description: 'Aussichtspunkte, Tramfahrten, Pasteis de Nata und ein Tagesausflug ans Meer.',
			previewLabel: 'Portugal',
			colors: ['#f28f3b', '#2f9c95']
		},
		{
			id: 'reykjavik-2024',
			place: 'Reykjavik',
			year: '2024',
			date: '18.02.2024 - 25.02.2024',
			duration: '8 Tage',
			continent: 'Europa',
			visibility: 'Privat',
			budget: 'CHF 2\'450',
			description: 'Nordlichter, heisse Quellen und lange Fahrten durch eine sehr stille Landschaft.',
			previewLabel: 'Island',
			colors: ['#8aafff', '#1f365f']
		},
		{
			id: 'marrakesh-2024',
			place: 'Marrakesch',
			year: '2024',
			date: '14.05.2024 - 19.05.2024',
			duration: '6 Tage',
			continent: 'Afrika',
			visibility: 'Oeffentlich',
			budget: 'CHF 1\'120',
			description: 'Souks, Dachterrassen, Gewuerze und ein kurzer Abstecher Richtung Atlasgebirge.',
			previewLabel: 'Marokko',
			colors: ['#e56b6f', '#355070']
		},
		{
			id: 'vancouver-2023',
			place: 'Vancouver',
			year: '2023',
			date: '02.07.2023 - 16.07.2023',
			duration: '15 Tage',
			continent: 'Nordamerika',
			visibility: 'Privat',
			budget: 'CHF 3\'300',
			description: 'Stadt, Kueste, Waldwege und ein sehr voller Speicher mit Landschaftsfotos.',
			previewLabel: 'Kanada',
			colors: ['#7bdff2', '#3a506b']
		},
		{
			id: 'cusco-2023',
			place: 'Cusco',
			year: '2023',
			date: '09.10.2023 - 21.10.2023',
			duration: '13 Tage',
			continent: 'Suedamerika',
			visibility: 'Oeffentlich',
			budget: 'CHF 2\'780',
			description: 'Hoehenluft, Maerkte, Ruinen und ein Reisetagebuch voller kleiner Beobachtungen.',
			previewLabel: 'Peru',
			colors: ['#f6bd60', '#6d597a']
		}
	];
</script>

<section class="overview-page" aria-labelledby="overview-title">
	<div class="overview-container container-xxl">
		<header class="overview-header">
			<div>
				<p class="eyebrow">Meine Reisen</p>
				<h1 id="overview-title">Reiseuebersicht</h1>
				<p>Alle erfassten Reisen an einem Ort. Fuer den Prototyp sind die Eintraege statisch.</p>
			</div>

			<div class="header-actions">
				<div class="controls" aria-label="Sortierung und Filter">
					<label>
						<span>Sortieren</span>
						<select name="sort">
							<option>Neueste zuerst</option>
							<option>Aelteste zuerst</option>
						</select>
					</label>

					<label>
						<span>Kontinent</span>
						<select name="continent">
							<option>Alle</option>
							<option>Europa</option>
							<option>Asien</option>
							<option>Afrika</option>
							<option>Nordamerika</option>
							<option>Suedamerika</option>
						</select>
					</label>
				</div>

				<a class="new-trip-link" href="/trips/new">Neue Reise erfassen</a>
			</div>
		</header>

		<div class="travel-list" aria-label="Reisen">
			{#each trips as trip}
				<TravelCard {trip} />
			{/each}
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
		gap: 14px;
		min-height: 0;
		overflow-y: auto;
		padding-right: 8px;
		scrollbar-color: rgba(47, 95, 200, 0.55) rgba(255, 255, 255, 0.45);
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
