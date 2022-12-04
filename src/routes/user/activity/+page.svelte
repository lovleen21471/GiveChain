<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedAccount } from 'svelte-web3';

	let drawerContent: HTMLDivElement;
	onMount(() => {
		const _scroll = drawerContent.scrollTo;
		window.scrollTo = function () {
			_scroll.apply(drawerContent);
		};
	});
	// const biddingActivities = [1, 2, 3, 4];

	const biddingActivities = [
		{
			id: Math.floor(1000 + Math.random() * 9000),
			owner_address: '0x70a31d3756e8908b067ceec4f57f1efa8c9b29f0',
			bid: 102.2,
			base_bid: 85.2,
			winning_bid: 102.2,
			asset: 'Strange Connections #1414',
			status: 'ended',
			date: '4 mins ago'
		},
		{
			id: Math.floor(1000 + Math.random() * 9000),
			owner_address: '0x70a31d3756e8908b067ceec4f57f1efa8c9b29f0',
			bid: 90.2,
			base_bid: 85.2,
			winning_bid: 102.2,
			asset: 'Strange Connections #1414',
			status: 'ended',
			date: '4 mins ago'
		},
		{
			id: Math.floor(1000 + Math.random() * 9000),
			owner_address: '0x70a31d373276e18b067ceec4f57f1efa8c9b29f0',
			bid: null,
			base_bid: 85.2,
			winning_bid: null,
			asset: 'Strange Connections #1414',
			status: 'ended',
			date: '4 mins ago'
		},
		{
			id: Math.floor(1000 + Math.random() * 9000),
			owner_address: '0x70a31d373276e18b067ceec4f57f1efa8c9b29f0',
			bid: null,
			base_bid: 85.2,
			winning_bid: 105.2,
			asset: 'Strange Connections #1414',
			status: 'ended',
			date: '4 mins ago'
		}
	];
</script>

