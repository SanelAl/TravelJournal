<script>
	let { data, form } = $props();

	let selectedIndex = $state(null);
	let selectionMode = $state(false);
	let selectedPhotoIds = $state([]);
	let selectedPhoto = $derived(selectedIndex === null ? null : data.trip?.photos[selectedIndex]);
	let selectedCount = $derived(selectedPhotoIds.length);
	let uploadModalId = $derived(data.trip ? `photos-upload-${data.trip.id}` : 'photos-upload');

	function openPhoto(index) {
		if (selectionMode) {
			togglePhotoSelection(data.trip.photos[index].id);
			return;
		}

		selectedIndex = index;
	}

	function closePhoto() {
		selectedIndex = null;
	}

	function showPrevious() {
		if (!data.trip?.photos.length) return;
		selectedIndex = selectedIndex === 0 ? data.trip.photos.length - 1 : selectedIndex - 1;
	}

	function showNext() {
		if (!data.trip?.photos.length) return;
		selectedIndex = selectedIndex === data.trip.photos.length - 1 ? 0 : selectedIndex + 1;
	}

	function toggleSelectionMode() {
		selectionMode = !selectionMode;
		selectedPhotoIds = [];
	}

	function isSelected(photoId) {
		return selectedPhotoIds.includes(photoId);
	}

	function togglePhotoSelection(photoId) {
		selectedPhotoIds = isSelected(photoId)
			? selectedPhotoIds.filter((selectedPhotoId) => selectedPhotoId !== photoId)
			: [...selectedPhotoIds, photoId];
	}
</script>

<svelte:head>
	<title>TravelJournal | Fotos</title>
	<meta name="description" content="Foto-Galerie einer Reise im TravelJournal." />
</svelte:head>

