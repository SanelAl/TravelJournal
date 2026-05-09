<script>
	let { trip } = $props();
</script>

<section class="comments-section" aria-labelledby="comments-title">
	<p class="eyebrow" id="comments-title">Kommentare</p>

	<div class="detail-card comments-panel">
		<div class="comment-list">
			{#each trip.comments as comment}
				<article class="comment">
					<div>
						<strong>{comment.author}</strong>
						<span>{comment.date}</span>
					</div>
					<p>{comment.text}</p>
					<button type="button" aria-label={`Kommentar von ${comment.author} loeschen`}>Loeschen</button>
				</article>
			{/each}
		</div>

		<form class="comment-form">
			<label for={`comment-${trip.id}`}>Neuer Kommentar</label>
			<textarea id={`comment-${trip.id}`} class="form-control" rows="2" placeholder="Kommentar schreiben"></textarea>
			<button type="button">Kommentar erfassen</button>
		</form>
	</div>
</section>

<style>
	.comments-section {
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

	.comments-panel {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		gap: 8px;
		height: 100%;
		min-height: 0;
		padding: 12px;
	}

	.eyebrow {
		margin: 0;
		color: #355aa2;
		font-size: 0.76rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	.comment-list {
		display: grid;
		align-content: start;
		gap: 7px;
		min-height: 0;
		overflow-y: auto;
		padding-right: 4px;
	}

	.comment {
		display: grid;
		gap: 5px;
		padding: 8px 10px;
		border: 0;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
	}

	.comment div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}

	.comment span,
	label {
		color: #52617b;
		font-size: 0.72rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	.comment p {
		margin: 0;
		color: #40516d;
		font-size: 0.9rem;
		line-height: 1.45;
	}

	.comment button {
		justify-self: start;
		min-height: 28px;
		padding: 0 8px;
		border: 1px solid rgba(180, 35, 24, 0.2);
		border-radius: 8px;
		background: rgba(180, 35, 24, 0.08);
		color: #b42318;
		font: inherit;
		font-size: 0.76rem;
		font-weight: 900;
	}

	.comment-form {
		display: grid;
		gap: 6px;
		padding-top: 4px;
		border-top: 1px solid rgba(65, 105, 190, 0.12);
	}

	.comment-form textarea {
		min-height: 62px;
		font-size: 0.9rem;
	}

	.comment-form button {
		justify-self: end;
		min-height: 34px;
		padding: 0 12px;
		border: 0;
		border-radius: 8px;
		background: #14213d;
		color: #ffffff;
		font: inherit;
		font-size: 0.86rem;
		font-weight: 900;
	}

	@media (max-width: 700px) {
		.comment div {
			align-items: flex-start;
			flex-direction: column;
			gap: 2px;
		}

		.comment-form button {
			width: 100%;
		}
	}
</style>
