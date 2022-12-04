<script lang="ts">
	import { closeModal } from 'svelte-modals';

	// provided by <Modals />
	export let isOpen: boolean;
	export let infoTitle = '';
	export let infoText = '';
</script>

{#if isOpen}
	<div role="dialog" class="modal">
		<div class="contents">
			<div class="contents-1">
				<h2>{infoTitle}</h2>
				<p>{infoText}</p>
				<div class="actions">
					<button on:click={closeModal}>OK</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;

		/* allow click-through to backdrop */
		pointer-events: none;
	}

	.contents {
		min-width: 240px;
		border-radius: 6px;
		padding: 1px;
		background: white;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		pointer-events: auto;
	}

	.contents-1 {
		width: 100%;
		background-color: var(--dark-background);
		color: var(--primary);
		padding: 16px;
	}

	h2 {
		text-align: center;
		font-size: 24px;
	}

	p {
		text-align: center;
		margin-top: 16px;
		font-size: 24px;
		font-weight: 500;
	}

	.actions {
		margin-top: 32px;
		display: flex;
		justify-content: flex-end;
	}
</style>
