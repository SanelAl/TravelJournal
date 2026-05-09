<footer class="app-footer">
	<span>TravelJournal Prototyp</span>
	<span>SvelteKit + MongoDB Vorbereitung</span>
</footer>

<style>
	.app-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		min-height: 48px;
		padding: 0 28px;
		border-top: 1px solid rgba(65, 105, 190, 0.14);
		background: rgba(255, 255, 255, 0.68);
		color: #52617b;
		font-size: 0.82rem;
		font-weight: 700;
	}

	@media (max-width: 620px) {
		.app-footer {
			align-items: flex-start;
			flex-direction: column;
			gap: 4px;
			min-height: auto;
			padding: 12px 16px;
		}
	}
</style>
