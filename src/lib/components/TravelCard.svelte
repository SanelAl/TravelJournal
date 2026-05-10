<script>
	let { trip } = $props();
</script>

<a class="travel-card" href={`/trips/${trip.id}`} aria-label={`${trip.place} ${trip.year} ansehen`}>
	<div class="card-copy">
		<div>
			<p class="eyebrow">{trip.continent}</p>
			<h2>{trip.place} {trip.year}</h2>
		</div>

		<p class="description">{trip.description}</p>

		<div class="detail-row" aria-label="Reisedetails">
			<span>{trip.date}</span>
			<span>{trip.duration}</span>
			<span>{trip.visibility}</span>
			<span>{trip.budget}</span>
		</div>
	</div>

	<div
		class="preview"
		class:hasImage={trip.previewUrl}
		style={`--preview-start: ${trip.colors[0]}; --preview-end: ${trip.colors[1]};`}
	>
		{#if trip.previewUrl}
			<img src={trip.previewUrl} alt={trip.previewAlt} />
		{:else}
			<div class="preview-sun"></div>
			<div class="preview-shape shape-one"></div>
			<div class="preview-shape shape-two"></div>
			<span>{trip.previewLabel}</span>
		{/if}
	</div>
</a>

<style>
	.travel-card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 240px;
		gap: 18px;
		height: 172px;
		min-height: 172px;
		padding: 18px;
		border: 1px solid rgba(65, 105, 190, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.78);
		box-shadow: 0 14px 38px rgba(51, 87, 158, 0.13);
		color: #14213d;
		text-decoration: none;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease,
			transform 150ms ease;
	}

	.travel-card:hover {
		border-color: rgba(47, 95, 200, 0.35);
		box-shadow: 0 20px 48px rgba(51, 87, 158, 0.2);
		transform: translateY(-2px);
	}

	.card-copy {
		display: flex;
		flex-direction: column;
		justify-content: start;
		gap: 10px;
		min-width: 0;
		min-height: 0;
	}

	.eyebrow {
		margin: 0 0 8px;
		color: #355aa2;
		font-size: 0.76rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	h2 {
		margin: 0;
		font-size: clamp(1.35rem, 3vw, 2rem);
		line-height: 1.08;
	}

	.description {
		max-width: 620px;
		margin: 0;
		color: #52617b;
		font-size: 0.95rem;
		line-height: 1.35;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.detail-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: auto;
	}

	.detail-row span {
		padding: 7px 10px;
		border: 1px solid rgba(65, 105, 190, 0.14);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
		color: #40516d;
		font-size: 0.82rem;
		font-weight: 800;
	}

	.preview {
		position: relative;
		min-height: 136px;
		overflow: hidden;
		border-radius: 8px;
		background: linear-gradient(135deg, var(--preview-start), var(--preview-end));
	}

	.preview img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.preview-sun {
		position: absolute;
		top: 18px;
		right: 22px;
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.84);
		box-shadow: 0 0 28px rgba(255, 255, 255, 0.62);
	}

	.preview-shape {
		position: absolute;
		right: -12px;
		left: -12px;
	}

	.shape-one {
		bottom: 34px;
		height: 74px;
		background: linear-gradient(135deg, transparent 0 18%, rgba(20, 33, 61, 0.55) 18% 54%, transparent 54%),
			linear-gradient(225deg, transparent 0 22%, rgba(20, 33, 61, 0.4) 22% 64%, transparent 64%);
	}

	.shape-two {
		bottom: 0;
		height: 58px;
		background: rgba(255, 255, 255, 0.28);
	}

	.preview span {
		position: absolute;
		right: 12px;
		bottom: 10px;
		max-width: calc(100% - 24px);
		padding: 6px 8px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.82);
		color: #14213d;
		font-size: 0.76rem;
		font-weight: 900;
	}

	@media (max-width: 760px) {
		.travel-card {
			grid-template-columns: 1fr;
		}

		.preview {
			aspect-ratio: 16 / 9;
			min-height: 0;
		}
	}
</style>
