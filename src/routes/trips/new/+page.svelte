<svelte:head>
	<title>TravelJournal | Neue Reise</title>
	<meta name="description" content="Grunddaten fuer eine neue Reise im TravelJournal Prototyp erfassen." />
</svelte:head>

<script>
	let { form } = $props();

	let status = $state('active');
	let visibility = $state('private');

	const continents = ['Europa', 'Asien', 'Afrika', 'Nordamerika', 'Suedamerika', 'Ozeanien', 'Antarktis'];

	$effect(() => {
		status = form?.values?.status ?? 'active';
		visibility = form?.values?.visibility ?? 'private';
	});
</script>

<section class="new-trip-page" aria-labelledby="new-trip-title">
	<div class="new-trip-container container-xxl">
		<header class="page-header">
			<div>
				<p class="eyebrow">Neue Reise</p>
				<h1 id="new-trip-title">Reise-Grundgeruest erfassen</h1>
				<p>Lege zuerst die Basisdaten an. Fotos, Aktivitaeten, Notizen und Kosten folgen spaeter auf der Detailseite.</p>
			</div>
		</header>

		<form class="trip-form" method="POST">
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
						value={form?.values?.place ?? ''}
						placeholder="z.B. Kyoto"
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
						<option value="">Auswaehlen</option>
						{#each continents as continent}
							<option value={continent} selected={form?.values?.continent === continent}>{continent}</option>
						{/each}
					</select>
					{#if form?.errors?.continent}
						<small>{form.errors.continent}</small>
					{/if}
				</label>

				<label class="field field-wide">
					<span>Kurznotiz</span>
					<textarea
						class="form-control"
						name="shortNote"
						rows="3"
						placeholder="Kurze Beschreibung oder Erinnerung zur Reise"
					>{form?.values?.shortNote ?? ''}</textarea>
				</label>

				<label class="field">
					<span>Datum Beginn</span>
					<input
						class="form-control"
						name="startDate"
						type="text"
						inputmode="numeric"
						value={form?.values?.startDate ?? ''}
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
						value={form?.values?.endDate ?? ''}
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
						<button
							class:active={status === 'active'}
							type="button"
							onclick={() => (status = 'active')}
						>
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
						<button
							class:active={visibility === 'private'}
							type="button"
							onclick={() => (visibility = 'private')}
						>
							Privat
						</button>
						<button
							class:active={visibility === 'public'}
							type="button"
							onclick={() => (visibility = 'public')}
						>
							Oeffentlich
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
						value={form?.values?.budget ?? ''}
						placeholder="0.00"
						aria-invalid={form?.errors?.budget ? 'true' : undefined}
					/>
					{#if form?.errors?.budget}
						<small>{form.errors.budget}</small>
					{/if}
				</label>
			</div>

			<div class="form-actions">
				<a class="cancel-link" href="/trips">Abbrechen</a>
				<button class="submit-link" type="submit">Reise erstellen</button>
			</div>
		</form>
	</div>
</section>

<style>
	.new-trip-page {
		height: 100%;
		min-height: 0;
		overflow-y: auto;
		padding: 24px 28px;
	}

	.new-trip-container {
		display: grid;
		gap: 20px;
	}

	.page-header,
	.trip-form {
		border: 1px solid rgba(255, 255, 255, 0.86);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.76);
		box-shadow: 0 18px 52px rgba(51, 87, 158, 0.16);
		backdrop-filter: blur(18px);
	}

	.page-header {
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

	h1 {
		margin: 0 0 10px;
		font-size: clamp(2rem, 4vw, 3.2rem);
		line-height: 1;
	}

	.page-header p:last-child {
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

	.form-alert {
		padding: 12px 14px;
		border: 1px solid rgba(180, 35, 24, 0.22);
		border-radius: 8px;
		background: rgba(180, 35, 24, 0.08);
		color: #b42318;
		font-weight: 900;
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

	.form-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 12px;
	}

	.cancel-link,
	.submit-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 0 16px;
		border-radius: 8px;
		font-weight: 900;
		text-decoration: none;
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

	.submit-link:hover {
		background: #22345b;
		color: #ffffff;
	}

	@media (max-width: 760px) {
		.new-trip-page {
			padding: 16px;
		}

		.page-header,
		.trip-form {
			padding: 18px;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}

		.form-actions {
			align-items: stretch;
			flex-direction: column;
		}
	}
</style>
