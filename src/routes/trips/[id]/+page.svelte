<svelte:head>
	<title>TravelJournal | {data.trip ? `${data.trip.place} ${data.trip.year}` : 'Reise nicht gefunden'}</title>
	<meta
		name="description"
		content={data.trip
			? `Detailansicht fuer ${data.trip.place} ${data.trip.year} im TravelJournal.`
			: 'Reise konnte im TravelJournal nicht gefunden werden.'}
	/>
</svelte:head>

<script>
	import ActivitiesPanel from '$lib/components/ActivitiesPanel.svelte';
	import BudgetPanel from '$lib/components/BudgetPanel.svelte';
	import CommentsPanel from '$lib/components/CommentsPanel.svelte';
	import NotesPanel from '$lib/components/NotesPanel.svelte';
	import PhotoPreview from '$lib/components/PhotoPreview.svelte';
	import SchedulePanel from '$lib/components/SchedulePanel.svelte';
	import TripHeader from '$lib/components/TripHeader.svelte';

	let { data } = $props();
</script>

<section class="detail-page" aria-labelledby="detail-title">
	<div class="detail-container container-xxl">
		{#if data.trip}
			<TripHeader trip={data.trip} />

			<div class="detail-layout">
				<PhotoPreview trip={data.trip} />

				<div class="journal-block">
					<NotesPanel trip={data.trip} />
					<ActivitiesPanel trip={data.trip} />
				</div>

				<div class="info-block">
					<div class="left-column">
						<BudgetPanel trip={data.trip} />
						<SchedulePanel trip={data.trip} />
					</div>
					<div class="right-column">
						<CommentsPanel trip={data.trip} />
					</div>
				</div>
			</div>
		{:else}
			<div class="not-found-card" role="status">
				<p class="eyebrow">TravelJournal</p>
				<h1 id="detail-title">Reise nicht gefunden</h1>
				<p>{data.errorMessage}</p>
				<a href="/trips">Zurueck zur Uebersicht</a>
			</div>
		{/if}
	</div>
</section>

<style>
	.detail-page {
		height: 100%;
		min-height: 0;
		overflow-y: auto;
		padding: 18px 28px;
	}

	.detail-container {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 14px;
		min-height: 0;
	}

	.detail-layout {
		display: grid;
		gap: 14px;
		min-height: 0;
	}

	.info-block {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
		gap: 14px;
		min-height: 0;
	}

	.journal-block {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
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

	.not-found-card {
		display: grid;
		justify-items: start;
		gap: 12px;
		max-width: 680px;
		padding: 28px;
		border: 1px solid rgba(65, 105, 190, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.78);
		box-shadow: 0 14px 38px rgba(51, 87, 158, 0.13);
	}

	.eyebrow {
		margin: 0;
		color: #355aa2;
		font-size: 0.76rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	h1 {
		margin: 0;
		color: #14213d;
		font-size: clamp(2rem, 4vw, 3rem);
		line-height: 1;
	}

	.not-found-card p:last-of-type {
		margin: 0;
		color: #52617b;
		line-height: 1.55;
	}

	.not-found-card a {
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

	@media (max-width: 760px) {
		.detail-page {
			overflow-y: auto;
			padding: 16px;
		}

		.detail-container,
		.detail-layout,
		.journal-block,
		.info-block,
		.left-column {
			height: auto;
		}

		.journal-block,
		.info-block {
			grid-template-columns: 1fr;
		}
	}
</style>
