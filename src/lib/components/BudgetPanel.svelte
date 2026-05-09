<script>
	let { trip } = $props();

	const expenseCategories = [
		{ category: 'Transport', color: '#4169be' },
		{ category: 'Unterkunft', color: '#7c3aed' },
		{ category: 'Verpflegung', color: '#f28f3b' },
		{ category: 'Aktivitaeten', color: '#2f9c95' },
		{ category: 'Sonstiges', color: '#e56b6f' }
	];

	let modalId = $derived(`expense-modal-${trip.id}`);
	let showCosts = $state(false);

	function formatCurrency(value) {
		const amount = Number(value ?? 0);
		return `CHF ${amount.toLocaleString('de-CH')}`;
	}

	function totalSpent(expenses) {
		return expenses.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
	}

	function pieGradient(expenses, budgetTotal) {
		const total = Number(budgetTotal ?? 0);

		if (total <= 0) {
			return 'conic-gradient(#d7deea 0% 100%)';
		}

		let start = 0;
		const segments = expenses.map((item) => {
			const size = Math.min((Number(item.amount ?? 0) / total) * 100, 100 - start);
			const end = start + size;
			const segment = `${item.color} ${start}% ${end}%`;
			start = end;
			return segment;
		});

		segments.push(`#d7deea ${start}% 100%`);
		return `conic-gradient(${segments.join(', ')})`;
	}
</script>

