<script>
	let { trip, commentError = '' } = $props();
</script>

<section class="comments-section" aria-labelledby="comments-title">
	<p class="eyebrow" id="comments-title">Kommentare</p>

	<div class="detail-card comments-panel">
		<div class="comment-list">
			{#if trip.comments.length === 0}
				<p class="empty-note">Noch keine Kommentare erfasst.</p>
			{:else}
				{#each trip.comments as comment}
					<article class="comment">
						<div class="comment-body">
							<span>{comment.date}</span>
							<p>{comment.text}</p>
						</div>
						<form method="POST" action="?/deleteComment">
							<input type="hidden" name="commentId" value={comment.id} />
							<button type="submit" aria-label="Kommentar löschen">Löschen</button>
						</form>
					</article>
				{/each}
			{/if}
		</div>

		<form class="comment-form" method="POST" action="?/addComment">
			<label for={`comment-${trip.id}`}>Neuer Kommentar</label>
			<textarea
				id={`comment-${trip.id}`}
				class="form-control"
				name="commentText"
				rows="2"
				placeholder="Kommentar schreiben"
				aria-invalid={commentError ? 'true' : undefined}
			></textarea>
			{#if commentError}
				<p class="comment-error" role="alert">{commentError}</p>
			{/if}
			<button type="submit">Erfassen</button>
		</form>
	</div>
</section>

<style>
	.comments-section {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
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
		grid-template-rows: minmax(0, 1fr) auto;
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
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: start;
		gap: 8px;
		padding: 8px 10px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
	}

	.comment-body {
		display: grid;
		gap: 3px;
		min-width: 0;
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
		font-size: 0.88rem;
		line-height: 1.35;
	}

	.empty-note {
		margin: 0;
		padding: 12px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.72);
		color: #52617b;
		font-size: 0.9rem;
		font-weight: 800;
	}

	.comment button {
		min-height: 26px;
		padding: 0 8px;
		border: 1px solid rgba(180, 35, 24, 0.2);
		border-radius: 8px;
		background: rgba(180, 35, 24, 0.08);
		color: #b42318;
		font: inherit;
		font-size: 0.74rem;
		font-weight: 900;
	}

	.comment-form {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 6px 8px;
		padding-top: 8px;
		border-top: 1px solid rgba(65, 105, 190, 0.12);
	}

	.comment-form label,
	.comment-form textarea,
	.comment-error {
		grid-column: 1 / -1;
	}

	.comment-form textarea {
		min-height: 48px;
		font-size: 0.88rem;
		resize: vertical;
	}

	.comment-form textarea[aria-invalid='true'] {
		border-color: #b42318;
	}

	.comment-error {
		margin: 0;
		padding: 8px 10px;
		border: 1px solid rgba(180, 35, 24, 0.22);
		border-radius: 8px;
		background: rgba(180, 35, 24, 0.08);
		color: #b42318;
		font-size: 0.8rem;
		font-weight: 900;
	}

	.comment-form button {
		grid-column: 2;
		justify-self: end;
		min-height: 30px;
		padding: 0 10px;
		border: 0;
		border-radius: 8px;
		background: #14213d;
		color: #ffffff;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 900;
	}

	@media (max-width: 700px) {
		.comment {
			grid-template-columns: 1fr;
		}

		.comment-form {
			grid-template-columns: 1fr;
		}

		.comment-form button {
			grid-column: 1;
			width: 100%;
		}
	}
</style>
