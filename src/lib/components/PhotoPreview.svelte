<script>
	let { trip } = $props();
</script>

<section class="photo-section" aria-labelledby="photo-title">
	<p class="eyebrow" id="photo-title">Fotos</p>

	<div class="detail-card photo-panel">
		<div class="photo-grid">
			{#each trip.photos.slice(0, 3) as photo}
				<div
					class="photo-tile"
					style={`--photo-start: ${photo.colors[0]}; --photo-end: ${photo.colors[1]};`}
				>
					<span>{photo.label}</span>
				</div>
			{/each}

			<div class="photo-actions-tile">
				<button class="photo-action" type="button">
					<span>+</span>
					<strong>Fotos hinzufuegen</strong>
				</button>
				<a class="photo-action" href={`/trips/${trip.id}/photos`}>
					<span>↗</span>
					<strong>Alle Fotos ansehen</strong>
				</a>
			</div>
		</div>
	</div>
</section>

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

	.photo-tile::before,
	.photo-tile::after {
		position: absolute;
		right: -12%;
		left: -12%;
		content: '';
	}

	.photo-tile::before {
		bottom: 38px;
		height: 90px;
		background: linear-gradient(135deg, transparent 0 20%, rgba(20, 33, 61, 0.44) 20% 56%, transparent 56%),
			linear-gradient(225deg, transparent 0 22%, rgba(20, 33, 61, 0.32) 22% 64%, transparent 64%);
	}

	.photo-tile::after {
		bottom: 0;
		height: 58px;
		background: rgba(255, 255, 255, 0.28);
	}

	.photo-tile span {
		position: absolute;
		right: 14px;
		bottom: 14px;
		z-index: 1;
		padding: 7px 10px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.86);
		color: #14213d;
		font-size: 0.8rem;
		font-weight: 900;
	}

	.photo-actions-tile {
		display: grid;
		grid-template-rows: 1fr 1fr;
		gap: 8px;
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
