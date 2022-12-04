<script lang="ts">
	export let data;
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
	import TimeInput from '$lib/components/reusables/TimeInput.svelte';
	import DateInput from '$lib/components/reusables/DateInput.svelte';
	import CurrencySelector from '$lib/components/reusables/CurrencySelector.svelte';
	import { ethers } from 'ethers';
	import { CURRENCIES_ON_MUMBAI } from '$lib/utils/constants';
	import { combineDateTime, datetoUnix, minsToUnix } from '$lib/utils/timeUtils';
	import { onMount } from 'svelte/internal';

	import { openModal, closeModal } from 'svelte-modals';
	import LoadingModal from '$lib/components/modals/LoadingModal.svelte';
	import { fromWei, toWei } from '$lib/utils/conversionUtils';
	import { currentAuction, NEW_AUCTION_CHANGES } from '$lib/stores/main';
	import { goto } from '$app/navigation';
	import { createSalt, hashCommitmentParams, theRandomNumber } from '$lib/utils/hexUtils';
	import InfoModal from '$lib/components/modals/InfoModal.svelte';
	import { errorToast } from '$lib/components/toast/toastTheme';

	let formState = {
		nftContractAddress: '',
		tokenId: `${data.tokenId}`,
		bidPrice: 0,
		currencyAddress: ''
	};

	const MIN = 1;
	const MAX = 1000000;

	onMount(async () => {
		if (!$currentAuction) {
			goto('/explore');
			return;
		}

		// if (datetoUnix(new Date()) >= $currentAuction.endTime) {
		// 	goto('/explore');
		// }
	});

	const createBid = async ({
		nftAddress,
		tokenId,
		bidCommitment,
		bidToken,
		salt,
		saltRandomNumber
	}: {
		nftAddress: string;
		tokenId: string;
		bidCommitment: string;
		bidToken: string;
		salt: string;
		saltRandomNumber: number;
	}) => {
		console.log(nftAddress, tokenId, bidCommitment, bidToken, salt);

		try {
			const newBid = await $contracts.dauctionContract.methods
				.createBid(nftAddress, tokenId, bidCommitment, bidToken)
				.send({ from: $selectedAccount });
			console.log('new Bid _______', newBid);
			NEW_AUCTION_CHANGES.set(true);
			closeModal();
			openModal(InfoModal, {
				infoTitle: `Bid Placed`,
				infoText: `Write down your salt key -  ${saltRandomNumber}`
			});
			// currentAuction.set(null);
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

		if ($selectedAccount?.toLowerCase() === $currentAuction?.owner.toLowerCase()) {
			closeModal();
			alert('Auctioneer cannot place bid');
			return;
		}
		// if (formState.bidPrice <= Number(fromWei($currentAuction.minBidPrice))) {
		// 	closeModal();
		// 	alert('Bid cannot be less than base bid');
		// 	return;
		// }
		const saltRandomNumber = Math.floor(Math.random() * (MAX - MIN + 1) + MIN);
		const salt = createSalt(saltRandomNumber);
		const newPrice = ethers.BigNumber.from(toWei(formState.bidPrice));
		console.log('new PRice', newPrice);
		const bidCommitment = hashCommitmentParams(newPrice, salt);

		createBid({
			nftAddress: formState.nftContractAddress,
			tokenId: formState.tokenId,
			bidCommitment: bidCommitment,
			bidToken: formState.currencyAddress,
			salt: salt,
			saltRandomNumber: saltRandomNumber
		});
	};
</script>

<div class="create-bid">
	<h1 class="title">Create Bid</h1>
	{#if $currentAuction?.owner?.toLowerCase() === $selectedAccount?.toLowerCase()}
		<h1>You Cant Bid on Your Own Auction</h1>
	{:else if $selectedAccount && !$currentAuction?.bidders
			.join('')
			.toLowerCase()
			.includes($selectedAccount?.toLowerCase())}
		<form on:submit|preventDefault={onSubmit} novalidate class="mb-auto">
			<TextInput
				label="NFT Contract Address"
				name="nftContractAddress"
				required={true}
				bind:value={formState.nftContractAddress}
			/>
			<!-- <TextInput
				label="Token Id"
				disabled={true}
				name="tokenId"
				required={true}
				bind:value={formState.tokenId}
			/> -->
			<NumberInput
				label="Bid Price (amount of bid tokens)"
				name="baseBid"
				required={true}
				bind:value={formState.bidPrice}
				info={`Base bid - $${$currentAuction && fromWei($currentAuction.minBidPrice)}`}
			/>
			<!-- <span></span> -->
			<CurrencySelector
				data={CURRENCIES_ON_MUMBAI}
				label="Choose Currency"
				name="currencyAddress"
				required={true}
				bind:value={formState.currencyAddress}
			/>

			<div class="cta">
				<button type="submit" class="btn-primary submit">
					<span>Place Bid</span>
				</button>
				<button type="button" class="btn-outline-primary" on:click={() => goto('/explore')}>
					<span>Go Back</span>
				</button>
			</div>
		</form>
	{:else}
		<h1>You Already Bidded</h1>
	{/if}
</div>

<style>
	.create-bid {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		color: var(--white-background);
	}

	.create-bid .title {
		font-family: 'Darker Grotesque';
		font-weight: 500;
		font-size: 88px;
		line-height: 85%;
	}

	.create-bid form {
		width: 588px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	/* .create-bid form .collection {
	} */

	.create-bid form .collection span {
		font-weight: 500;
		font-size: 20px;
		padding: 16px;
	}
	.create-bid form .collection div {
		display: flex;
	}

	.create-bid form .cta {
		display: flex;
		width: 100%;
		justify-content: space-between;
		gap: 10px;
	}

	.create-bid form .cta button {
		width: 50%;
	}
</style>
