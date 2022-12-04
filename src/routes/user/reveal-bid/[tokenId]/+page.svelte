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
	import { ethers } from 'ethers';
	import {
		CURRENCIES_ON_MUMBAI,
		DAUCTION_MARKETPLACE_ADDRESS_ON_MUMBAI
	} from '$lib/utils/constants';
	import { combineDateTime, datetoUnix, minsToUnix } from '$lib/utils/timeUtils';
	import { onMount } from 'svelte/internal';

	import MockToken from '$lib/contracts/MockToken.json';
	import { openModal, closeModal, closeAllModals } from 'svelte-modals';
	import LoadingModal from '$lib/components/modals/LoadingModal.svelte';
	import { fromWei, toWei } from '$lib/utils/conversionUtils';
	import { currentAuction } from '$lib/stores/main';
	import { goto } from '$app/navigation';
	import { createSalt, hashCommitmentParams, theRandomNumber } from '$lib/utils/hexUtils';
	import InfoModal from '$lib/components/modals/InfoModal.svelte';
	import TextAreaInput from '$lib/components/reusables/TextAreaInput.svelte';
	import CurrencySelector from '$lib/components/reusables/CurrencySelector.svelte';
	import { errorToast, successToast } from '$lib/components/toast/toastTheme';

	let formState = {
		nftContractAddress: '',
		tokenId: `${data.tokenId}`,
		bidPrice: 0,
		saltRandomNumber: '',
		currencyAddress: ''
	};

	let approved = false;

	onMount(async () => {
		if (!$currentAuction) {
			goto('/explore');
		}
		if (
			$selectedAccount &&
			!$currentAuction?.bidders.join('').toLowerCase().includes($selectedAccount?.toLowerCase())
		) {
			goto('/explore');
		}
	});

	// const checkAllowance = async (address: string) => {
	// 	approved = false;
	// 	// if (!tokenId) return;
	// 	// openModal(LoadingModal);
	// 	// getApprovalStatus(tokenId);
	// 	console.log(approved);
	// };

	const setAllowance = async (contractAddress: string, bidPrice: number) => {
		openModal(LoadingModal);
		if (!contractAddress || !bidPrice) {
			closeModal();
			return;
		}
		try {
			//@ts-ignore
			await evm.attachContract('mockToken', contractAddress, MockToken.abi);

			const newPrice = ethers.BigNumber.from(toWei(bidPrice));
			const setAll = await $contracts.mockToken.methods
				.approve(DAUCTION_MARKETPLACE_ADDRESS_ON_MUMBAI, newPrice)
				.send({ from: $selectedAccount });
			console.log('set all_______', setAll);
			approved = true;
			closeModal();
		} catch (error: any) {
			approved = false;
			const msg = error.message;
			alert(msg.split('{')[0]);
			closeModal();
			return;
		}
	};

	const getAllowanceStatus = async (currencyAddress: string, bidPrice: number) => {
		openModal(LoadingModal);
		if (!currencyAddress || !bidPrice) {
			closeModal();
			return;
		}
		try {
			const newPrice = ethers.BigNumber.from(toWei(bidPrice));
			//@ts-ignore
			await evm.attachContract('mockToken', currencyAddress, MockToken.abi);
			console.log($contracts.mockToken.methods);
			const getAll = await $contracts.mockToken.methods
				.allowance($selectedAccount, DAUCTION_MARKETPLACE_ADDRESS_ON_MUMBAI)
				.call();
			console.log('get allo___', getAll);
			if (getAll < newPrice) {
				approved = false;
				closeModal();
				return;
			} else {
				approved = true;
				closeModal();
				return;
			}
		} catch (error: any) {
			approved = false;
			const msg = error.message;
			alert(`get allo_ ${msg.split('{')[0]}`);
			closeModal();
			return;
		}
	};

	const revealBid = async ({
		nftAddress,
		tokenId,
		bidValue,
		salt
	}: {
		nftAddress: string;
		tokenId: string;
		bidValue: any;
		salt: string;
	}) => {
		console.log(nftAddress, tokenId, bidValue, salt);

		try {
			const revealBid = await $contracts.dauctionContract.methods
				.revealBid(nftAddress, tokenId, bidValue, salt)
				.send({ from: $selectedAccount });
			console.log('reveal Bid _______', revealBid);

			closeModal();
			successToast('Bid Revealed, Awaiting Winner');
			// openModal(InfoModal, {
			// 	infoTitle: `Bid Reveal`,
			// 	infoText: `Write down your salt -  ${salt}`
			// });
			currentAuction.set(null);
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

		if ($selectedAccount?.toLowerCase() === $currentAuction?.owner.toLowerCase()) {
			closeModal();
			alert('Auctioneer cannot reveal bid');
			return;
		}

		const newPrice = ethers.BigNumber.from(toWei(formState.bidPrice.toString()));
		const salt = createSalt(Number(formState.saltRandomNumber));
		console.log(salt);
		revealBid({
			nftAddress: formState.nftContractAddress,
			tokenId: formState.tokenId,
			bidValue: newPrice,
			salt: salt
		});
	};
</script>

<div class="reveal-bid">
	<h1 class="title">Reveal Bid</h1>
	{#if $selectedAccount && $currentAuction?.bidders
			.join('')
			.toLowerCase()
			.includes($selectedAccount?.toLowerCase())}
		<form on:submit|preventDefault={onSubmit} novalidate class="mb-auto">
			<TextInput
				label="NFT Contract Address"
				name="nftContractAddress"
				required={true}
				bind:value={formState.nftContractAddress}
				on:blur={() => getAllowanceStatus(formState.currencyAddress, formState.bidPrice)}
			/>
			<!-- <TextInput label="Token Id" name="tokenId" required={true} bind:value={formState.tokenId} /> -->
			<NumberInput
				label="Bid Price (amount of bid tokens)"
				name="baseBid"
				required={true}
				bind:value={formState.bidPrice}
				on:blur={() => getAllowanceStatus(formState.currencyAddress, formState.bidPrice)}
			/>
			<CurrencySelector
				data={CURRENCIES_ON_MUMBAI}
				label="Choose Currency"
				name="currencyAddress"
				required={true}
				bind:value={formState.currencyAddress}
				on:change={() => getAllowanceStatus(formState.currencyAddress, formState.bidPrice)}
			/>
			<TextInput
				label="Salt Key From Bid"
				name="salt"
				required={true}
				bind:value={formState.saltRandomNumber}
			/>
			<!-- <TextAreaInput
				label="Token Id"
				name="tokenId"
				required={true}
				bind:value={formState.tokenId}
			/> -->

			<div class="cta">
				<button type="submit" class="btn-primary submit" disabled={!approved}>
					<span>Reveal Bid</span>
				</button>
				<button
					type="button"
					class="btn-outline-primary"
					on:click={() => setAllowance(formState.currencyAddress, formState.bidPrice)}
					disabled={approved}
				>
					<span>Grant Approval</span>
				</button>
			</div>

			<!-- <div class="cta">
				<button type="submit" class="btn-primary submit" disabled={!approved}>
					<span>Create Auction</span>
				</button>
				<button
					type="button"
					class="btn-outline-primary"
					disabled={approved}
					on:click={() => setApproval(formState.tokenId)}
				>
					<span>Grant Approval</span>
				</button>
			</div> -->
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
