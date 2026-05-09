<script>
	import logo from '$lib/assets/Logo.png';
</script>

<nav class="app-nav" aria-label="Hauptnavigation">
	<a class="brand" href="/trips" aria-label="TravelJournal Uebersicht">
		<img class="brand-logo" src={logo} alt="" aria-hidden="true" />
		<span>TravelJournal</span>
	</a>

	<div class="nav-links">
		<a class="active" href="/trips">Reisen</a>
		<a href="/trips">Reise Planen</a>
		<a href="/trips">Social</a>
		<a href="/trips">Kalender</a>
	</div>

	<div class="nav-actions">
		<a class="new-trip-link" href="/trips/new">Neue Reise</a>

		<div class="dropdown">
			<button
				class="profile-button"
				type="button"
				data-bs-toggle="dropdown"
				aria-expanded="false"
				aria-label="Profilmenue"
			>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path
						d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
					/>
				</svg>
			</button>
			<ul class="dropdown-menu dropdown-menu-end">
				<li><a class="dropdown-item" href="/">Logout</a></li>
			</ul>
		</div>
	</div>
</nav>

<style>
	.app-nav {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 18px;
		min-height: 72px;
		padding: 0 28px;
		border-bottom: 1px solid rgba(65, 105, 190, 0.14);
		background: rgba(255, 255, 255, 0.78);
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

	.brand-logo {
		width: 42px;
		height: 42px;
		object-fit: cover;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-left: 16px;
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-left: auto;
	}

	.nav-links a,
	.new-trip-link {
		display: inline-flex;
		align-items: center;
		min-height: 40px;
		padding: 0 14px;
		border-radius: 8px;
		color: #33415c;
		font-size: 0.92rem;
		font-weight: 800;
		text-decoration: none;
	}

	.nav-links a:hover,
	.nav-links .active,
	.new-trip-link:hover {
		background: rgba(138, 175, 255, 0.22);
		color: #14213d;
	}

	.new-trip-link {
		background: #14213d;
		color: #ffffff;
	}

	.new-trip-link:hover {
		background: #22345b;
		color: #ffffff;
	}

	.profile-button {
		display: grid;
		width: 42px;
		height: 42px;
		place-items: center;
		border: 1px solid rgba(65, 105, 190, 0.18);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.74);
		color: #14213d;
		cursor: pointer;
	}

	.profile-button:hover,
	.profile-button:focus {
		background: rgba(138, 175, 255, 0.22);
	}

	.profile-button svg {
		width: 22px;
		height: 22px;
		fill: currentColor;
	}

	.dropdown-menu {
		border: 1px solid rgba(65, 105, 190, 0.14);
		border-radius: 8px;
		box-shadow: 0 16px 34px rgba(51, 87, 158, 0.16);
	}

	.dropdown-item {
		font-weight: 800;
	}

	@media (max-width: 620px) {
		.app-nav {
			align-items: flex-start;
			flex-direction: column;
			min-height: auto;
			padding: 16px;
		}

		.nav-links {
			width: 100%;
			margin-left: 0;
			overflow-x: auto;
		}

		.nav-links a {
			justify-content: center;
			white-space: nowrap;
		}

		.nav-actions {
			width: 100%;
			margin-left: 0;
		}

		.new-trip-link {
			flex: 1;
			justify-content: center;
		}
	}
</style>
