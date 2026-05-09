<svelte:head>
	<title>TravelJournal | {trip.place} {trip.year}</title>
	<meta name="description" content={`Detailansicht fuer ${trip.place} ${trip.year} im TravelJournal Prototyp.`} />
</svelte:head>

<script>
	import BudgetPanel from '$lib/components/BudgetPanel.svelte';
	import CommentsPanel from '$lib/components/CommentsPanel.svelte';
	import PhotoPreview from '$lib/components/PhotoPreview.svelte';
	import SchedulePanel from '$lib/components/SchedulePanel.svelte';
	import TripHeader from '$lib/components/TripHeader.svelte';

	let { data } = $props();

	const trips = [
		{
			id: 'kyoto-2026',
			place: 'Kyoto',
			year: '2026',
			continent: 'Asien',
			isActive: true,
			description: 'Tempel, Streetfood und ruhige Morgen zwischen Bambuswaeldern und Altstadtgassen.',
			budgetTotal: 2000,
			photos: [
				{ label: 'Fushimi Inari', colors: ['#ffc857', '#4169be'] },
				{ label: 'Bambuswald', colors: ['#8bd17c', '#355070'] },
				{ label: 'Gion bei Nacht', colors: ['#f38d68', '#2b2d42'] },
				{ label: 'Tempelgarten', colors: ['#8aafff', '#ffffff'] }
			],
			expenses: [
				{ category: 'Transport', amount: 420, color: '#4169be' },
				{ category: 'Unterkunft', amount: 650, color: '#7c3aed' },
				{ category: 'Verpflegung', amount: 280, color: '#f28f3b' },
				{ category: 'Aktivitaeten', amount: 190, color: '#2f9c95' },
				{ category: 'Sonstiges', amount: 100, color: '#e56b6f' }
			],
			schedule: {
				departure: '12.04.2026, 10:20 - Hinflug nach Osaka',
				nextActivity: '18.04.2026, 09:30 - Fushimi Inari',
				returnFlight: '20.04.2026, 18:45 - Rueckflug nach Zuerich'
			},
			comments: [
				{
					author: 'Du',
					date: '18.04.2026',
					text: 'Der fruehe Besuch beim Schrein war die beste Entscheidung der Reise.'
				},
				{
					author: 'Mara',
					date: '19.04.2026',
					text: 'Bitte unbedingt noch die kleine Ramen-Bar in der Seitenstrasse notieren.'
				}
			]
		},
		{
			id: 'lisbon-2025',
			place: 'Lissabon',
			year: '2025',
			continent: 'Europa',
			isActive: false,
			description: 'Aussichtspunkte, Tramfahrten, Pasteis de Nata und ein Tagesausflug ans Meer.',
			budgetTotal: 980,
			photos: [
				{ label: 'Alfama', colors: ['#f28f3b', '#2f9c95'] },
				{ label: 'Tram 28', colors: ['#ffd166', '#355070'] },
				{ label: 'Belem', colors: ['#8aafff', '#f8f9fa'] }
			],
			expenses: [
				{ category: 'Transport', amount: 120, color: '#4169be' },
				{ category: 'Unterkunft', amount: 430, color: '#7c3aed' },
				{ category: 'Verpflegung', amount: 210, color: '#f28f3b' },
				{ category: 'Aktivitaeten', amount: 90, color: '#2f9c95' },
				{ category: 'Sonstiges', amount: 45, color: '#e56b6f' }
			],
			schedule: {
				departure: '03.09.2025, 07:15 - Hinflug nach Lissabon',
				returnFlight: '08.09.2025, 21:10 - Rueckflug nach Zuerich'
			},
			comments: [
				{ author: 'Du', date: '06.09.2025', text: 'Aussicht vom Miradouro kurz vor Sonnenuntergang merken.' },
				{ author: 'Noah', date: '07.09.2025', text: 'Cascais war perfekt fuer einen ruhigeren Nachmittag.' }
			]
		},
		{
			id: 'reykjavik-2024',
			place: 'Reykjavik',
			year: '2024',
			continent: 'Europa',
			isActive: false,
			description: 'Nordlichter, heisse Quellen und lange Fahrten durch eine sehr stille Landschaft.',
			budgetTotal: 2450,
			photos: [
				{ label: 'Nordlichter', colors: ['#8aafff', '#1f365f'] },
				{ label: 'Hot Springs', colors: ['#7bdff2', '#355070'] },
				{ label: 'Roadtrip', colors: ['#f8f9fa', '#3a506b'] }
			],
			expenses: [
				{ category: 'Transport', amount: 620, color: '#4169be' },
				{ category: 'Unterkunft', amount: 880, color: '#7c3aed' },
				{ category: 'Verpflegung', amount: 390, color: '#f28f3b' },
				{ category: 'Aktivitaeten', amount: 310, color: '#2f9c95' },
				{ category: 'Sonstiges', amount: 85, color: '#e56b6f' }
			],
			schedule: {
				departure: '18.02.2024, 11:40 - Hinflug nach Reykjavik',
				returnFlight: '25.02.2024, 16:05 - Rueckflug nach Zuerich'
			},
			comments: [
				{ author: 'Du', date: '24.02.2024', text: 'Wetter war wild, aber die Nordlichter waren es komplett wert.' }
			]
		}
	];

	function fallbackTrip(id) {
		return {
			id,
			place: 'Unbekannte Reise',
			year: '----',
			continent: 'TravelJournal',
			isActive: false,
			description: 'Diese Reise ist in den statischen Mock-Daten noch nicht vorhanden.',
			budgetTotal: 1000,
			photos: [
				{ label: 'Platzhalter', colors: ['#8aafff', '#ffffff'] },
				{ label: 'Vorschau', colors: ['#dbe7ff', '#4169be'] },
				{ label: 'Reisebild', colors: ['#f6bd60', '#355070'] }
			],
			expenses: [
				{ category: 'Transport', amount: 0, color: '#4169be' },
				{ category: 'Unterkunft', amount: 0, color: '#7c3aed' },
				{ category: 'Verpflegung', amount: 0, color: '#f28f3b' },
				{ category: 'Aktivitaeten', amount: 0, color: '#2f9c95' },
				{ category: 'Sonstiges', amount: 0, color: '#e56b6f' }
			],
			schedule: {
				departure: 'Noch nicht erfasst',
				returnFlight: 'Noch nicht erfasst'
			},
			comments: [{ author: 'System', date: 'Heute', text: 'Lege spaeter echte Reisedaten fuer diese ID an.' }]
		};
	}

	let foundTrip = $derived(trips.find((item) => item.id === data.id));
	let trip = $derived(foundTrip ?? fallbackTrip(data.id));
