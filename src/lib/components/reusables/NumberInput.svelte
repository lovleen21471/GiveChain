<script lang="ts">
	import { svgPath } from '$lib/utils/fileUtils';

	export let name: string;
	export let label: string;
	export let required = false;
	export let value: number;
	export let info = '';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	const onBlur = (e: any) => {
		dispatch('blur', e.target.value);
	};
</script>

<fieldset>
	{#if label}
		<label for="tokenID">
			{label}
			{#if required}
				<span>*</span>
			{/if}
		</label>
	{/if}
	<input type="number" {name} {required} bind:value on:blur={onBlur} />
	{#if info}
		<p>
			<img src={svgPath('info')} alt="" width="15" />
			<span>{info}</span>
		</p>
	{/if}
</fieldset>

<style>
	fieldset {
		display: flex;
		flex-direction: column;
		border: none;
		gap: 8px;
		width: 100%;
	}

	fieldset label {
		display: flex;
		gap: 4px;
		border: none;
		font-weight: 500;
		font-size: 20px;
	}

	fieldset label span {
		color: #f15b5b;
	}

	fieldset input {
		background-color: #131b2e;
		border-radius: 4px;
		padding: 16px;
		color: #fff;
		font-weight: 400;
		font-size: 20px;
		width: 100%;
		border: 1px solid #595c64;
		border-radius: 8px;
	}

	fieldset input:focus {
		outline: none;
	}

	fieldset p {
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	fieldset img {
		display: inline;
	}

	fieldset span {
		display: block;
		margin-top: -3px;
	}
</style>
