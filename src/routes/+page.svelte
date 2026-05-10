<svelte:head>
	<title>TravelJournal | Login</title>
	<meta
		name="description"
		content="TravelJournal ist dein persönliches Reisetagebuch für Orte, Erlebnisse, Fotos, Kommentare und Budgets."
	/>
</svelte:head>

<script>
	import logo from '$lib/assets/Logo.png';

	const highlights = [
		{
			title: 'Reisen überblicken',
			text: 'Sortiere deine Einträge später nach Datum, Kontinent und Sichtbarkeit.'
		},
		{
			title: 'Details pflegen',
			text: 'Aktivitäten, Fotos, Kommentare, Kosten und Budget kompakt an einem Ort.'
		},
		{
			title: 'Reisen erfassen',
			text: 'Abgeschlossene Reisen werden Schritt für Schritt dokumentiert.'
		}
	];

	const mockActivities = ['Streetfood Tour', 'Altstadt Spaziergang', 'Museum', 'Sonnenuntergang'];
</script>

<main class="page-shell container-xxl">
	<section class="hero" aria-labelledby="page-title">
		<div class="brand-block">
			<div class="hero-copy">
				<img class="hero-logo" src={logo} alt="TravelJournal" />
				<p class="eyebrow">Persönliches Reisetagebuch</p>
				<h1 id="page-title">TravelJournal</h1>
				<p>
					Sammle Reiseorte, Daten, Aktivitäten, Fotos, Kommentare und Budgets in einer
					übersichtlichen Web-App mit SvelteKit und MongoDB.
				</p>
			</div>

			<div class="feature-grid" aria-label="Geplante Kernseiten">
				{#each highlights as item}
					<article>
						<h2>{item.title}</h2>
						<p>{item.text}</p>
					</article>
				{/each}
			</div>
		</div>

		<div class="login-panel" aria-labelledby="login-title">
			<div>
				<p class="panel-kicker">Einloggen</p>
				<h2 id="login-title">Willkommen zurück</h2>
			</div>

			<form>
				<label>
					<span>E-Mail</span>
					<input type="email" name="email" autocomplete="email" placeholder="name@example.com" />
				</label>

				<label>
					<span>Passwort</span>
					<input type="password" name="password" autocomplete="current-password" placeholder="********" />
				</label>

				<a class="login-button" href="/trips">Einloggen</a>
			</form>

			<p class="register-note">
				Noch kein Konto? <a href="/">Registrieren</a>
			</p>
		</div>
	</section>

	<section class="preview-band" aria-label="Vorschau der Reise-Detailseite">
		<div class="journal-preview">
			<div class="photo-scene" aria-hidden="true">
				<div class="sun"></div>
				<div class="ridge ridge-one"></div>
				<div class="ridge ridge-two"></div>
				<div class="water"></div>
			</div>

			<div class="trip-summary">
				<div>
					<p class="panel-kicker">Beispielreise</p>
					<h2>Kyoto, Japan</h2>
				</div>
				<div class="meta-row">
					<span>12.04.2026</span>
					<span>9 Tage</span>
					<span>Asien</span>
					<span>Privat</span>
				</div>
			</div>

			<div class="quadrants" aria-label="Detailseiten-Quadranten">
				<section>
					<h3>Aktivitäten</h3>
					<ul>
						{#each mockActivities as activity}
							<li>{activity}</li>
						{/each}
					</ul>
				</section>

				<section>
					<h3>Fotos</h3>
					<div class="photo-grid" aria-hidden="true">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</section>

				<section>
					<h3>Kommentare</h3>
					<p>Der Tempelbesuch am Morgen war ruhig, später kam Regen.</p>
				</section>

				<section>
					<h3>Budget</h3>
					<div class="budget-line">
						<span>CHF 1'640</span>
						<small>von CHF 2'000</small>
					</div>
					<div class="progress"><span></span></div>
				</section>
			</div>
		</div>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family:
			Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		color: #14213d;
		background: linear-gradient(135deg, #8aafff 0%, #dbe7ff 42%, #ffffff 100%);
	}

	:global(*) {
		box-sizing: border-box;
	}

	.page-shell {
		min-height: 100vh;
		padding: 24px;
	}

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(320px, 420px);
		gap: 28px;
		min-height: 620px;
		align-items: stretch;
	}

	.brand-block,
	.login-panel,
	.journal-preview {
		background: rgba(255, 255, 255, 0.78);
		border: 1px solid rgba(255, 255, 255, 0.86);
		box-shadow: 0 24px 70px rgba(51, 87, 158, 0.2);
		backdrop-filter: blur(18px);
	}

	.brand-block {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 36px;
		padding: 32px;
		border-radius: 8px;
	}

	.hero-copy {
		max-width: 690px;
		text-align: center;
		margin: 0 auto;
	}

	.hero-logo {
		display: block;
		width: min(280px, 72vw);
		height: auto;
		margin: 0 auto 28px;
	}

	.eyebrow,
	.panel-kicker {
		margin: 0 0 10px;
		color: #355aa2;
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0;
		text-transform: uppercase;
	}

	h1,
	h2,
	h3,
	p {
		margin-top: 0;
	}

	h1 {
		margin-bottom: 16px;
		font-size: clamp(2.4rem, 6vw, 4.4rem);
		line-height: 1;
		letter-spacing: 0;
	}

	.hero-copy p:last-child {
		max-width: 560px;
		margin-right: auto;
		margin-bottom: 0;
		margin-left: auto;
		color: #33415c;
		font-size: 1.1rem;
		line-height: 1.7;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
	}

	.feature-grid article {
		min-height: 150px;
		padding: 18px;
		border: 1px solid rgba(65, 105, 190, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.64);
	}

	.feature-grid h2 {
		margin-bottom: 10px;
		font-size: 1rem;
	}

	.feature-grid p {
		margin-bottom: 0;
		color: #52617b;
		font-size: 0.94rem;
		line-height: 1.55;
	}

	.login-panel {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 28px;
		padding: 34px;
		border-radius: 8px;
	}

	.login-panel h2 {
		margin-bottom: 0;
		font-size: 2rem;
	}

	form {
		display: grid;
		gap: 18px;
	}

	label {
		display: grid;
		gap: 8px;
		color: #26344d;
		font-size: 0.9rem;
		font-weight: 700;
	}

	input {
		width: 100%;
		min-height: 48px;
		border: 1px solid rgba(36, 65, 122, 0.22);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.88);
		color: #14213d;
		font: inherit;
		font-weight: 500;
		padding: 0 14px;
		outline: none;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
	}

	input:focus {
		border-color: #4169be;
		box-shadow: 0 0 0 4px rgba(138, 175, 255, 0.3);
	}

	a {
		color: #2f5fc8;
		font-weight: 800;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	.login-button {
		display: grid;
		place-items: center;
		min-height: 50px;
		border: 0;
		border-radius: 8px;
		background: #14213d;
		color: #ffffff;
		cursor: pointer;
		font: inherit;
		font-weight: 800;
		box-shadow: 0 12px 28px rgba(20, 33, 61, 0.24);
		text-decoration: none;
	}

	.login-button:hover {
		background: #22345b;
		text-decoration: none;
	}

	.register-note {
		margin-bottom: 0;
		color: #52617b;
		text-align: center;
	}

	.preview-band {
		margin: 28px auto 0;
	}

	.journal-preview {
		display: grid;
		grid-template-columns: 0.85fr 1.15fr;
		gap: 22px;
		padding: 20px;
		border-radius: 8px;
	}

	.photo-scene {
		position: relative;
		min-height: 360px;
		overflow: hidden;
		border-radius: 8px;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0)),
			linear-gradient(155deg, #ffc857 0%, #f38d68 38%, #4169be 100%);
	}

	.sun {
		position: absolute;
		top: 42px;
		right: 48px;
		width: 86px;
		height: 86px;
		border-radius: 50%;
		background: #fff4b7;
		box-shadow: 0 0 48px rgba(255, 244, 183, 0.8);
	}

	.ridge,
	.water {
		position: absolute;
		right: 0;
		left: 0;
	}

	.ridge-one {
		bottom: 100px;
		height: 150px;
		background: linear-gradient(135deg, transparent 0 18%, #2c476d 18% 52%, transparent 52%),
			linear-gradient(225deg, transparent 0 24%, #203656 24% 62%, transparent 62%);
		opacity: 0.86;
	}

	.ridge-two {
		bottom: 64px;
		height: 120px;
		background: linear-gradient(135deg, transparent 0 24%, #6f8dd8 24% 58%, transparent 58%),
			linear-gradient(225deg, transparent 0 16%, #4e73d0 16% 55%, transparent 55%);
		opacity: 0.92;
	}

	.water {
		bottom: 0;
		height: 128px;
		background:
			repeating-linear-gradient(
				180deg,
				rgba(255, 255, 255, 0.32) 0 2px,
				rgba(255, 255, 255, 0) 2px 18px
			),
			linear-gradient(180deg, #7fb1f9, #385aa8);
	}

	.trip-summary {
		display: grid;
		gap: 14px;
		align-content: start;
	}

	.trip-summary h2 {
		margin-bottom: 0;
		font-size: 2.2rem;
	}

	.meta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.meta-row span {
		padding: 8px 10px;
		border: 1px solid rgba(65, 105, 190, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
		color: #40516d;
		font-size: 0.86rem;
		font-weight: 800;
	}

	.quadrants {
		display: grid;
		grid-column: 2;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}

	.quadrants section {
		min-height: 148px;
		padding: 16px;
		border: 1px solid rgba(65, 105, 190, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
	}

	.quadrants h3 {
		margin-bottom: 12px;
		font-size: 1rem;
	}

	.quadrants ul {
		display: grid;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.quadrants li,
	.quadrants p,
	.budget-line small {
		color: #52617b;
		font-size: 0.92rem;
		line-height: 1.45;
	}

	.quadrants p {
		margin-bottom: 0;
	}

	.photo-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}

	.photo-grid span {
		aspect-ratio: 1.45;
		border-radius: 6px;
		background: linear-gradient(135deg, #8aafff, #ffffff 52%, #f5c56b);
	}

	.budget-line {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		font-weight: 900;
	}

	.progress {
		height: 10px;
		margin-top: 18px;
		overflow: hidden;
		border-radius: 999px;
		background: #d8e3fb;
	}

	.progress span {
		display: block;
		width: 82%;
		height: 100%;
		background: #4169be;
	}

	@media (max-width: 920px) {
		.page-shell {
			padding: 16px;
		}

		.hero,
		.journal-preview {
			grid-template-columns: 1fr;
		}

		.brand-block,
		.login-panel {
			padding: 24px;
		}

		.feature-grid,
		.quadrants {
			grid-template-columns: 1fr;
		}

		.quadrants {
			grid-column: auto;
		}
	}

	@media (max-width: 560px) {
		.hero {
			gap: 16px;
		}

		.brand-block,
		.login-panel,
		.journal-preview {
			padding: 18px;
		}

		h1 {
			font-size: 2.55rem;
		}

		.photo-scene {
			min-height: 260px;
		}
	}
</style>