</script>

<section class="detail-page" aria-labelledby="detail-title">
	<div class="detail-container container-xxl">
		<TripHeader {trip} />

		{#if !foundTrip}
			<div class="fallback-note" role="status">
				Diese Detailseite nutzt gerade Fallback-Daten, weil die Reise-ID noch nicht in den Mock-Daten existiert.
			</div>
		{/if}

		<div class="detail-layout">
			<PhotoPreview {trip} />

			<div class="info-block">
				<div class="left-column">
					<BudgetPanel {trip} />
					<SchedulePanel {trip} />
				</div>
				<div class="right-column">
					<CommentsPanel {trip} />
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.detail-page {
		height: 100%;
		min-height: 0;
		overflow: hidden;
		padding: 18px 28px;
	}

	.detail-container {
		display: grid;
		grid-template-rows: auto auto minmax(0, 1fr);
		gap: 14px;
		height: 100%;
		min-height: 0;
	}

	.detail-layout {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 14px;
		min-height: 0;
	}

	.fallback-note {
		padding: 12px 14px;
		border: 1px solid rgba(65, 105, 190, 0.18);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
		color: #40516d;
		font-weight: 800;
	}

	.info-block {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
		gap: 14px;
		min-height: 0;
	}

	.left-column {
		display: grid;
		grid-template-rows: auto auto;
		gap: 14px;
		min-height: 0;
	}

	.right-column {
		min-height: 0;
	}

	@media (max-width: 760px) {
		.detail-page {
			overflow-y: auto;
			padding: 16px;
		}

		.detail-container,
		.detail-layout,
		.info-block,
		.left-column {
			height: auto;
		}

		.info-block {
			grid-template-columns: 1fr;
		}
	}
</style>