<section class="photos-page">
	<div class="photos-container container-xxl">
		{#if data.trip}
			<header class="photos-header">
				<div>
					<p class="eyebrow">Fotos</p>
					<h1>{data.trip.place} {data.trip.year}</h1>
				</div>
				<div class="header-actions">
					<a href={`/trips/${data.trip.id}`}>Zurück zur Reise</a>
					<button class="header-button" type="button" data-bs-toggle="modal" data-bs-target={`#${uploadModalId}`}>
						Fotos hinzufügen
					</button>
					<button
						class:active={selectionMode}
						class="header-button"
						type="button"
						onclick={toggleSelectionMode}
					>
						{selectionMode ? 'Auswahl beenden' : 'Auswahl'}
					</button>
					{#if selectionMode}
						<form method="POST" action="?/deleteSelectedPhotos">
							{#each selectedPhotoIds as photoId}
								<input type="hidden" name="photoIds" value={photoId} />
							{/each}
							<button class="delete-selected-button" type="submit" disabled={selectedCount === 0}>
								Fotos löschen{selectedCount > 0 ? ` (${selectedCount})` : ''}
							</button>
						</form>
					{/if}
				</div>
			</header>

			{#if form?.errors?.photo}
				<p class="photo-error" role="alert">{form.errors.photo}</p>
			{/if}

			{#if data.trip.photos.length > 0}
				<div class="photo-grid" aria-label="Alle Fotos">
					{#each data.trip.photos as photo, index}
						<article class="photo-card" class:selected={isSelected(photo.id)}>
							<button class="photo-open" type="button" onclick={() => openPhoto(index)}>
								<img src={photo.url} alt={photo.name} />
								{#if selectionMode}
									<span class="selection-marker" aria-hidden="true">{isSelected(photo.id) ? '✓' : ''}</span>
								{/if}
							</button>
							<div class="photo-banner">
								<span>{photo.name}</span>
								<form method="POST" action="?/deletePhoto">
									<input type="hidden" name="photoId" value={photo.id} />
									<button class="delete-button" type="submit" aria-label={`${photo.name} löschen`}>
										<svg viewBox="0 0 24 24" aria-hidden="true">
											<path
												d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-.7 11.2A2 2 0 0 1 14.3 22H9.7a2 2 0 0 1-2-1.8L7 9Zm3 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z"
											/>
										</svg>
									</button>
								</form>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<div class="empty-card">
					<p>Noch keine Fotos erfasst.</p>
					<a href={`/trips/${data.trip.id}`}>Auf der Detailseite Fotos hinzufügen</a>
				</div>
			{/if}
		{:else}
			<div class="empty-card">
				<p>{data.errorMessage}</p>
				<a href="/trips">Zurück zur Übersicht</a>
			</div>
		{/if}
	</div>
</section>

{#if data.trip}
	<div class="modal fade" id={uploadModalId} tabindex="-1" aria-labelledby={`${uploadModalId}-title`} aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<form class="modal-content" method="POST" action="?/addPhoto" enctype="multipart/form-data">
				<div class="modal-header">
					<h2 class="modal-title fs-5" id={`${uploadModalId}-title`}>Foto hinzufügen</h2>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schliessen"></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label class="form-label" for={`${uploadModalId}-name`}>Name</label>
						<input
							class="form-control"
							id={`${uploadModalId}-name`}
							name="photoName"
							type="text"
							placeholder="z.B. Sonnenuntergang am See"
						/>
						<div class="form-text">Bei mehreren Bildern wird automatisch der jeweilige Dateiname verwendet.</div>
					</div>
					<div>
						<label class="form-label" for={`${uploadModalId}-file`}>Bilddateien</label>
						<input
							class="form-control"
							id={`${uploadModalId}-file`}
							name="photoFile"
							type="file"
							accept="image/*"
							multiple
							required
						/>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Abbrechen</button>
					<button type="submit" class="btn btn-primary">Foto speichern</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if selectedPhoto}
	<div class="viewer" role="dialog" aria-modal="true" aria-label="Fotoansicht">
		<button class="viewer-close" type="button" onclick={closePhoto} aria-label="Schliessen">x</button>
		<button class="viewer-arrow viewer-arrow-left" type="button" onclick={showPrevious} aria-label="Vorheriges Foto">
			&lt;
		</button>
		<img src={selectedPhoto.url} alt={selectedPhoto.name} />
		<button class="viewer-arrow viewer-arrow-right" type="button" onclick={showNext} aria-label="Nächstes Foto">
			&gt;
		</button>
	</div>
{/if}

<style>
	.photos-page {
		height: 100%;
		min-height: 0;
		overflow-y: auto;
		padding: 22px 28px;
	}

	.photos-container {
		display: grid;
		gap: 18px;
	}

	.photos-header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 16px;
	}

	.header-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: 10px;
	}

	.eyebrow {
		margin: 0 0 4px;
		color: #355aa2;
		font-size: 0.76rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	h1 {
		margin: 0;
		color: #14213d;
		font-size: clamp(1.9rem, 4vw, 3rem);
		line-height: 1;
	}

	.photos-header a,
	.header-button,
	.delete-selected-button,
	.empty-card a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 40px;
		padding: 0 14px;
		border-radius: 8px;
		border: 0;
		background: #14213d;
		color: #ffffff;
		font: inherit;
		font-size: 0.9rem;
		font-weight: 900;
		text-decoration: none;
		cursor: pointer;
	}

	.header-button {
		border: 1px solid rgba(65, 105, 190, 0.18);
		background: rgba(255, 255, 255, 0.76);
		color: #14213d;
	}

	.header-button:hover,
	.header-button:focus,
	.header-button.active {
		background: rgba(138, 175, 255, 0.28);
		color: #14213d;
	}

	.delete-selected-button {
		background: #b42335;
	}

	.delete-selected-button:disabled {
		opacity: 0.48;
		cursor: not-allowed;
	}

	.photo-error {
		margin: 0;
		padding: 10px 12px;
		border: 1px solid rgba(220, 53, 69, 0.28);
		border-radius: 8px;
		background: rgba(220, 53, 69, 0.08);
		color: #8a1f2d;
		font-size: 0.86rem;
		font-weight: 800;
	}

	.photo-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 16px;
	}

	.photo-card,
	.empty-card {
		overflow: hidden;
		border: 1px solid rgba(65, 105, 190, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.78);
		box-shadow: 0 14px 38px rgba(51, 87, 158, 0.13);
	}

	.photo-card.selected {
		border-color: rgba(20, 33, 61, 0.78);
		box-shadow:
			0 0 0 3px rgba(138, 175, 255, 0.55),
			0 14px 38px rgba(51, 87, 158, 0.13);
	}

	.photo-open {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		padding: 0;
		border: 0;
		background: #dbe7ff;
		cursor: pointer;
	}

	.photo-open img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 160ms ease;
	}

	.photo-card:hover .photo-open img {
		transform: scale(1.03);
	}

	.selection-marker {
		position: absolute;
		top: 12px;
		right: 12px;
		z-index: 1;
		display: grid;
		width: 34px;
		height: 34px;
		place-items: center;
		border: 2px solid #ffffff;
		border-radius: 50%;
		background: rgba(20, 33, 61, 0.5);
		color: #ffffff;
		font-size: 1rem;
		font-weight: 900;
		box-shadow: 0 8px 18px rgba(0, 0, 0, 0.22);
	}

	.photo-banner {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 10px;
		min-height: 48px;
		padding: 8px 10px 8px 14px;
		background: rgba(255, 255, 255, 0.9);
	}

	.photo-banner span {
		overflow: hidden;
		color: #14213d;
		font-size: 0.9rem;
		font-weight: 900;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.delete-button {
		display: grid;
		width: 34px;
		height: 34px;
		place-items: center;
		border: 1px solid rgba(220, 53, 69, 0.24);
		border-radius: 8px;
		background: rgba(220, 53, 69, 0.08);
		color: #b42335;
		cursor: pointer;
	}

	.delete-button:hover,
	.delete-button:focus {
		background: #b42335;
		color: #ffffff;
	}

	.delete-button svg {
		width: 18px;
		height: 18px;
		fill: currentColor;
	}

	.empty-card {
		display: grid;
		justify-items: start;
		gap: 12px;
		padding: 22px;
	}

	.empty-card p {
		margin: 0;
		color: #33415c;
		font-weight: 800;
	}

	.viewer {
		position: fixed;
		inset: 0;
		z-index: 2000;
		display: grid;
		place-items: center;
		padding: 64px;
		background: rgba(10, 18, 35, 0.86);
	}

	.viewer img {
		max-width: min(100%, 1100px);
		max-height: 82dvh;
		border-radius: 8px;
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.38);
		object-fit: contain;
	}

	.viewer-close,
	.viewer-arrow {
		position: fixed;
		display: grid;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.28);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.14);
		color: #ffffff;
		font: inherit;
		font-weight: 900;
		cursor: pointer;
	}

	.viewer-close {
		top: 24px;
		right: 24px;
		width: 42px;
		height: 42px;
		font-size: 1.15rem;
	}

	.viewer-arrow {
		top: 50%;
		width: 48px;
		height: 64px;
		font-size: 2rem;
		transform: translateY(-50%);
	}

	.viewer-arrow-left {
		left: 24px;
	}

	.viewer-arrow-right {
		right: 24px;
	}

	.viewer-close:hover,
	.viewer-arrow:hover,
	.viewer-close:focus,
	.viewer-arrow:focus {
		background: rgba(255, 255, 255, 0.26);
	}

	@media (max-width: 760px) {
		.photos-page {
			padding: 16px;
		}

		.photos-header {
			align-items: start;
			flex-direction: column;
		}

		.header-actions {
			justify-content: start;
			width: 100%;
		}

		.photo-grid {
			grid-template-columns: 1fr;
		}

		.viewer {
			padding: 54px 18px;
		}

		.viewer-arrow {
			width: 40px;
			height: 54px;
		}
	}
</style>
