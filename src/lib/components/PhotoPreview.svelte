<script>
	let { trip, photoError = '', readonly = false, galleryHref = '' } = $props();

	const placeholderPhotos = [
		{ label: 'Foto 1', colors: ['#8aafff', '#ffffff'] },
		{ label: 'Foto 2', colors: ['#dbe7ff', '#4169be'] },
		{ label: 'Foto 3', colors: ['#f6bd60', '#355070'] }
	];

	let uploadModalId = $derived(`photo-upload-${trip.id}`);
	let visiblePhotos = $derived([...trip.photos.slice(0, 3), ...placeholderPhotos].slice(0, 3));
</script>

<section class="photo-section" aria-labelledby="photo-title">
	<p class="eyebrow" id="photo-title">Fotos</p>

	<div class="detail-card photo-panel">
		{#if photoError}
			<p class="photo-error" role="alert">{photoError}</p>
		{/if}

		<div class="photo-grid" class:readonly class:hasGallery={galleryHref}>
			{#each visiblePhotos as photo}
				<div
					class="photo-tile"
					class:hasImage={photo.url}
					style={`--photo-start: ${photo.colors[0]}; --photo-end: ${photo.colors[1]};`}
				>
					{#if photo.url}
						<img src={photo.url} alt={photo.label} />
					{/if}
				</div>
			{/each}

			{#if !readonly || galleryHref}
			<div class="photo-actions-tile" class:single={readonly}>
				{#if !readonly}
				<button
					class="photo-action"
					type="button"
					data-bs-toggle="modal"
					data-bs-target={`#${uploadModalId}`}
				>
					<span>+</span>
					<strong>Fotos hinzufügen</strong>
				</button>
				{/if}
				<a class="photo-action" href={galleryHref || `/trips/${trip.id}/photos`}>
					<span>></span>
					<strong>Alle Fotos ansehen</strong>
				</a>
			</div>
			{/if}
		</div>
	</div>
</section>

{#if !readonly}
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

<style>
	.photo-section {
		display: grid;
		gap: 6px;
	}

	.detail-card {
		border: 1px solid rgba(65, 105, 190, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.78);
		box-shadow: 0 14px 38px rgba(51, 87, 158, 0.13);
	}

	.photo-panel {
		padding: 14px;
	}

	.photo-error {
		margin: 0 0 10px;
		padding: 10px 12px;
		border: 1px solid rgba(220, 53, 69, 0.28);
		border-radius: 8px;
		background: rgba(220, 53, 69, 0.08);
		color: #8a1f2d;
		font-size: 0.86rem;
		font-weight: 800;
	}

	.eyebrow {
		margin: 0;
		color: #355aa2;
		font-size: 0.76rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	.photo-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 12px;
	}

	.photo-grid.readonly {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.photo-grid.readonly.hasGallery {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.photo-tile,
	.photo-actions-tile {
		position: relative;
		min-height: 150px;
		overflow: hidden;
		border-radius: 8px;
	}

	.photo-tile {
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0)),
			linear-gradient(135deg, var(--photo-start), var(--photo-end));
	}

	.photo-tile img {
		position: absolute;
		inset: 0;
		z-index: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.photo-tile::before,
	.photo-tile::after {
		position: absolute;
		right: -12%;
		left: -12%;
		content: '';
	}

	.photo-tile.hasImage::before,
	.photo-tile.hasImage::after {
		display: none;
	}

	.photo-tile::before {
		bottom: 38px;
		height: 90px;
		background:
			linear-gradient(135deg, transparent 0 20%, rgba(20, 33, 61, 0.44) 20% 56%, transparent 56%),
			linear-gradient(225deg, transparent 0 22%, rgba(20, 33, 61, 0.32) 22% 64%, transparent 64%);
	}

	.photo-tile::after {
		bottom: 0;
		height: 58px;
		background: rgba(255, 255, 255, 0.28);
	}

	.photo-actions-tile {
		display: grid;
		grid-template-rows: 1fr 1fr;
		gap: 8px;
	}

	.photo-actions-tile.single {
		grid-template-rows: 1fr;
	}

	.photo-action {
		display: grid;
		grid-template-columns: 38px minmax(0, 1fr);
		align-items: center;
		gap: 10px;
		padding: 0 12px;
		border: 1px dashed rgba(65, 105, 190, 0.38);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.64);
		color: #14213d;
		font: inherit;
		font-size: 0.9rem;
		font-weight: 900;
		text-align: left;
		text-decoration: none;
	}

	.photo-action span {
		display: grid;
		width: 34px;
		height: 34px;
		place-items: center;
		border-radius: 50%;
		background: #14213d;
		color: #ffffff;
		font-size: 1.25rem;
		line-height: 1;
	}

	@media (max-width: 700px) {
		.photo-panel {
			grid-template-columns: 1fr;
		}

		.photo-grid {
			grid-template-columns: 1fr;
		}

		.photo-tile,
		.photo-actions-tile {
			min-height: 130px;
		}
	}
</style>
