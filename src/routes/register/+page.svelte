<svelte:head>
	<title>TravelJournal | Registrieren</title>
	<meta name="description" content="Erstelle dein TravelJournal Konto." />
</svelte:head>

<script>
	import logo from '$lib/assets/Logo.png';

	let { form } = $props();
</script>

<main class="register-page container-xxl">
	<section class="register-panel" aria-labelledby="register-title">
		<a class="brand" href="/">
			<img src={logo} alt="TravelJournal" />
			<span>TravelJournal</span>
		</a>

		<div>
			<p class="eyebrow">Registrieren</p>
			<h1 id="register-title">Konto erstellen</h1>
		</div>

		<form method="POST">
			{#if form?.errors?.form}
				<div class="form-alert" role="alert">{form.errors.form}</div>
			{/if}

			<label>
				<span>E-Mail</span>
				<input
					name="email"
					type="email"
					autocomplete="email"
					value={form?.values?.email ?? ''}
					placeholder="name@example.com"
					aria-invalid={form?.errors?.email ? 'true' : undefined}
				/>
				{#if form?.errors?.email}
					<small>{form.errors.email}</small>
				{/if}
			</label>

			<label>
				<span>Anzeigename</span>
				<input
					name="displayName"
					type="text"
					autocomplete="name"
					value={form?.values?.displayName ?? ''}
					placeholder="Dein Name"
					aria-invalid={form?.errors?.displayName ? 'true' : undefined}
				/>
				{#if form?.errors?.displayName}
					<small>{form.errors.displayName}</small>
				{/if}
			</label>

			<label>
				<span>Passwort</span>
				<input
					name="password"
					type="password"
					autocomplete="new-password"
					placeholder="Mindestens 6 Zeichen"
					aria-invalid={form?.errors?.password ? 'true' : undefined}
				/>
				{#if form?.errors?.password}
					<small>{form.errors.password}</small>
				{/if}
			</label>

			<label>
				<span>Passwort bestaetigen</span>
				<input
					name="passwordConfirm"
					type="password"
					autocomplete="new-password"
					placeholder="Passwort wiederholen"
					aria-invalid={form?.errors?.passwordConfirm ? 'true' : undefined}
				/>
				{#if form?.errors?.passwordConfirm}
					<small>{form.errors.passwordConfirm}</small>
				{/if}
			</label>

			<button type="submit">Konto erstellen</button>
		</form>

		<p class="login-note">Schon registriert? <a href="/">Einloggen</a></p>
	</section>
</main>

<style>
	:global(html),
	:global(body) {
		height: 100%;
		overflow: hidden;
	}

	.register-page {
		display: grid;
		min-height: 100dvh;
		padding: 24px;
		place-items: center;
	}

	.register-panel {
		display: grid;
		gap: 24px;
		width: min(460px, 100%);
		padding: 34px;
		border: 1px solid rgba(255, 255, 255, 0.86);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.78);
		box-shadow: 0 24px 70px rgba(51, 87, 158, 0.2);
		backdrop-filter: blur(18px);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		color: #14213d;
		font-weight: 900;
		text-decoration: none;
	}

	.brand img {
		width: 46px;
		height: 46px;
		object-fit: cover;
	}

	.eyebrow {
		margin: 0 0 10px;
		color: #355aa2;
		font-size: 0.78rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 5vw, 3rem);
		line-height: 1;
	}

	form {
		display: grid;
		gap: 16px;
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
		min-height: 46px;
		border: 1px solid rgba(36, 65, 122, 0.22);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.88);
		color: #14213d;
		font: inherit;
		font-weight: 500;
		padding: 0 14px;
		outline: none;
	}

	input:focus {
		border-color: #4169be;
		box-shadow: 0 0 0 4px rgba(138, 175, 255, 0.3);
	}

	input[aria-invalid='true'] {
		border-color: #b42318;
	}

	small {
		color: #b42318;
		font-size: 0.82rem;
		font-weight: 800;
	}

	.form-alert {
		padding: 10px 12px;
		border: 1px solid rgba(180, 35, 24, 0.22);
		border-radius: 8px;
		background: rgba(180, 35, 24, 0.08);
		color: #b42318;
		font-weight: 800;
	}

	button {
		min-height: 48px;
		border: 0;
		border-radius: 8px;
		background: #14213d;
		color: #ffffff;
		font: inherit;
		font-weight: 900;
		box-shadow: 0 12px 28px rgba(20, 33, 61, 0.24);
	}

	button:hover {
		background: #22345b;
	}

	a {
		color: #2f5fc8;
		font-weight: 800;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	.login-note {
		margin: 0;
		color: #52617b;
		text-align: center;
	}
</style>
