<svelte:head>
	<title>TravelJournal | Reise bearbeiten</title>
	<meta name="description" content="Grunddaten einer Reise im TravelJournal Prototyp bearbeiten." />
</svelte:head>

<script>
	let { data } = $props();

	const continents = ['Europa', 'Asien', 'Afrika', 'Nordamerika', 'Suedamerika', 'Ozeanien', 'Antarktis'];

	const trips = [
		{
			id: 'kyoto-2026',
			place: 'Kyoto',
			continent: 'Asien',
			description: 'Tempel, Streetfood und ruhige Morgen zwischen Bambuswaeldern und Altstadtgassen.',
			startDate: '12.04.2026',
			endDate: '20.04.2026',
			budget: 2000
		},
		{
			id: 'lisbon-2025',
			place: 'Lissabon',
			continent: 'Europa',
			description: 'Aussichtspunkte, Tramfahrten, Pasteis de Nata und ein Tagesausflug ans Meer.',
			startDate: '03.09.2025',
			endDate: '08.09.2025',
			budget: 980
		},
		{
			id: 'reykjavik-2024',
			place: 'Reykjavik',
			continent: 'Europa',
			description: 'Nordlichter, heisse Quellen und lange Fahrten durch eine sehr stille Landschaft.',
			startDate: '18.02.2024',
			endDate: '25.02.2024',
			budget: 2450
		}
	];

	function fallbackTrip(id) {
		return {
			id,
			place: 'Unbekannte Reise',
			continent: '',
			description: 'Diese Reise ist in den statischen Mock-Daten noch nicht vorhanden.',
			startDate: '',
			endDate: '',
			budget: 0
		};
	}

	let trip = $derived(trips.find((item) => item.id === data.id) ?? fallbackTrip(data.id));
</script>

<section class="edit-trip-page" aria-labelledby="edit-trip-title">
	<div class="edit-trip-container container-xxl">
		<header class="page-header">
			<div>
				<p class="eyebrow">Reise bearbeiten</p>
				<h1 id="edit-trip-title">{trip.place}</h1>
				<p>
					Hier pflegst du nur die Grunddaten. Fotos, Aktivitaeten, Kommentare, Notizen und Kosten
					bearbeitest du direkt auf der Detailseite.
				</p>
			</div>
		</header>

		<form class="trip-form">
			<div class="form-grid">
				<label class="field">
					<span>Ort</span>
					<input class="form-control" name="place" type="text" value={trip.place} required />
				</label>

				<label class="field">
					<span>Kontinent</span>
					<select class="form-select" name="continent" required>
						<option value="">Auswaehlen</option>
						{#each continents as continent}
							<option value={continent} selected={continent === trip.continent}>{continent}</option>
						{/each}
					</select>
				</label>

				<label class="field field-wide">
					<span>Kurznotiz</span>
					<textarea class="form-control" name="description" rows="3">{trip.description}</textarea>
				</label>

				<label class="field">
					<span>Datum Beginn</span>
					<input
						class="form-control"
						name="startDate"
						type="text"
						inputmode="numeric"
						value={trip.startDate}
						placeholder="dd.mm.yyyy"
						pattern="[0-9]{2}\.[0-9]{2}\.[0-9]{4}"
						required
					/>
				</label>

				<label class="field">
					<span>Datum Ende</span>
					<input
						class="form-control"
						name="endDate"
						type="text"
						inputmode="numeric"
						value={trip.endDate}
						placeholder="dd.mm.yyyy"
						pattern="[0-9]{2}\.[0-9]{2}\.[0-9]{4}"
						required
					/>
				</label>

				<label class="field">
					<span>Budget</span>
					<input class="form-control" name="budget" type="number" min="0" step="0.01" value={trip.budget} />
				</label>
			</div>

			<div class="form-actions">
				<a class="cancel-link" href={`/trips/${trip.id}`}>Abbrechen</a>
				<a class="submit-link" href={`/trips/${trip.id}`}>Aenderungen speichern</a>
			</div>
		</form>

		<section class="danger-zone" aria-labelledby="danger-title">
			<div>
				<p class="eyebrow danger-eyebrow">Gefahrenbereich</p>
				<h2 id="danger-title">Reise loeschen</h2>
				<p>Im Prototyp fuehrt dieser Button nur zurueck zur Uebersicht. Spaeter wird hier die Reise geloescht.</p>
			</div>

			<a class="delete-link" href="/trips">Reise loeschen</a>
		</section>
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
	.danger-zone {
		border: 1px solid rgba(255, 255, 255, 0.86);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.76);
		box-shadow: 0 18px 52px rgba(51, 87, 158, 0.16);
		backdrop-filter: blur(18px);
	}

	.page-header,
	.danger-zone {
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
	.danger-zone p:last-child {
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

	.form-control:focus,
	.form-select:focus {
		border-color: #4169be;
		box-shadow: 0 0 0 0.25rem rgba(138, 175, 255, 0.28);
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
	.delete-link {
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
		background: #14213d;
		color: #ffffff;
		box-shadow: 0 12px 28px rgba(20, 33, 61, 0.22);
	}

	.delete-link {
		background: #b42318;
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

	@media (max-width: 760px) {
		.edit-trip-page {
			padding: 16px;
		}

		.page-header,
		.trip-form,
		.danger-zone {
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
