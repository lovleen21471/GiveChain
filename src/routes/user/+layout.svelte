<script>
	import { connected, chainId, selectedAccount, defaultEvmStores } from 'svelte-web3';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import UserHeader from '$lib/components/user/UserHeader.svelte';
	import NotConnected from '$lib/components/not-connected/NotConnected.svelte';
	import { currentAuction, NEW_AUCTION_CHANGES } from '$lib/stores/main';

	onMount(() => {
		NEW_AUCTION_CHANGES.set(true);
	});
</script>

{#if $connected && $selectedAccount !== null}
	<div class="main">
		{#if $page.url.pathname.includes('create-auction') || $page.url.pathname.includes('bid-auction') || $page.url.pathname.includes('reveal-bid') || $page.url.pathname.includes('settle-auction')}
			<slot />
		{:else}
			<UserHeader account={$selectedAccount} />
			<div class="user-main-area">
				<div class="wrapper">
					<div class="user-page">
						<div class="sidebar">
							<ul>
								<li>
									<a href="/user/biddings" class:active={$page.url.pathname.includes('biddings')}>
										Biddings
									</a>
								</li>
								<li>
									<a
										href="/user/owned-assets"
										class:active={$page.url.pathname.includes('owned-assets')}
									>
										Owned Assets
									</a>
								</li>
								<li>
									<a
										href="/user/created-assets"
										class:active={$page.url.pathname.includes('created-assets')}
									>
										Created Assets
									</a>
								</li>
								<li>
									<a
										href="/user/assets-on-auction"
										class:active={$page.url.pathname.includes('assets-on-auction')}
									>
										Assets on Auction
									</a>
								</li>
								<li>
									<a href="/user/activity" class:active={$page.url.pathname.includes('activity')}>
										Activity
									</a>
								</li>
								<li>
									<a
										href="/user/liked-assets"
										class:active={$page.url.pathname.includes('liked-assets')}
									>
										Liked Assets</a
									>
								</li>
							</ul>
						</div>
						<div class="content">
							<slot />
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<NotConnected />
{/if}

<style>
	.main {
		background-image: url('/images/backgrounds/user-account-bg.png');
		/* background-color: red; */
		background-size: cover;
		padding-top: 100px;
		padding-bottom: 100px;
	}

	.user-main-area {
		margin-top: 30px;
		margin-bottom: 148px;
	}

	.user-main-area .user-page {
		display: flex;
		position: relative;
	}
	.user-main-area .user-page .sidebar {
		background-color: #111d1a;
		width: 225px;
		height: 100%;
		transition: all 0.5s ease;
	}
	.user-main-area .user-page .sidebar ul {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		align-items: flex-start;
		justify-content: flex-start;
		list-style: none;
	}
	.user-main-area .user-page .sidebar ul li {
		width: 100%;
	}
	.user-main-area .user-page .sidebar ul li a {
		display: block; /* Very Important */
		width: 100%;
		text-decoration: none;
		padding: 11px;
		font-weight: 400;
		font-size: 20px;
		line-height: 128%;
		color: #8d9593;
		position: relative;
	}
	.user-main-area .user-page .sidebar ul li a:hover {
		background-color: var(--primary);
		color: var(--dark-background);
	}
	.user-main-area .user-page .sidebar ul li a.active {
		background-color: var(--dark-background);
		color: var(--primary);
		background: var(--dark-background);
		border-width: 1px 0px 1px 8px;
		border-style: solid;
		border-color: var(--primary);
	}
	.user-main-area .user-page .content {
		min-height: 532px;
		min-width: 1020.85px;
		padding: 24px;
		background-color: var(--dark-background);
		color: white;
		border: 1px solid var(--primary);
	}
	.user-main-area .user-page .sidebar ul li a.active::after {
		content: '';
		height: 47.5px;
		width: 5px;
		background-color: var(--dark-background);
		position: absolute;
		top: 0;
		right: -3px;
	}
</style>
