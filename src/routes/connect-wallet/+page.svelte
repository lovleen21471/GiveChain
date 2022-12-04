<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import {
		connected,
		web3,
		selectedAccount,
		chainId,
		chainData,
		defaultEvmStores
	} from 'svelte-web3';
	import { onMount } from 'svelte';

	import Web3Modal from 'web3modal';

	const connectWithMetaMask = () => {
		defaultEvmStores.setProvider();
		goto('/explore');
	};

	const WalletConnectProvider = browser && window.WalletConnectProvider.default;

	// $: console.log(Web3Modal);

	let infuraId = '27e484dcd9e3efcfd25a83a78777cdf1';
	let web3Modal: any;

	const connectWithWalletConnect = async () => {
		// if (web3Modal) web3Modal.clearCachedProvider();
		// web3Modal = new Web3Modal({
		// 	cacheProvider: true,
		// 	providerOptions: {
		// 		walletconnect: {
		// 			package: WalletConnectProvider,
		// 			options: { infuraId }
		// 		}
		// 	}
		// });
		const provider = await web3Modal.connect();
		defaultEvmStores.setProvider(provider);
	};

	onMount(async () => {
		web3Modal = new Web3Modal({
			cacheProvider: true,
			providerOptions: {
				walletconnect: {
					package: WalletConnectProvider,
					options: { infuraId }
				}
			}
		});

		if (web3Modal.cachedProvider) {
			await web3Modal.connect();
		}
	});
</script>

<div class="image" />
<div class="connect-wallet-section">
	<div class="top">
		<h1>Connect Wallet</h1>
		<p>
			Connect with one of the available wallet providers. If you dont have one, select a provider
			and create one.
		</p>
	</div>
	<div class="bottom">
		<div class="channel" on:click={connectWithMetaMask}>
			<div class="content">
				<img src="/images/Web3 Logos/MetaMaskBadge.svg" alt="" />
				<span>Metamask</span>
				<p class="popular">Most Popular</p>
			</div>
			<div class="bg" />
		</div>
		<div class="channel">
			<div class="content">
				<img src="/images/Web3 Logos/CoinbaseBadge.svg" alt="" />
				<span>Coinbase Wallet</span>
			</div>
			<div class="bg" />
		</div>
		<div class="channel" on:click={connectWithWalletConnect}>
			<div class="content">
				<img src="/images/Web3 Logos/WalletConnectBadge.svg" alt="" />
				<span>Wallet Connect</span>
			</div>
			<div class="bg" />
		</div>
	</div>
</div>

<style>
	.image {
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		background-image: url('images/connect-wallet-bg.png');
		z-index: -1;
	}
	:global(.web3modal-modal-lightbox) {
		z-index: 999 !important;
	}
</style>
