<script>
	let { data } = $props();

	let selectedIndex = $state(null);
	let selectedPhoto = $derived(selectedIndex === null ? null : data.trip?.photos[selectedIndex]);

	function openPhoto(index) {
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
</script>

<svelte:head>
	<title>TravelJournal | Fotos</title>
	<meta name="description" content="Oeffentliche Foto-Galerie einer Reise im TravelJournal." />
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
					<a href={`/social/trips/${data.trip.id}`}>Zurueck zur Reise</a>
				</div>
			</header>

			{#if data.trip.photos.length > 0}
				<div class="photo-grid" aria-label="Alle Fotos">
					{#each data.trip.photos as photo, index}
						<article class="photo-card">
							<button class="photo-open" type="button" onclick={() => openPhoto(index)}>
								<img src={photo.url} alt={photo.name} />
							</button>
							<div class="photo-banner">
								<span>{photo.name}</span>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<div class="empty-card">
					<p>Noch keine Fotos erfasst.</p>
					<a href={`/social/trips/${data.trip.id}`}>Zurueck zur Reise</a>
				</div>
			{/if}
		{:else}
			<div class="empty-card">
				<p>{data.errorMessage}</p>
				<a href="/social">Zurueck zu Social</a>
			</div>
		{/if}
	</div>
</section>

{#if selectedPhoto}
	<div class="viewer" role="dialog" aria-modal="true" aria-label="Fotoansicht">
		<button class="viewer-close" type="button" onclick={closePhoto} aria-label="Schliessen">x</button>
		<button class="viewer-arrow viewer-arrow-left" type="button" onclick={showPrevious} aria-label="Vorheriges Foto">
			&lt;
		</button>
		<img src={selectedPhoto.url} alt={selectedPhoto.name} />
		<button class="viewer-arrow viewer-arrow-right" type="button" onclick={showNext} aria-label="Naechstes Foto">
			&gt;
		</button>
	</div>
{/if}

<style>
	.photos-page {
		min-height: 100%;
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

	.photo-banner {
		display: grid;
		align-items: center;
		min-height: 48px;
		padding: 8px 14px;
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