<section class="budget-section" aria-labelledby="budget-title">
	<p class="eyebrow" id="budget-title">Budget</p>

	<div class="detail-card budget-panel">
		<div class="budget-content">
			<div class="budget-total">
				<span>{formatCurrency(totalSpent(trip.expenses))}</span>
				<small>von {formatCurrency(trip.budgetTotal)}</small>
			</div>

			<button class="show-costs-button" type="button" onclick={() => (showCosts = !showCosts)}>
				{showCosts ? 'Kosten ausblenden' : 'Alle Kosten anzeigen'}
			</button>

			<div class="expense-actions" aria-label="Kosten erfassen">
				{#each expenseCategories as expense}
					<button
						type="button"
						class="expense-button"
						style={`--expense-color: ${expense.color};`}
						data-bs-toggle="modal"
						data-bs-target={`#${modalId}`}
					>
						<span class="plus">+</span>
						<span>{expense.category}</span>
					</button>
				{/each}
			</div>

			{#if showCosts}
				<div class="cost-overview" aria-label="Erfasste Kosten">
					{#if trip.expenses.length === 0}
						<p class="empty-note">Noch keine Kosten erfasst.</p>
					{:else}
						{#each trip.expenses as expense}
							<article class="cost-row" style={`--expense-color: ${expense.color};`}>
								<div>
									<span>{expense.category}</span>
									<strong>{formatCurrency(expense.amount)}</strong>
								</div>
								<div class="cost-actions">
									<button type="button">Bearbeiten</button>
									<button type="button">Loeschen</button>
								</div>
							</article>
						{/each}
					{/if}
				</div>
			{/if}
		</div>

		<div class="pie-wrap" aria-label="Kostenverteilung">
			<div class="pie-chart" style={`--pie: ${pieGradient(trip.expenses, trip.budgetTotal)};`}>
				<div>
					<strong>{formatCurrency(trip.budgetTotal - totalSpent(trip.expenses))}</strong>
					<span>uebrig</span>
				</div>
			</div>
		</div>
	</div>
</section>

<div class="modal fade" id={modalId} tabindex="-1" aria-labelledby={`${modalId}-title`} aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h3 class="modal-title fs-5" id={`${modalId}-title`}>Kosten erfassen</h3>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schliessen"></button>
			</div>
			<div class="modal-body">
				<label class="form-label" for={`${modalId}-category`}>Kategorie</label>
				<select class="form-select mb-3" id={`${modalId}-category`}>
					{#each expenseCategories as expense}
						<option>{expense.category}</option>
					{/each}
				</select>

				<label class="form-label" for={`${modalId}-amount`}>Betrag</label>
				<input class="form-control mb-3" id={`${modalId}-amount`} type="number" placeholder="0.00" />

				<label class="form-label" for={`${modalId}-note`}>Notiz</label>
				<textarea class="form-control" id={`${modalId}-note`} rows="3" placeholder="Kurze Beschreibung"></textarea>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Abbrechen</button>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Kosten hinzufuegen</button>
			</div>
		</div>
	</div>
</div>

<style>
	.budget-section {
		display: grid;
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

	.budget-panel {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(110px, 0.24fr);
		gap: clamp(10px, 1.4vw, 16px);
		height: 100%;
		min-height: 0;
		overflow: hidden;
		padding: clamp(10px, 1.3vw, 16px);
	}

	.budget-content {
		display: grid;
		grid-template-rows: auto auto auto minmax(0, 1fr);
		gap: 10px;
		min-width: 0;
		min-height: 0;
	}

	.eyebrow {
		margin: 0;
		color: #355aa2;
		font-size: 0.76rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	.budget-total {
		display: flex;
		align-items: baseline;
		gap: 7px;
		font-weight: 900;
		white-space: nowrap;
	}

	.budget-total small {
		color: #52617b;
	}

	.show-costs-button {
		justify-self: start;
		min-height: 32px;
		padding: 0 10px;
		border: 1px solid rgba(65, 105, 190, 0.2);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.66);
		color: #2f5fc8;
		font: inherit;
		font-size: 0.82rem;
		font-weight: 900;
	}

	.expense-actions {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: clamp(5px, 0.8vw, 8px);
		min-height: 0;
	}

	.expense-button {
		display: grid;
		gap: clamp(3px, 0.6vw, 6px);
		justify-items: center;
		min-width: 0;
		min-height: 0;
		padding: clamp(5px, 0.8vw, 9px) 5px;
		border: 1px solid color-mix(in srgb, var(--expense-color), white 55%);
		border-radius: 8px;
		background: color-mix(in srgb, var(--expense-color), white 84%);
		color: #14213d;
		font: inherit;
		font-size: clamp(0.66rem, 0.75vw, 0.78rem);
		font-weight: 900;
		overflow: hidden;
	}

	.cost-overview {
		display: grid;
		align-content: start;
		gap: 6px;
		min-height: 0;
		max-height: 150px;
		overflow-y: auto;
		padding-right: 4px;
	}

	.cost-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 7px 9px;
		border-left: 4px solid var(--expense-color);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.68);
	}

	.cost-row > div:first-child {
		display: flex;
		align-items: baseline;
		gap: 8px;
		min-width: 0;
	}

	.cost-row span {
		color: #52617b;
		font-size: 0.76rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	.cost-row strong {
		color: #14213d;
		font-size: 0.88rem;
	}

	.empty-note {
		margin: 0;
		padding: 9px 10px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.68);
		color: #52617b;
		font-size: 0.86rem;
		font-weight: 800;
	}

	.cost-actions {
		display: flex;
		align-items: center;
		gap: 6px;
		flex: 0 0 auto;
	}

	.cost-actions button {
		min-height: 26px;
		padding: 0 8px;
		border: 1px solid rgba(65, 105, 190, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
		color: #40516d;
		font: inherit;
		font-size: 0.74rem;
		font-weight: 900;
	}

	.cost-actions button:last-child {
		border-color: rgba(180, 35, 24, 0.2);
		color: #b42318;
	}

	.plus {
		display: grid;
		width: clamp(22px, 2.4vw, 30px);
		height: clamp(22px, 2.4vw, 30px);
		place-items: center;
		border-radius: 50%;
		background: var(--expense-color);
		color: #ffffff;
		font-size: clamp(1rem, 1.8vw, 1.35rem);
		line-height: 1;
	}

	.pie-wrap {
		display: grid;
		place-items: center;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
	}

	.pie-chart {
		display: grid;
		width: min(100%, 145px, 24vh);
		aspect-ratio: 1;
		place-items: center;
		border-radius: 50%;
		background: var(--pie);
		box-shadow: inset 0 0 0 1px rgba(20, 33, 61, 0.08);
	}

	.pie-chart > div {
		display: grid;
		width: 56%;
		aspect-ratio: 1;
		place-items: center;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.92);
		text-align: center;
	}

	.pie-chart strong {
		font-size: clamp(0.62rem, 0.85vw, 0.9rem);
	}

	.pie-chart span {
		color: #52617b;
		font-size: clamp(0.58rem, 0.72vw, 0.76rem);
		font-weight: 900;
	}

	:global(.btn-primary) {
		--bs-btn-bg: #14213d;
		--bs-btn-border-color: #14213d;
		--bs-btn-hover-bg: #22345b;
		--bs-btn-hover-border-color: #22345b;
	}

	@media (max-width: 1020px) {
		.budget-panel {
			grid-template-columns: 1fr;
			overflow: visible;
		}
	}

	@media (max-width: 760px) {
		.expense-actions {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.cost-row,
		.cost-row > div:first-child,
		.cost-actions {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