<div bind:this={drawerContent} class="activity user-template" style="width: 100%;height: 100%">
	{#if biddingActivities.length > 0}
		<div class="top">
			<div class="toolbar">
				<div class="search-container">
					<input type="text" name="search" placeholder="Filter By" />
					<img src="/icons/search-icon.svg" alt="" />
				</div>
			</div>
		</div>
		<div class="bidding-activities">
			{#each biddingActivities as biddingActivity}
				{#if biddingActivity.owner_address === $selectedAccount}
					<div class="bidding-activity">
						<div class="top">
							<div
								class="bid-pill"
								class:auction-ended={biddingActivity.winning_bid === null}
								class:asset-sold={biddingActivity.winning_bid}
							>
								{#if biddingActivity.winning_bid === null}
									Auction Ended
								{/if}
								{#if biddingActivity.winning_bid}
									Asset Sold
								{/if}
							</div>
							<div class="time-stamp">4 mins ago</div>
						</div>
						<div class="mid">
							{#if biddingActivity.winning_bid === null}
								Your auction has ended without a winning bid.
							{/if}
							{#if biddingActivity.winning_bid}
								Your asset has been sold !!!
							{/if}
						</div>
						<div class="bottom">
							<div class="left">
								<span class="asset-title">Asset:</span>
								<span class="asset">{biddingActivity.asset}</span>
								<span class="divider">|</span>
								<span class="your-bid-title">Your Bid:</span>
								<span class="winning-bid">{biddingActivity.bid}</span>
								{#if biddingActivity.winning_bid}
									<span class="divider">|</span>
									<span class="winning-bid-title">Selling Bid:</span>
									<span class="winning-bid">{biddingActivity.winning_bid}</span>
									<span class="winning-bid-currency">MATIC</span>
								{/if}
							</div>
							<div class="right">
								<span>View Assets</span>
								<img src="/icons/arrow-forward-primary-2.svg" alt="" />
							</div>
						</div>
					</div>
				{:else}
					<div class="bidding-activity">
						<div class="top">
							<div
								class="bid-pill"
								class:bid-won={biddingActivity.bid === biddingActivity.winning_bid}
								class:bid-lost={biddingActivity.bid !== biddingActivity.winning_bid}
							>
								{#if biddingActivity.bid === biddingActivity.winning_bid}
									Bid Won
								{/if}
								{#if biddingActivity.bid !== biddingActivity.winning_bid}
									Bid Lost
								{/if}
							</div>
							<div class="time-stamp">4 mins ago</div>
						</div>
						<div class="mid">
							{#if biddingActivity.bid === biddingActivity.winning_bid}
								Congratulations!!! You won a bid
							{/if}
							{#if biddingActivity.bid !== biddingActivity.winning_bid}
								Sadly you lost a bid
							{/if}
						</div>
						<div class="bottom">
							<div class="left">
								<span class="asset-title">Asset:</span>
								<span class="asset">{biddingActivity.asset}</span>
								<span class="divider">|</span>
								<span class="your-bid-title">Your Bid:</span>
								<span class="winning-bid">{biddingActivity.bid}</span>
								<span class="divider">|</span>
								<span class="winning-bid-title">Winning Bid:</span>
								<span class="winning-bid">{biddingActivity.winning_bid}</span>
								<span class="winning-bid-currency">MATIC</span>
							</div>
							<div class="right">
								<span>View Assets</span>
								<img src="/icons/arrow-forward-primary-2.svg" alt="" />
							</div>
						</div>
					</div>
				{/if}
			{/each}
			<!-- <div class="bidding-activity">
				<div class="top">
					<div class="bid-pill bid-lost">Bid Lost</div>
					<div class="time-stamp">4 mins ago</div>
				</div>
				<div class="mid">Sadly you lost a bid</div>
				<div class="bottom">
					<div class="left">
						<span class="asset-title">Asset:</span>
						<span class="asset">Strange Connections #1414</span>
						<span class="divider">|</span>
						<span class="your-bid-title">Your Bid</span>
						<span class="your-bid">85.60</span>
						<span class="divider">|</span>
						<span class="winning-bid-title">Winning Bid</span>
						<span class="winning-bid">102.20</span>
						<span class="winning-bid-currency">MATIC</span>
					</div>
					<div class="right">
						<span>View Assets</span>
						<img src="/icons/arrow-forward-primary-2.svg" alt="" />
					</div>
				</div>
			</div> -->
		</div>
	{:else}
		<div class="empty-disp">
			<h1>No activity to display yet</h1>
			<span>
				Place a bid on an asset you want or create an auction to view activities on them
			</span>
		</div>
	{/if}
</div>

<style>
	* {
		font-family: 'Darker Grotesque', sans-serif;
	}

	.activity .bidding-activities {
		margin-top: 24px;
	}
	.activity .bidding-activities .bidding-activity {
		border-top: 1px solid var(--primary-9);
		padding-top: 24px;
		padding-bottom: 24px;
	}
	.activity .bidding-activities .bidding-activity .top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.activity .bidding-activities .bidding-activity .top .bid-pill {
		padding: 4px 8px;
		border-radius: 14px;
		font-weight: 400;
		font-size: 16px;
		line-height: 124.1%;
		margin-bottom: 10px;
	}
	.activity .bidding-activities .bidding-activity .top .bid-won {
		border: 1px solid var(--green-background);
		color: var(--green-background);
	}
	.activity .bidding-activities .bidding-activity .top .bid-lost {
		border: 1px solid var(--danger-background);
		color: var(--danger-background);
	}
	.activity .bidding-activities .bidding-activity .top .auction-ended {
		border: 1px solid var(--warning-background);
		color: var(--warning-background);
	}
	.activity .bidding-activities .bidding-activity .top .asset-sold {
		border: 1px solid var(--neutral-background);
		color: var(--neutral-background);
	}
	.activity .bidding-activities .bidding-activity .top .time-stamp {
		font-weight: 400;
		font-size: 18px;
		line-height: 128%;
		color: var(--white-background);
	}
	.activity .bidding-activities .bidding-activity .mid {
		margin: 8px 0px;
		font-weight: 400;
		font-size: 20px;
		line-height: 128%;
		color: var(--white-background);
	}
	.activity .bidding-activities .bidding-activity .bottom {
		font-weight: 400;
		font-size: 18px;
		line-height: 128%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.activity .bidding-activities .bidding-activity .bottom .left .divider {
		margin: 0 10px;
	}
	.activity .bidding-activities .bidding-activity .bottom .left .asset-title,
	.activity .bidding-activities .bidding-activity .bottom .left .divider,
	.activity .bidding-activities .bidding-activity .bottom .left .winning-bid-title,
	.activity .bidding-activities .bidding-activity .bottom .left .your-bid-title,
	.activity .bidding-activities .bidding-activity .bottom .left .winning-bid-currency {
		color: var(--secondary-4);
	}
	.activity .bidding-activities .bidding-activity .bottom .right {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		color: var(--primary);
	}
	.activity .bidding-activities .bidding-activity .bottom .right img {
		margin-top: 3px;
	}
</style>
