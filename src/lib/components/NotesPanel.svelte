<script>
	let { trip } = $props();
	let noteText = $state('');

	$effect(() => {
		noteText = trip.notes;
	});
</script>

<section class="notes-section" aria-labelledby={`notes-title-${trip.id}`}>
	<p class="eyebrow" id={`notes-title-${trip.id}`}>Notizen</p>

	<div class="detail-card notes-panel">
		<textarea class="form-control" bind:value={noteText} rows="6" placeholder="Eigene Notizen zu dieser Reise"></textarea>
		<button type="button">Notiz speichern</button>
	</div>
</section>

<style>
	.notes-section {
		display: grid;
		gap: 6px;
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
