<svelte:head>
	<title>TravelJournal | Social</title>
	<meta name="description" content="Durchstoebere oeffentliche Reisen anderer TravelJournal User." />
</svelte:head>

<script>
	import TravelCard from '$lib/components/TravelCard.svelte';

	let { data } = $props();

	let isFollowingTab = $derived(data.filters.tab === 'following');
</script>

<section class="social-page" aria-labelledby="social-title">
	<div class="social-container container-xxl">
		<header class="social-header">
			<div>
				<p class="eyebrow">Social</p>
				<h1 id="social-title">{isFollowingTab ? 'Following' : 'Durchstoebern'}</h1>
				<p>
					{isFollowingTab
						? 'Oeffentliche Reisen von Usern, denen du folgst.'
						: 'Entdecke oeffentliche Reisen anderer User und finde Inspiration fuer deine naechsten Erinnerungen.'}
				</p>
			</div>

			<div class="header-actions">
				<div class="tabs" aria-label="Social Bereiche">
					<a class:active={!isFollowingTab} href="/social">Durchstoebern</a>
					<a class:active={isFollowingTab} href="/social?tab=following">Following</a>
				</div>

				<form class="controls" method="GET" aria-label="Social Filter">
					{#if isFollowingTab}
						<input type="hidden" name="tab" value="following" />
					{/if}

					<label>
						<span>Sortieren</span>
						<select name="sort">
							<option value="newest" selected={data.filters.sort === 'newest'}>Neueste zuerst</option>
							<option value="oldest" selected={data.filters.sort === 'oldest'}>Aelteste zuerst</option>
						</select>
					</label>

					<label>
						<span>Kontinent</span>
						<select name="continent">
							<option value="all" selected={data.filters.continent === 'all'}>Alle</option>
							{#each data.continents as continent}
								<option value={continent} selected={data.filters.continent === continent}>{continent}</option>
							{/each}
						</select>
					</label>

					<label class="user-filter">
						<span>User</span>
						<input name="user" type="search" value={data.filters.user} placeholder="Anzeigename suchen" />
					</label>

					<button class="filter-button" type="submit">Anwenden</button>
				</form>
			</div>
		</header>

		<div class="travel-list" aria-label="Oeffentliche Reisen">
			{#if data.loadError}
				<div class="empty-state" role="alert">
					<h2>Keine Verbindung</h2>
					<p>{data.loadError}</p>
				</div>
			{:else if data.trips.length === 0}
				<div class="empty-state">
					<h2>Keine Reisen gefunden</h2>
					<p>
						{isFollowingTab
							? 'Du folgst noch keinen Usern mit passenden oeffentlichen Reisen.'
							: 'Es gibt noch keine passenden oeffentlichen Reisen von anderen Usern.'}
					</p>
				</div>
			{:else}
				{#each data.trips as trip}
					<TravelCard {trip} />
				{/each}
			{/if}
		</div>
	</div>
</section>

<style>
	.social-page {
		min-height: 100%;
		padding: 24px 28px;
	}

	.social-container {
		display: grid;
		gap: 20px;
		min-height: 0;
	}

	.social-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
		padding: 24px;
		border: 1px solid rgba(255, 255, 255, 0.86);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
		box-shadow: 0 18px 52px rgba(51, 87, 158, 0.16);
		backdrop-filter: blur(18px);
	}

	.eyebrow {
		margin: 0 0 8px;
		color: #355aa2;
		font-size: 0.78rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	h1 {
		margin: 0 0 10px;
		font-size: clamp(2rem, 4vw, 3.3rem);
		line-height: 1;
	}

	.social-header p:last-child {
		max-width: 560px;
		margin: 0;
		color: #52617b;
		line-height: 1.55;
	}

	.header-actions {
		display: grid;
		justify-items: end;
		gap: 14px;
		flex: 0 0 auto;
	}

	.tabs,
	.controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 10px;
	}

	.tabs a {
		display: inline-flex;
		align-items: center;
		min-height: 38px;
		padding: 0 14px;
		border: 1px solid rgba(65, 105, 190, 0.18);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.7);
		color: #40516d;
		font-weight: 900;
		text-decoration: none;
	}

	.tabs .active {
		background: #14213d;
		color: #ffffff;
	}

	label {
		display: grid;
		gap: 6px;
		color: #52617b;
		font-size: 0.78rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	select,
	input {
		min-width: 152px;
		min-height: 40px;
		border: 1px solid rgba(65, 105, 190, 0.2);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.9);
		color: #14213d;
		font: inherit;
		font-size: 0.9rem;
		font-weight: 800;
		padding: 0 12px;
	}

	.user-filter input {
		min-width: 210px;
	}

	.filter-button {
		align-self: end;
		min-height: 40px;
		padding: 0 14px;
		border: 1px solid rgba(65, 105, 190, 0.24);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.9);
		color: #14213d;
		font-weight: 900;
	}

	.filter-button:hover {
		background: rgba(138, 175, 255, 0.18);
	}

	.travel-list {
		display: grid;
		align-content: start;
		grid-auto-rows: 172px;
		gap: 14px;
		min-height: 0;
		padding-right: 8px;
	}

	.empty-state {
		display: grid;
		place-items: center;
		align-content: center;
		gap: 10px;
		min-height: 260px;
		padding: 28px;
		border: 1px dashed rgba(65, 105, 190, 0.32);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.68);
		color: #52617b;
		text-align: center;
	}

	.empty-state h2 {
		margin: 0;
		color: #14213d;
		font-size: 1.4rem;
	}

	.empty-state p {
		margin: 0;
	}

	@media (max-width: 880px) {
		.social-page {
			padding: 16px;
		}

		.social-header {
			align-items: stretch;
			flex-direction: column;
		}

		.header-actions,
		.controls,
		.tabs {
			justify-items: stretch;
			justify-content: stretch;
		}

		.controls,
		.tabs,
		label,
		select,
		input,
		.user-filter input {
			width: 100%;
		}
	}
</style>
