<script lang="ts">
	export let data: any;
	import {
		connected,
		chainId,
		selectedAccount,
		defaultEvmStores as evm,
		web3,
		//@ts-ignore
		contracts
	} from 'svelte-web3';
	import NumberInput from '$lib/components/reusables/NumberInput.svelte';
	import TextInput from '$lib/components/reusables/TextInput.svelte';
	import { combineDateTime, datetoUnix, minsToUnix } from '$lib/utils/timeUtils';
	import { onMount } from 'svelte/internal';

	import MockToken from '$lib/contracts/MockToken.json';
	import { openModal, closeModal, closeAllModals } from 'svelte-modals';
	import LoadingModal from '$lib/components/modals/LoadingModal.svelte';
	import { fromWei, toWei } from '$lib/utils/conversionUtils';
	import { currentAuction, NEW_AUCTION_CHANGES } from '$lib/stores/main';
	import { goto } from '$app/navigation';
	import { createSalt, hashCommitmentParams, theRandomNumber } from '$lib/utils/hexUtils';
	import InfoModal from '$lib/components/modals/InfoModal.svelte';
	import TextAreaInput from '$lib/components/reusables/TextAreaInput.svelte';
	import CurrencySelector from '$lib/components/reusables/CurrencySelector.svelte';
	import { errorToast, successToast } from '$lib/components/toast/toastTheme';

	let formState = {
		nftContractAddress: '',
		tokenId: `${data.tokenId}`
	};

	onMount(async () => {
		if (!$currentAuction) {
			goto('/explore');
		}

		if (
			$selectedAccount &&
			$currentAuction?.owner.toLowerCase() !== $selectedAccount?.toLowerCase()
		) {
			errorToast('You are not the owner of auction');
			goto('/explore');
		}
	});

	const settleAuction = async ({
		nftAddress,
		tokenId
	}: {
		nftAddress: string;
		tokenId: string;
	}) => {
		console.log(nftAddress, tokenId);

		try {
			const settleAuction = await $contracts.dauctionContract.methods
				.settleAuction(nftAddress, tokenId)
				.send({ from: $selectedAccount });
			console.log('settle Auction _______', settleAuction);

			closeModal();
			successToast('Auction Settled');
			currentAuction.set(null);
			NEW_AUCTION_CHANGES.set(true);
			goto('/explore');
		} catch (error: any) {
			console.log(error);
			const msg = error.message;
			closeModal();
			alert(msg.split('{')[0]);
			return;
		}
	};

	const onSubmit = () => {
		openModal(LoadingModal);
		let k: keyof typeof formState;
		for (k in formState) {
			const v = formState[k];
			if (!v) {
				errorToast(`${k} is required`);
				return;
			}
		}

		if ($selectedAccount?.toLowerCase() !== $currentAuction?.owner.toLowerCase()) {
			closeModal();
			alert('Bidder cannot settle auction');
			return;
		}

		settleAuction({
			nftAddress: formState.nftContractAddress,
			tokenId: formState.tokenId
		});
	};
</script>

<div class="reveal-bid">
	<h1 class="title">Settle Auction</h1>
	{#if $selectedAccount && $currentAuction?.owner.toLowerCase() === $selectedAccount?.toLowerCase()}
		<form on:submit|preventDefault={onSubmit} novalidate class="mb-auto">
			<TextInput
				label="NFT Contract Address"
				name="nftContractAddress"
				required={true}
				bind:value={formState.nftContractAddress}
			/>

			<div class="cta">
				<button type="submit" class="btn-primary submit">
					<span>Settle Auction</span>
				</button>
				<button type="button" class="btn-outline-primary" on:click={() => goto('/explore')}>
					<span>Go Back</span>
				</button>
			</div>
		</form>
	{:else}
		<h1>You Didnt Bid</h1>
	{/if}
</div>

<style>
	.reveal-bid {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		color: var(--white-background);
	}

	.reveal-bid .title {
		font-family: 'Darker Grotesque';
		font-weight: 500;
		font-size: 88px;
		line-height: 85%;
	}

	.reveal-bid form {
		width: 588px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	/* .reveal-bid form .collection {
	} */

	.reveal-bid form .collection span {
		font-weight: 500;
		font-size: 20px;
		padding: 16px;
	}
	.reveal-bid form .collection div {
		display: flex;
	}

	.reveal-bid form .cta {
		display: flex;
		width: 100%;
		justify-content: space-between;
		gap: 10px;
	}

	.reveal-bid form .cta button {
		width: 50%;
	}
</style>
