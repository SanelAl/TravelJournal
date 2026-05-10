<script>
	let { trip } = $props();
</script>

<section class="schedule-section" aria-labelledby="schedule-title">
	<p class="eyebrow" id="schedule-title">Schedule</p>

	<div class="detail-card schedule-panel">
		<div class="schedule-lines">
			<div>
				<span>{trip.schedule.firstLabel}</span>
				<strong>{trip.schedule.firstValue}</strong>
			</div>

			<div>
				<span>Rückreise</span>
				<strong>{trip.schedule.returnValue}</strong>
			</div>
		</div>

		<div class="schedule-actions">
			<a href="/trips">Zum Kalender</a>
		</div>
	</div>
</section>

<style>
	.schedule-section {
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

	.schedule-panel {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 18px;
		min-height: 0;
		padding: 14px 16px;
	}

	.eyebrow {
		margin: 0;
		color: #355aa2;
		font-size: 0.76rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	a {
		color: #2f5fc8;
		font-size: 0.88rem;
		font-weight: 900;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	.schedule-lines {
		display: grid;
		align-content: center;
		gap: 10px;
		min-height: 0;
	}

	.schedule-lines div {
		display: flex;
		align-items: baseline;
		gap: 10px;
		min-width: 0;
	}

	.schedule-lines span {
		flex: 0 0 auto;
		color: #52617b;
		font-size: 0.78rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	.schedule-lines strong {
		min-width: 0;
		color: #14213d;
	}

	.schedule-actions {
		display: grid;
		align-items: center;
		justify-items: end;
		gap: 8px;
		flex: 0 0 auto;
	}

	@media (max-width: 640px) {
		.schedule-panel {
			grid-template-columns: 1fr;
		}

		.schedule-lines div {
			align-items: flex-start;
			flex-direction: column;
			gap: 2px;
		}

		.schedule-actions {
			justify-items: stretch;
		}

	}
</style>
