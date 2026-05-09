<script>
	let { trip } = $props();

	let createModalId = $derived(`activity-create-${trip.id}`);
	let editModalId = $derived(`activity-edit-${trip.id}`);
	let selectedActivity = $state(null);

	$effect(() => {
		selectedActivity = trip.activities[0] ?? null;
	});
</script>

<section class="activities-section" aria-labelledby={`activities-title-${trip.id}`}>
	<div class="section-heading">
		<p class="eyebrow" id={`activities-title-${trip.id}`}>Aktivitaeten</p>
		<button type="button" data-bs-toggle="modal" data-bs-target={`#${createModalId}`}>Neue Aktivitaet</button>
	</div>

	<div class="detail-card activities-panel">
		<div class="filter-row" aria-label="Aktivitaeten nach Datum filtern">
			<label for={`activity-date-${trip.id}`}>Datum</label>
			<input id={`activity-date-${trip.id}`} class="form-control" type="date" />
		</div>

		<div class="activity-list">
			{#if trip.activities.length === 0}
				<p class="empty-note">Noch keine Aktivitaeten erfasst.</p>
			{:else}
				{#each trip.activities as activity}
					<article class="activity-row">
						<div class="activity-date">
							<span>{activity.day}</span>
							<strong>{activity.month}</strong>
						</div>
						<div>
							<strong>{activity.title}</strong>
							<span>{activity.time} - {activity.place}</span>
							<p>{activity.description}</p>
						</div>
						<button
							type="button"
							data-bs-toggle="modal"
							data-bs-target={`#${editModalId}`}
							onclick={() => (selectedActivity = activity)}
						>
							Bearbeiten
						</button>
					</article>
				{/each}
			{/if}
		</div>
	</div>
</section>

<div class="modal fade" id={createModalId} tabindex="-1" aria-labelledby={`${createModalId}-title`} aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h3 class="modal-title fs-5" id={`${createModalId}-title`}>Neue Aktivitaet</h3>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schliessen"></button>
			</div>
			<div class="modal-body">
				<label class="form-label" for={`${createModalId}-date`}>Datum</label>
				<input class="form-control mb-3" id={`${createModalId}-date`} type="date" />

				<label class="form-label" for={`${createModalId}-time`}>Zeit</label>
				<input class="form-control mb-3" id={`${createModalId}-time`} type="time" />

				<label class="form-label" for={`${createModalId}-title-input`}>Titel</label>
				<input class="form-control mb-3" id={`${createModalId}-title-input`} type="text" placeholder="Aktivitaet" />

				<label class="form-label" for={`${createModalId}-place`}>Ort</label>
				<input class="form-control mb-3" id={`${createModalId}-place`} type="text" placeholder="Ort" />

				<label class="form-label" for={`${createModalId}-note`}>Notiz</label>
				<textarea class="form-control" id={`${createModalId}-note`} rows="3" placeholder="Kurze Beschreibung"></textarea>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Abbrechen</button>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aktivitaet hinzufuegen</button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id={editModalId} tabindex="-1" aria-labelledby={`${editModalId}-title`} aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h3 class="modal-title fs-5" id={`${editModalId}-title`}>Aktivitaet bearbeiten</h3>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schliessen"></button>
			</div>
			<div class="modal-body">
				<label class="form-label" for={`${editModalId}-date`}>Datum</label>
				<input class="form-control mb-3" id={`${editModalId}-date`} type="text" value={selectedActivity?.date ?? ''} />

				<label class="form-label" for={`${editModalId}-time`}>Zeit</label>
				<input class="form-control mb-3" id={`${editModalId}-time`} type="text" value={selectedActivity?.time ?? ''} />

				<label class="form-label" for={`${editModalId}-title-input`}>Titel</label>
				<input class="form-control mb-3" id={`${editModalId}-title-input`} type="text" value={selectedActivity?.title ?? ''} />

				<label class="form-label" for={`${editModalId}-place`}>Ort</label>
				<input class="form-control mb-3" id={`${editModalId}-place`} type="text" value={selectedActivity?.place ?? ''} />

				<label class="form-label" for={`${editModalId}-note`}>Notiz</label>
				<textarea class="form-control" id={`${editModalId}-note`} rows="3" value={selectedActivity?.description ?? ''}></textarea>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Aktivitaet loeschen</button>
				<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Abbrechen</button>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Speichern</button>
			</div>
		</div>
	</div>
</div>

<style>
	.activities-section {
		display: grid;
		gap: 6px;
		min-height: 0;
	}

	.section-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.eyebrow {
		margin: 0;
		color: #355aa2;
		font-size: 0.76rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	.section-heading button,
	.activity-row button {
		min-height: 32px;
		padding: 0 10px;
		border: 1px solid rgba(65, 105, 190, 0.2);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.66);
		color: #2f5fc8;
		font: inherit;
		font-size: 0.82rem;
		font-weight: 900;
	}

	.detail-card {
		border: 1px solid rgba(65, 105, 190, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.78);
		box-shadow: 0 14px 38px rgba(51, 87, 158, 0.13);
	}

	.activities-panel {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 10px;
		height: 100%;
		min-height: 0;
		padding: 12px;
	}

	.filter-row {
		display: grid;
		grid-template-columns: auto minmax(160px, 220px);
		align-items: center;
		gap: 10px;
	}

	.filter-row label {
		color: #52617b;
		font-size: 0.72rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	.activity-list {
		display: grid;
		align-content: start;
		gap: 8px;
		min-height: 0;
		max-height: 230px;
		overflow-y: auto;
		padding-right: 4px;
	}

	.activity-row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 10px;
		padding: 9px 10px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
	}

	.activity-date {
		display: grid;
		width: 48px;
		height: 48px;
		place-items: center;
		border-radius: 8px;
		background: rgba(138, 175, 255, 0.24);
		color: #14213d;
		font-weight: 900;
	}

	.activity-date span {
		font-size: 1rem;
		line-height: 1;
	}

	.activity-date strong {
		font-size: 0.72rem;
		text-transform: uppercase;
	}

	.activity-row div:nth-child(2) {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.activity-row div:nth-child(2) > span {
		color: #52617b;
		font-size: 0.78rem;
		font-weight: 800;
	}

	.activity-row p {
		margin: 0;
		color: #40516d;
		font-size: 0.88rem;
		line-height: 1.35;
	}

	.empty-note {
		margin: 0;
		padding: 12px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
		color: #52617b;
		font-size: 0.9rem;
		font-weight: 800;
	}

	:global(.btn-primary) {
		--bs-btn-bg: #14213d;
		--bs-btn-border-color: #14213d;
		--bs-btn-hover-bg: #22345b;
		--bs-btn-hover-border-color: #22345b;
	}

	@media (max-width: 760px) {
		.filter-row,
		.activity-row {
			grid-template-columns: 1fr;
		}

		.activity-list {
			max-height: none;
		}
	}
</style>
