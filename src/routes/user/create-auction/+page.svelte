<script lang="ts">
	import {
		connected,
		chainId,
		selectedAccount,
		defaultEvmStores as evm,
		web3,
		contracts
	} from 'svelte-web3';

	import NumberInput from '$lib/components/reusables/NumberInput.svelte';
	import TextInput from '$lib/components/reusables/TextInput.svelte';
	import { ethers } from 'ethers';
	import { DAUCTION_MARKETPLACE_ADDRESS_ON_MUMBAI, DELAY_MINUTES } from '$lib/utils/constants';
	import { combineDateTime, datetoUnix, minsToUnix } from '$lib/utils/timeUtils';
	import { onMount } from 'svelte/internal';

	import { openModal, closeModal } from 'svelte-modals';
	import LoadingModal from '$lib/components/modals/LoadingModal.svelte';
	import { fromWei, toWei } from '$lib/utils/conversionUtils';
	import { goto } from '$app/navigation';
	import { NEW_AUCTION_CHANGES, nftToAuction } from '$lib/stores/main';
	import { scrollIntoView } from '$lib/utils/otherUtils';
	import { errorToast, successToast } from '$lib/components/toast/toastTheme';

	let formState = {
		nftContractAddress: '',
		tokenId: '',
		baseBid: 0,
		startDate: '',
		startTime: '',
		endDate: '',
		endTime: '',
		revealDuration: 0
	};

	let approved = false;
	let mainDiv: HTMLDivElement;

	onMount(async () => {
		if ($nftToAuction) {
			console.log($nftToAuction);
			formState.nftContractAddress = await $nftToAuction.contractAddress;
			formState.tokenId = await $nftToAuction.tokenId;
			nftToAuction.set(null);
		}

		scrollIntoView(mainDiv, 0);
	});

	const checkTokenId = async (tokenId: string) => {
		approved = false;
		if (!tokenId) return;
		openModal(LoadingModal);
		getApprovalStatus(tokenId);
		console.log(approved);
	};

	const getApprovalStatus = async (tokenId: string) => {
		try {
			const getAppr = await $contracts.nftContract.methods.getApproved(tokenId).call();
			console.log('get appr_______', getAppr);
			if (getAppr.toLowerCase() === DAUCTION_MARKETPLACE_ADDRESS_ON_MUMBAI.toLowerCase()) {
				approved = true;
				closeModal();
				return;
			} else {
				approved = false;
				closeModal();
				return;
			}
			// alert('Please Approve Dauction Contract');
		} catch (error: any) {
			approved = false;
			const msg = error.message;
			alert(msg.split('{')[0]);
			closeModal();
			return;
		}
	};

	const setApproval = async (tokenId: string) => {
		openModal(LoadingModal);
		try {
			const setAppr = await $contracts.nftContract.methods
				.approve(DAUCTION_MARKETPLACE_ADDRESS_ON_MUMBAI, tokenId)
				.send({ from: $selectedAccount });
			console.log('set appr_______', setAppr);
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

	const createAuction = async ({
		nftAddress,
		tokenId,
		minBidPrice,
		startTime,
		endTime,
		revealDuration
	}: {
		nftAddress: string;
		tokenId: string;
		minBidPrice: any;
		startTime: number;
		endTime: number;
		revealDuration: number;
	}) => {
		openModal(LoadingModal);
		// call contract

		if (approved === false) {
			return;
		}
		console.log(nftAddress, tokenId, minBidPrice, startTime, endTime, revealDuration);
		try {
			const newAuction = await $contracts.dauctionContract.methods
				.createAuction(nftAddress, tokenId, minBidPrice, startTime, endTime, revealDuration)
				.send({ from: $selectedAccount });
			console.log('new Auction _______', newAuction);
			await closeModal();
			await successToast(`Auction Created`);
			await NEW_AUCTION_CHANGES.set(true);
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

		// Check getApprovalStatus
		getApprovalStatus(formState.tokenId);

		const finalStartTime =
			datetoUnix(combineDateTime(formState.startDate, formState.startTime)) +
			minsToUnix(DELAY_MINUTES); // Add 3mins for delays
		const finalEndTime =
			datetoUnix(combineDateTime(formState.endDate, formState.endTime)) + minsToUnix(DELAY_MINUTES); // Add 3mins for delays
		const finalRevealDuration = finalEndTime + minsToUnix(formState.revealDuration);
		const baseBidToWei = ethers.BigNumber.from(toWei(formState.baseBid));

		createAuction({
			nftAddress: formState.nftContractAddress,
			tokenId: formState.tokenId,
			minBidPrice: baseBidToWei,
			startTime: finalStartTime,
			endTime: finalEndTime,
			revealDuration: finalRevealDuration
		});
		// alert(JSON.stringify(formState));
	};
</script>

<div class="create-auction" bind:this={mainDiv}>
	<h1 class="title">Create a SDG</h1>

	<form on:submit|preventDefault={onSubmit} novalidate class="mb-auto">
		<TextInput
			label="Title"
			name="title"
			required={true}
			bind:value={formState.nftContractAddress}
		/>
		<TextInput
			label="SDG Goal"
			name="sdgGoal"
			required={true}
			on:blur={() => checkTokenId(formState.tokenId)}
		/>
		<NumberInput
			label="Targeted Amount"
			name="targetAmount"
			required={true}
			bind:value={formState.baseBid}
		/>
		
		<div class="cta">
			<button
				type="button"
				class="btn-outline-primary"
				disabled={approved}
			>
				<span><a href="https://app.pinata.cloud/">Grant Approval</a></span>
			</button>
		</div>
	</form>
</div>

<style>
	.create-auction {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		color: var(--white-background);
	}

	.create-auction .title {
		font-family: 'Darker Grotesque';
		font-weight: 500;
		font-size: 88px;
		line-height: 85%;
	}

	.create-auction form {
		width: 588px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.create-auction form .collection span {
		font-weight: 500;
		font-size: 20px;
		padding: 16px;
	}
	.create-auction form .collection div {
		display: flex;
	}

	.create-auction form .cta {
		display: flex;
		width: 100%;
		justify-content: space-between;
		gap: 10px;
	}

	.create-auction form .cta button {
		width: 50%;
	}
</style>
