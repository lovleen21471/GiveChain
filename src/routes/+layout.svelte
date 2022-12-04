<script lang="ts">
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import './styles.css';

	import { Modals, closeModal, openModal } from 'svelte-modals';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import { onMount } from 'svelte';
	import { AVAILABLE_AUCTIONS, web3Modal, NEW_AUCTION_CHANGES, USER_NFTS } from '$lib/stores/main';

	import Dauction from '$lib/contracts/Dauction.json';
	import MockToken from '$lib/contracts/MockToken.json';
	import NFTContract from '$lib/contracts/NFTContract.json';
	// import ERC721 from '$lib/contracts/ERC721.json';
	//@ts-ignore
	// import NFT from '$lib/contracts/NFT.json';

	import LoadingModal from '$lib/components/modals/LoadingModal.svelte';
	import {
		connected,
		chainData,
		chainId,
		selectedAccount,
		defaultEvmStores as evm,
		web3,
		//@ts-ignore
		contracts,
		defaultEvmStores
	} from 'svelte-web3';
	import { goto } from '$app/navigation';
	import Web3Modal from 'web3modal';
	import { browserGet, browserSet } from '$lib/utils/requestUtils';
	import { variables } from '$lib/variables';
	import {
		CHAIN_ID,
		CHAIN_NAME,
		DAUCTION_MARKETPLACE_ADDRESS_ON_MUMBAI,
		NFT_CONTRACT_ADDRESS_ON_MUMBAI
	} from '$lib/utils/constants';
	import { arrayEquals, arrayIsNotEqual, sortArrayofObjects } from '$lib/utils/otherUtils';
	import { ipfsJSONParser } from '$lib/utils/fileUtils';
	import { errorToast } from '$lib/components/toast/toastTheme';

	//@ts-ignore
	evm.attachContract('dauctionContract', DAUCTION_MARKETPLACE_ADDRESS_ON_MUMBAI, Dauction.abi);
	//@ts-ignore
	evm.attachContract('nftContract', NFT_CONTRACT_ADDRESS_ON_MUMBAI, NFTContract.abi);

	let auctionsOnDNFT: any[] = [];
	let auctionsOnDNFT_: any[] = [];
	let userNFTs: any[] = [];
	let totalMinted = 0;

	const getTotalMintedNFTs = async () => {
		totalMinted = await $contracts.nftContract.methods.totalMinted().call();
		console.log('total mint _______', totalMinted);
		return;
	};

	const getNFTImage = async (nftContract: any, tokenID: string) => {
		if (!$connected) {
			return;
		}
		const nftJSONURL = await nftContract?.methods.tokenURI(tokenID).call();
		console.log(ipfsJSONParser(nftJSONURL));
		try {
			const response = await fetch(ipfsJSONParser(nftJSONURL));
			const cResponse = await response.json();
			return ipfsJSONParser(cResponse.image);
		} catch (error) {
			console.log(error);
			return '';
		}
	};

	const getAuctionDetails = async (nftAddress: string, tokenID: string) => {
		const auctionDetail = await $contracts.dauctionContract.methods
			.auctions(nftAddress, tokenID)
			.call();
		return auctionDetail;
	};

	const getNFTOwner = async (tokenID: string) => {
		const nftOwner = await $contracts.nftContract.methods.ownerOf(tokenID).call();
		return nftOwner;
	};

	const getBidDetail = async (nftAddress: string, tokenID: string, bidderAddress: string) => {
		const bidDetail = await $contracts.dauctionContract.methods
			.getBid(nftAddress, tokenID, bidderAddress)
			.call();
		return bidDetail;
	};

	const getBidders = async (nftAddress: string, tokenID: string) => {
		const biddersDetail = await $contracts.dauctionContract.methods
			.getBidders(nftAddress, tokenID)
			.call();
		return biddersDetail;
	};

	const getUserNFTs = async () => {
		userNFTs = await [];
		try {
			openModal(LoadingModal);
			await getTotalMintedNFTs();
			for (let i = 0; i < totalMinted; i++) {
				let nftOwner = await getNFTOwner(`${i}`);
				if ($selectedAccount?.toLowerCase() === nftOwner.toLowerCase()) {
					let token_uri = await getNFTImage($contracts.nftContract, `${i}`);
					let token = { tokenId: i, image: token_uri, liked: false };
					userNFTs = [...userNFTs, token];
				}
			}
			if (!arrayEquals($USER_NFTS, userNFTs)) {
				await USER_NFTS.set(sortArrayofObjects(userNFTs, 'tokenId'));
			}
			console.log($USER_NFTS);
			closeModal();
		} catch (error: any) {
			const msg = error.message;
			alert(msg.split('{')[0]);
			closeModal();
			return;
		}
	};

	const populateAuctions = async () => {
		auctionsOnDNFT_ = [];
		auctionsOnDNFT = [];
		await AVAILABLE_AUCTIONS.set([]);
		try {
			openModal(LoadingModal);
			await getTotalMintedNFTs();
			for (let i = 0; i < totalMinted; i++) {
				let auction = await getAuctionDetails(NFT_CONTRACT_ADDRESS_ON_MUMBAI, `${i}`);
				if (auction.owner !== '0x0000000000000000000000000000000000000000') {
					console.log(auction);
					auctionsOnDNFT_ = [...auctionsOnDNFT_, { tokenId: i, ...auction }];
				}
			}

			for (let i = 0; i < auctionsOnDNFT_.length; i++) {
				let image = await getNFTImage($contracts.nftContract, auctionsOnDNFT_[i].tokenId);
				let bidders = [];
				let bidders_: any[] = [];
				if (Number(auctionsOnDNFT_[i].auctionStatus) >= 2) {
					bidders = await getBidders(NFT_CONTRACT_ADDRESS_ON_MUMBAI, auctionsOnDNFT_[i].tokenId);

					// for (let j = 0; j < bidders.length; j++) {
					// 	const x = await getBidDetail(
					// 		NFT_CONTRACT_ADDRESS_ON_MUMBAI,
					// 		auctionsOnDNFT_[j].tokenId,
					// 		bidders[0]
					// 	);
					// 	bidders_ = [...bidders_, { ...x, address: bidders[j] }];
					// }

					// console.log('x_____', x.amountBidded);
				}
				let newAuction = await {
					...auctionsOnDNFT_[i],
					image: image,
					bidders: bidders,
					bidders_: bidders_,
					liked: false
				};
				auctionsOnDNFT = await [...auctionsOnDNFT, newAuction];
			}

			if (!arrayEquals($AVAILABLE_AUCTIONS, auctionsOnDNFT)) {
				await AVAILABLE_AUCTIONS.set(sortArrayofObjects(auctionsOnDNFT, 'tokenId'));
			}

			console.log(auctionsOnDNFT);
			console.log($AVAILABLE_AUCTIONS);

			closeModal();
			NEW_AUCTION_CHANGES.set(false);
		} catch (error: any) {
			const msg = error.message;
			alert(msg.split('{')[0]);
			closeModal();
			NEW_AUCTION_CHANGES.set(false);
			return;
		}
	};

	$: if (
		$connected &&
		$selectedAccount !== null &&
		checkNetwork($chainId) &&
		$NEW_AUCTION_CHANGES
	) {
		populateAuctions();
		getUserNFTs();
	}

	// $: console.log($AVAILABLE_AUCTIONS.length);

	// TODO: move to store

	const connectWithWalletConnect = async () => {
		const provider = await $web3Modal.connect();
		defaultEvmStores.setProvider(provider);
	};

	// TODO: maybe move to store
	const disconnectWallet = async () => {
		await defaultEvmStores.disconnect();
		await $web3Modal.clearCachedProvider();
		browserSet('isWalletConnected', false);
	};

	const checkNetwork = (network: any) => {
		if (!network) return false;

		if (network != CHAIN_ID) {
			// goerli
			errorToast(`Please Choose ${CHAIN_NAME} chain`);
			disconnectWallet();
			return false;
		} else {
			return true;
		}
	};
	$: if ($connected && $selectedAccount !== null) {
		console.log($chainData);
		console.log($chainId);
	}

	$: checkNetwork($chainId);
	onMount(() => {
		if (typeof window.ethereum === 'undefined') {
			errorToast('Please Install MetaMask');

			return;
		}

		const providerOptions = {
			walletconnect: {
				package: window.WalletConnectProvider.default,
				options: { infuraId: variables.infuraId }
			}
		};
		// create instance
		$web3Modal = new Web3Modal({
			cacheProvider: true,
			providerOptions
		});

		// reconnect on mount
		if ($web3Modal.cacheProvider || browserGet('isWalletConnected') === 'true')
			connectWithWalletConnect();
	});
	// $: console.log('cache', web3Modal?.cacheProvider);
</script>

<div class="wrap">
	<SvelteToast />
</div>

<Modals>
	<div slot="backdrop" class="backdrop" on:click={closeModal} />
</Modals>

<Header {disconnectWallet} />

<main style="overflow: hidden;">
	<slot />
</main>

<Footer />

<style>
	.backdrop {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 9999;
	}

	:global(.modal) {
		z-index: 9999;
	}

	:global(.modal .contents) {
		z-index: 9999;
		background: rgba(255, 255, 255, 0.3) !important;
	}

	.wrap {
		display: contents;
		font-size: 20px !important;
		font-weight: 600 !important;
		font-family: 'Darker Grotesque', sans-serif;
		/* You can set CSS vars here too */
		/* --toastBackground: pink; */
	}
	.wrap :global(strong) {
		font-weight: 600 !important;
	}
</style>
