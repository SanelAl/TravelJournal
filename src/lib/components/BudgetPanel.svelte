<script>
	let { trip, expenseError = '', readonly = false } = $props();

	const expenseCategories = [
		{ category: 'Transport', color: '#4169be', icon: 'tram' },
		{ category: 'Unterkunft', color: '#7c3aed', icon: 'bed' },
		{ category: 'Verpflegung', color: '#f28f3b', icon: 'fork' },
		{ category: 'Aktivitäten', color: '#2f9c95', icon: 'map' },
		{ category: 'Sonstiges', color: '#e56b6f', icon: 'dots' }
	];

	let createModalId = $derived(`expense-create-${trip.id}`);
	let listModalId = $derived(`expense-list-${trip.id}`);
	let editModalId = $derived(`expense-edit-${trip.id}`);
	let selectedExpense = $state(null);

	$effect(() => {
		selectedExpense = trip.expenses[0] ?? null;
	});

	function formatCurrency(value) {
		const amount = Number(value ?? 0);
		return `CHF ${amount.toLocaleString('de-CH')}`;
	}

	function totalSpent(expenses) {
		return expenses.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
	}

	function totalForCategory(category) {
		return totalSpent(trip.expenses.filter((item) => item.category === category));
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

			{#if !readonly}
				<div class="budget-actions">
					<button class="cost-button" type="button" data-bs-toggle="modal" data-bs-target={`#${createModalId}`}>
						Kosten erfassen
					</button>
					<button class="cost-button" type="button" data-bs-toggle="modal" data-bs-target={`#${listModalId}`}>
						Alle Kosten anzeigen
					</button>
				</div>
			{/if}

			{#if expenseError}
				<p class="expense-error" role="alert">{expenseError}</p>
			{/if}

			<div class="expense-actions" aria-label="Kosten nach Kategorie">
				{#each expenseCategories as expense}
					<div class="expense-tile" style={`--expense-color: ${expense.color};`}>
						<span class="category-icon" aria-hidden="true" data-icon={expense.icon}></span>
						<strong>{expense.category}</strong>
						<small>{formatCurrency(totalForCategory(expense.category))}</small>
					</div>
				{/each}
			</div>
		</div>

		<div class="pie-wrap" aria-label="Kostenverteilung">
			<div class="pie-chart" style={`--pie: ${pieGradient(trip.expenses, trip.budgetTotal)};`}>
				<div>
					<strong>{formatCurrency(trip.budgetTotal - totalSpent(trip.expenses))}</strong>
					<span>übrig</span>
				</div>
			</div>
		</div>
	</div>
</section>

{#if !readonly}
<div class="modal fade" id={createModalId} tabindex="-1" aria-labelledby={`${createModalId}-title`} aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<form class="modal-content" method="POST" action="?/addExpense">
			<div class="modal-header">
				<h3 class="modal-title fs-5" id={`${createModalId}-title`}>Kosten erfassen</h3>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schliessen"></button>
			</div>
			<div class="modal-body">
				<label class="form-label" for={`${createModalId}-category`}>Kategorie</label>
				<select class="form-select mb-3" id={`${createModalId}-category`} name="expenseCategory" required>
					{#each expenseCategories as expense}
						<option value={expense.category}>{expense.category}</option>
					{/each}
				</select>

				<label class="form-label" for={`${createModalId}-amount`}>Betrag</label>
				<input
					class="form-control mb-3"
					id={`${createModalId}-amount`}
					name="expenseAmount"
					type="number"
					min="0"
					step="0.01"
					placeholder="0.00"
					required
				/>

				<label class="form-label" for={`${createModalId}-description`}>Beschreibung</label>
				<textarea
					class="form-control"
					id={`${createModalId}-description`}
					name="expenseDescription"
					rows="3"
					placeholder="Kurze Beschreibung"
				></textarea>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Abbrechen</button>
				<button type="submit" class="btn btn-primary">Kosten hinzufügen</button>
			</div>
		</form>
	</div>
</div>

<div class="modal fade" id={listModalId} tabindex="-1" aria-labelledby={`${listModalId}-title`} aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h3 class="modal-title fs-5" id={`${listModalId}-title`}>Alle Kosten</h3>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schliessen"></button>
			</div>
			<div class="modal-body">
				<div class="cost-overview" aria-label="Erfasste Kosten">
					{#if trip.expenses.length === 0}
						<p class="empty-note">Noch keine Kosten erfasst.</p>
					{:else}
						{#each trip.expenses as expense}
							<article class="cost-row" style={`--expense-color: ${expense.color};`}>
								<div>
									<span>{expense.category}</span>
									<strong>{formatCurrency(expense.amount)}</strong>
									<p>{expense.description || 'Keine Beschreibung erfasst.'}</p>
								</div>
								<button
									type="button"
									data-bs-toggle="modal"
									data-bs-target={`#${editModalId}`}
									onclick={() => (selectedExpense = expense)}
								>
									Bearbeiten
								</button>
							</article>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id={editModalId} tabindex="-1" aria-labelledby={`${editModalId}-title`} aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<form class="modal-content" method="POST" action="?/updateExpense">
			<input type="hidden" name="expenseId" value={selectedExpense?.id ?? ''} />

			<div class="modal-header">
				<h3 class="modal-title fs-5" id={`${editModalId}-title`}>Kosten bearbeiten</h3>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schliessen"></button>
			</div>
			<div class="modal-body">
				<label class="form-label" for={`${editModalId}-category`}>Kategorie</label>
				<select class="form-select mb-3" id={`${editModalId}-category`} name="expenseCategory" required>
					{#each expenseCategories as expense}
						<option value={expense.category} selected={selectedExpense?.category === expense.category}>
							{expense.category}
						</option>
					{/each}
				</select>

				<label class="form-label" for={`${editModalId}-amount`}>Betrag</label>
				<input
					class="form-control mb-3"
					id={`${editModalId}-amount`}
					name="expenseAmount"
					type="number"
					min="0"
					step="0.01"
					value={selectedExpense?.amount ?? 0}
					required
				/>

				<label class="form-label" for={`${editModalId}-description`}>Beschreibung</label>
				<textarea
					class="form-control"
					id={`${editModalId}-description`}
					name="expenseDescription"
					rows="3"
					value={selectedExpense?.description ?? ''}
				></textarea>
			</div>
			<div class="modal-footer">
				<button type="submit" class="btn btn-outline-danger" formaction="?/deleteExpense">Kosten löschen</button>
				<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Abbrechen</button>
				<button type="submit" class="btn btn-primary">Speichern</button>
			</div>
		</form>
	</div>
</div>
{/if}

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

	.budget-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.cost-button {
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

	.expense-error {
		margin: 0;
		padding: 9px 10px;
		border: 1px solid rgba(180, 35, 24, 0.22);
		border-radius: 8px;
		background: rgba(180, 35, 24, 0.08);
		color: #b42318;
		font-size: 0.84rem;
		font-weight: 900;
	}

	.expense-actions {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: clamp(5px, 0.8vw, 8px);
		min-height: 0;
	}

	.expense-tile {
		display: grid;
		align-content: center;
		gap: 5px;
		justify-items: center;
		min-width: 0;
		min-height: 78px;
		padding: 8px 6px;
		border: 1px solid color-mix(in srgb, var(--expense-color), white 55%);
		border-radius: 8px;
		background: color-mix(in srgb, var(--expense-color), white 84%);
		color: #14213d;
		text-align: center;
	}

	.expense-tile strong {
		font-size: clamp(0.72rem, 0.85vw, 0.82rem);
		font-weight: 900;
	}

	.expense-tile small {
		color: #40516d;
		font-size: 0.72rem;
		font-weight: 900;
	}

	.category-icon {
		position: relative;
		display: grid;
		width: 30px;
		height: 30px;
		place-items: center;
		border-radius: 50%;
		background: var(--expense-color);
		color: #ffffff;
	}

	.category-icon::before {
		font-size: 1rem;
		font-weight: 900;
		line-height: 1;
	}

	.category-icon[data-icon='tram']::before {
		content: 'T';
	}

	.category-icon[data-icon='bed']::before {
		content: 'B';
	}

	.category-icon[data-icon='fork']::before {
		content: 'F';
	}

	.category-icon[data-icon='map']::before {
		content: 'M';
	}

	.category-icon[data-icon='dots']::before {
		content: '...';
	}

	.cost-overview {
		display: grid;
		align-content: start;
		gap: 8px;
		max-height: 440px;
		overflow-y: auto;
		padding-right: 4px;
	}

	.cost-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 12px;
		padding: 10px 12px;
		border-left: 4px solid var(--expense-color);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.68);
	}

	.cost-row > div {
		display: grid;
		gap: 3px;
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
		font-size: 0.95rem;
	}

	.cost-row p {
		margin: 0;
		color: #40516d;
		font-size: 0.86rem;
		line-height: 1.35;
	}

	.cost-row button {
		min-height: 32px;
		padding: 0 10px;
		border: 1px solid rgba(65, 105, 190, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
		color: #40516d;
		font: inherit;
		font-size: 0.78rem;
		font-weight: 900;
	}

	.empty-note {
		margin: 0;
		padding: 10px 12px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.68);
		color: #52617b;
		font-size: 0.9rem;
		font-weight: 800;
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

		.cost-row {
			align-items: stretch;
			grid-template-columns: 1fr;
		}
	}
</style>
