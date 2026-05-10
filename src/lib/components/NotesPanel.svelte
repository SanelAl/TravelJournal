<script>
	let { trip, noteError = '', noteValue = undefined } = $props();
	let noteText = $state('');

	$effect(() => {
		noteText = noteValue ?? trip.notes;
	});
</script>

<section class="notes-section" aria-labelledby={`notes-title-${trip.id}`}>
	<p class="eyebrow" id={`notes-title-${trip.id}`}>Notizen</p>

	<form class="detail-card notes-panel" method="POST" action="?/saveNotes">
		<textarea
			class="form-control"
			name="notes"
			bind:value={noteText}
			rows="6"
			placeholder="Eigene Notizen zu dieser Reise"
			aria-invalid={noteError ? 'true' : undefined}
		></textarea>
		{#if noteError}
			<p class="note-error" role="alert">{noteError}</p>
		{/if}
		<button type="submit">Notiz speichern</button>
	</form>
</section>

<style>
	.notes-section {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 6px;
		height: 100%;
		min-height: 0;
	}

	.detail-card {
		border: 1px solid rgba(65, 105, 190, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.78);
		box-shadow: 0 14px 38px rgba(51, 87, 158, 0.13);
	}

	.notes-panel {
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto auto;
		gap: 10px;
		height: 100%;
		min-height: 0;
		padding: 12px;
	}

	.eyebrow {
		margin: 0;
		color: #355aa2;
		font-size: 0.76rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	textarea {
		min-height: 150px;
		resize: vertical;
		font-size: 0.92rem;
	}

	textarea[aria-invalid='true'] {
		border-color: #b42318;
	}

	.note-error {
		margin: 0;
		padding: 9px 10px;
		border: 1px solid rgba(180, 35, 24, 0.22);
		border-radius: 8px;
		background: rgba(180, 35, 24, 0.08);
		color: #b42318;
		font-size: 0.84rem;
		font-weight: 900;
	}

	button {
		justify-self: end;
		min-height: 36px;
		padding: 0 12px;
		border: 0;
		border-radius: 8px;
		background: #14213d;
		color: #ffffff;
		font: inherit;
		font-size: 0.86rem;
		font-weight: 900;
	}
</style>
