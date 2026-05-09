<script>
	let { trip } = $props();
</script>

<header class="trip-header">
	<div>
		<h1>{trip.place} {trip.year}</h1>
		<p>{trip.description}</p>
	</div>

	<div class="header-actions">
		<span class:active={trip.isActive} class="status-badge">
			{trip.isActive ? 'Aktiv' : 'Abgeschlossen'}
		</span>

		<span class:active={trip.isPublic} class="status-badge">
			{trip.isPublic ? 'Oeffentlich' : 'Privat'}
		</span>

		<a class="edit-link" href={`/trips/${trip.id}/edit`}>Reise bearbeiten</a>
	</div>
</header>

<style>
	.trip-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
		padding: 2px 2px 0;
	}

	h1 {
		margin: 0 0 6px;
		font-size: clamp(1.75rem, 3vw, 2.6rem);
		line-height: 1;
	}

	p {
		max-width: 640px;
		margin: 0;
		color: #52617b;
		font-size: 0.94rem;
		line-height: 1.55;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 14px;
		flex: 0 0 auto;
	}

	.status-badge,
	.edit-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 42px;
		padding: 0 14px;
		border: 1px solid rgba(65, 105, 190, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
		color: #40516d;
		font: inherit;
		font-size: 0.86rem;
		font-weight: 900;
		text-decoration: none;
	}

	.status-badge.active {
		background-color: #4169be;
		border-color: #4169be;
		color: #ffffff;
	}

	.edit-link {
		border: 0;
		background: #14213d;
		color: #ffffff;
	}

	@media (max-width: 860px) {
		.trip-header {
			align-items: stretch;
			flex-direction: column;
		}

		.header-actions {
			align-items: stretch;
			flex-wrap: wrap;
		}

		.status-badge,
		.edit-link {
			justify-content: center;
			flex: 1;
		}
	}
</style>
