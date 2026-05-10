<svelte:head>
	<title>TravelJournal | Login</title>
	<meta
		name="description"
		content="TravelJournal ist dein persoenliches Reisetagebuch fuer Orte, Erlebnisse, Fotos, Kommentare und Budgets."
	/>
</svelte:head>

<script>
	import logo from '$lib/assets/Logo.png';

	const highlights = [
		{
			title: 'Reisen ueberblicken',
			text: 'Sortiere deine Eintraege spaeter nach Datum, Kontinent und Sichtbarkeit.'
		},
		{
			title: 'Details pflegen',
			text: 'Aktivitaeten, Fotos, Kommentare, Kosten und Budget kompakt an einem Ort.'
		},
		{
			title: 'Reisen erfassen',
			text: 'Abgeschlossene Reisen werden Schritt fuer Schritt dokumentiert.'
		}
	];
</script>

<main class="page-shell container-xxl">
	<section class="hero" aria-labelledby="page-title">
		<div class="brand-block">
			<div class="hero-copy">
				<img class="hero-logo" src={logo} alt="TravelJournal" />
				<p class="eyebrow">Persoenliches Reisetagebuch</p>
				<h1 id="page-title">TravelJournal</h1>
				<p>
					Sammle Reiseorte, Daten, Aktivitaeten, Fotos, Kommentare und Budgets in einer
					uebersichtlichen Web-App mit SvelteKit und MongoDB.
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
				<h2 id="login-title">Willkommen zurueck</h2>
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
</main>

<style>
	:global(html),
	:global(body) {
		height: 100%;
		overflow: hidden;
	}

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
		display: grid;
		min-height: 100dvh;
		padding: 24px;
		place-items: center;
		overflow: hidden;
	}

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1.12fr) minmax(320px, 420px);
		gap: 28px;
		width: 100%;
		max-height: calc(100dvh - 48px);
		align-items: stretch;
	}

	.brand-block,
	.login-panel {
		border: 1px solid rgba(255, 255, 255, 0.86);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.78);
		box-shadow: 0 24px 70px rgba(51, 87, 158, 0.2);
		backdrop-filter: blur(18px);
	}

	.brand-block {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 28px;
		padding: 32px;
	}

	.hero-copy {
		max-width: 690px;
		margin: 0 auto;
		text-align: center;
	}

	.hero-logo {
		display: block;
		width: min(260px, 58vw);
		height: auto;
		margin: 0 auto 22px;
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
	p {
		margin-top: 0;
	}

	h1 {
		margin-bottom: 14px;
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
		font-size: 1.04rem;
		line-height: 1.55;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
	}

	.feature-grid article {
		min-height: 124px;
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
		font-size: 0.9rem;
		line-height: 1.45;
	}

	.login-panel {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 28px;
		padding: 34px;
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
		min-height: 50px;
		place-items: center;
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

	@media (max-width: 920px) {
		.page-shell {
			padding: 16px;
		}

		.hero {
			grid-template-columns: 1fr;
			max-height: calc(100dvh - 32px);
		}

		.brand-block,
		.login-panel {
			padding: 24px;
		}

		.feature-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 560px) {
		.hero {
			gap: 16px;
		}

		.brand-block,
		.login-panel {
			padding: 18px;
		}

		.hero-logo {
			width: min(210px, 56vw);
			margin-bottom: 16px;
		}

		h1 {
			font-size: 2.55rem;
		}
	}
</style>
