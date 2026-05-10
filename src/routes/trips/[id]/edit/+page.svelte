<svelte:head>
	<title>TravelJournal | {data.trip ? `${data.trip.place} ${data.trip.year} bearbeiten` : 'Reise bearbeiten'}</title>
	<meta name="description" content="Grunddaten einer Reise im TravelJournal bearbeiten." />
</svelte:head>

<script>
	let { data, form } = $props();

	const continents = ['Europa', 'Asien', 'Afrika', 'Nordamerika', 'Südamerika', 'Ozeanien', 'Antarktis'];

	let status = $state('active');
	let visibility = $state('private');

	let values = $derived(form?.values ?? data.trip ?? {});
	let title = $derived(data.trip ? `${data.trip.place} ${data.trip.year}` : 'Reise nicht gefunden');
	let deleteModalId = $derived(data.trip ? `delete-trip-${data.trip.id}` : 'delete-trip');

	$effect(() => {
		status = values.status ?? 'active';
		visibility = values.visibility ?? 'private';
	});
</script>

<section class="edit-trip-page" aria-labelledby="edit-trip-title">
	<div class="edit-trip-container container-xxl">
		{#if data.trip}
			<header class="page-header">
				<div>
					<p class="eyebrow">Reise bearbeiten</p>
					<h1 id="edit-trip-title">{title}</h1>
					<p>
						Hier pflegst du die Grunddaten. Fotos, Aktivitäten, Kommentare, Notizen und Kosten
						bearbeitest du direkt auf der Detailseite.
					</p>
				</div>
			</header>

			<form class="trip-form" method="POST" action="?/save">
				{#if form?.errors?.form}
					<div class="form-alert" role="alert">{form.errors.form}</div>
				{/if}

				<div class="form-grid">
					<label class="field">
						<span>Ort</span>
						<input
							class="form-control"
							name="place"
							type="text"
							value={values.place ?? ''}
							required
							aria-invalid={form?.errors?.place ? 'true' : undefined}
						/>
						{#if form?.errors?.place}
							<small>{form.errors.place}</small>
						{/if}
					</label>

					<label class="field">
						<span>Kontinent</span>
						<select
							class="form-select"
							name="continent"
							required
							aria-invalid={form?.errors?.continent ? 'true' : undefined}
						>
							<option value="">Auswählen</option>
							{#each continents as continent}
								<option value={continent} selected={values.continent === continent}>{continent}</option>
							{/each}
						</select>
						{#if form?.errors?.continent}
							<small>{form.errors.continent}</small>
						{/if}
					</label>

					<label class="field field-wide">
						<span>Kurznotiz</span>
						<textarea class="form-control" name="shortNote" rows="3">{values.shortNote ?? ''}</textarea>
					</label>

					<label class="field">
						<span>Datum Beginn</span>
						<input
							class="form-control"
							name="startDate"
							type="text"
							inputmode="numeric"
							value={values.startDate ?? ''}
							placeholder="dd.mm.yyyy"
							maxlength="10"
							required
							aria-invalid={form?.errors?.startDate ? 'true' : undefined}
						/>
						{#if form?.errors?.startDate}
							<small>{form.errors.startDate}</small>
						{/if}
					</label>

					<label class="field">
						<span>Datum Ende</span>
						<input
							class="form-control"
							name="endDate"
							type="text"
							inputmode="numeric"
							value={values.endDate ?? ''}
							placeholder="dd.mm.yyyy"
							maxlength="10"
							required
							aria-invalid={form?.errors?.endDate ? 'true' : undefined}
						/>
						{#if form?.errors?.endDate}
							<small>{form.errors.endDate}</small>
						{/if}
					</label>

					<div class="field">
						<span>Status</span>
						<input type="hidden" name="status" value={status} />
						<div class="segmented" aria-label="Reisestatus">
							<button class:active={status === 'active'} type="button" onclick={() => (status = 'active')}>
								Aktiv
							</button>
							<button
								class:active={status === 'completed'}
								type="button"
								onclick={() => (status = 'completed')}
							>
								Abgeschlossen
							</button>
						</div>
					</div>

					<div class="field">
						<span>Sichtbarkeit</span>
						<input type="hidden" name="visibility" value={visibility} />
						<div class="segmented" aria-label="Sichtbarkeit">
							<button class:active={visibility === 'private'} type="button" onclick={() => (visibility = 'private')}>
								Privat
							</button>
							<button class:active={visibility === 'public'} type="button" onclick={() => (visibility = 'public')}>
								Öffentlich
							</button>
						</div>
					</div>

					<label class="field">
						<span>Budget</span>
						<input
							class="form-control"
							name="budget"
							type="number"
							min="0"
							step="0.01"
							value={values.budget ?? ''}
							placeholder="0.00"
							aria-invalid={form?.errors?.budget ? 'true' : undefined}
						/>
						{#if form?.errors?.budget}
							<small>{form.errors.budget}</small>
						{/if}
					</label>
				</div>

				<div class="form-actions">
					<a class="cancel-link" href={`/trips/${data.trip.id}`}>Abbrechen</a>
					<button class="submit-link" type="submit">Änderungen speichern</button>
				</div>
			</form>

			<section class="danger-zone" aria-labelledby="danger-title">
				<div>
					<p class="eyebrow danger-eyebrow">Gefahrenbereich</p>
					<h2 id="danger-title">Reise löschen</h2>
					<p>Diese Aktion entfernt die Reise mit allen gespeicherten Detaildaten dauerhaft aus MongoDB.</p>
					{#if form?.errors?.delete}
						<p class="delete-error" role="alert">{form.errors.delete}</p>
					{/if}
				</div>

				<button class="delete-link" type="button" data-bs-toggle="modal" data-bs-target={`#${deleteModalId}`}>
					Reise löschen
				</button>
			</section>

			<div class="modal fade" id={deleteModalId} tabindex="-1" aria-labelledby={`${deleteModalId}-title`} aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered">
					<div class="modal-content">
						<div class="modal-header">
							<h3 class="modal-title fs-5" id={`${deleteModalId}-title`}>Reise wirklich löschen?</h3>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schliessen"></button>
						</div>
						<div class="modal-body">
							<p>
								{data.trip.place} {data.trip.year} wird dauerhaft gelöscht. Diese Aktion kann später
								nicht rückgängig gemacht werden.
							</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Abbrechen</button>
							<form method="POST" action="?/delete">
								<button type="submit" class="btn btn-danger">Endgültig löschen</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="not-found-card" role="status">
				<p class="eyebrow">TravelJournal</p>
				<h1 id="edit-trip-title">Reise nicht gefunden</h1>
				<p>{data.errorMessage}</p>
				<a href="/trips">Zurück zur Übersicht</a>
			</div>
		{/if}
	</div>
</section>

<style>
	.edit-trip-page {
		height: 100%;
		min-height: 0;
		overflow-y: auto;
		padding: 24px 28px;
	}

	.edit-trip-container {
		display: grid;
		gap: 20px;
	}

	.page-header,
	.trip-form,
	.danger-zone,
	.not-found-card {
		border: 1px solid rgba(255, 255, 255, 0.86);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.76);
		box-shadow: 0 18px 52px rgba(51, 87, 158, 0.16);
		backdrop-filter: blur(18px);
	}

	.page-header,
	.danger-zone,
	.not-found-card {
		padding: 22px 24px;
	}

	.eyebrow,
	.field > span {
		margin: 0 0 8px;
		color: #355aa2;
		font-size: 0.76rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	.danger-eyebrow {
		color: #b42318;
	}

	h1,
	h2 {
		margin: 0 0 10px;
		line-height: 1;
	}

	h1 {
		font-size: clamp(2rem, 4vw, 3.2rem);
	}

	h2 {
		font-size: 1.35rem;
	}

	.page-header p:last-child,
	.danger-zone p:last-child,
	.not-found-card p:last-child {
		max-width: 720px;
		margin: 0;
		color: #52617b;
		line-height: 1.55;
	}

	.trip-form {
		display: grid;
		gap: 22px;
		padding: 24px;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 18px;
	}

	.field {
		display: grid;
		align-content: start;
	}

	.field-wide {
		grid-column: 1 / -1;
	}

	.form-control,
	.form-select {
		min-height: 44px;
		border-color: rgba(65, 105, 190, 0.2);
		border-radius: 8px;
		color: #14213d;
		font-weight: 700;
	}

	.field small {
		margin-top: 6px;
		color: #b42318;
		font-size: 0.82rem;
		font-weight: 800;
	}

	.form-alert,
	.delete-error {
		padding: 12px 14px;
		border: 1px solid rgba(180, 35, 24, 0.22);
		border-radius: 8px;
		background: rgba(180, 35, 24, 0.08);
		color: #b42318;
		font-weight: 900;
	}

	.delete-error {
		margin: 12px 0 0;
	}

	.form-control[aria-invalid='true'],
	.form-select[aria-invalid='true'] {
		border-color: #b42318;
	}

	.form-control:focus,
	.form-select:focus {
		border-color: #4169be;
		box-shadow: 0 0 0 0.25rem rgba(138, 175, 255, 0.28);
	}

	.segmented {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
		padding: 4px;
		border: 1px solid rgba(65, 105, 190, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.58);
	}

	.segmented button {
		min-height: 38px;
		border: 0;
		border-radius: 6px;
		background: transparent;
		color: #40516d;
		font: inherit;
		font-size: 0.9rem;
		font-weight: 900;
	}

	.segmented button.active {
		background: #14213d;
		color: #ffffff;
	}

	.form-actions,
	.danger-zone {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.form-actions {
		justify-content: flex-end;
		gap: 12px;
	}

	.cancel-link,
	.submit-link,
	.delete-link,
	.not-found-card a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 0 16px;
		border-radius: 8px;
		font-weight: 900;
		text-decoration: none;
		white-space: nowrap;
	}

	.cancel-link {
		border: 1px solid rgba(65, 105, 190, 0.18);
		background: rgba(255, 255, 255, 0.72);
		color: #40516d;
	}

	.submit-link {
		border: 0;
		background: #14213d;
		color: #ffffff;
		box-shadow: 0 12px 28px rgba(20, 33, 61, 0.22);
		font: inherit;
	}

	.delete-link {
		border: 0;
		background: #b42318;
		color: #ffffff;
		font: inherit;
	}

	.not-found-card {
		display: grid;
		justify-items: start;
		gap: 12px;
		max-width: 680px;
	}

	.not-found-card a {
		background: #14213d;
		color: #ffffff;
	}

	.submit-link:hover {
		background: #22345b;
		color: #ffffff;
	}

	.delete-link:hover {
		background: #991b1b;
		color: #ffffff;
	}

	:global(.btn-danger) {
		--bs-btn-bg: #b42318;
		--bs-btn-border-color: #b42318;
		--bs-btn-hover-bg: #991b1b;
		--bs-btn-hover-border-color: #991b1b;
	}

	@media (max-width: 760px) {
		.edit-trip-page {
			padding: 16px;
		}

		.page-header,
		.trip-form,
		.danger-zone,
		.not-found-card {
			padding: 18px;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}

		.form-actions,
		.danger-zone {
			align-items: stretch;
			flex-direction: column;
		}
	}
</style>
