<script lang="ts">
	import type { Auction } from '$lib/interfaces';

	const auctions: Auction[] = [
		{
			id: Math.floor(1000 + Math.random() * 9000),
			profile_name: '',
			profile_desc: 'HELPS',
			profile_pic: '',
			nft: '/images/nft-2.jpg',
			crypto_price: 85.2,
			usd_price: 122029,
			liked: false
		},
		{
			id: Math.floor(1000 + Math.random() * 9000),
			profile_name: '',
			profile_desc: 'United H.O.P.E Foundation',
			profile_pic: '',
			nft: '/images/hero-nft-1.png',
			crypto_price: 95.2,
			usd_price: 125029,
			liked: false
		},
		{
			id: Math.floor(1000 + Math.random() * 9000),
			profile_name: '',
			profile_desc: 'World of Nature',
			profile_pic: '',
			nft: '/images/nft-3.jpeg',
			crypto_price: 30,
			usd_price: 15029,
			liked: false
		},
		{
			id: Math.floor(1000 + Math.random() * 9000),
			profile_name: '',
			profile_desc: 'Save the children',
			profile_pic: '',
			nft: '/images/nft-4.jpg',
			crypto_price: 183.9,
			liked: false,
			usd_price: 39657
		}
	];
</script>

<div class="top-auctions-section">
	<div class="top">
		<div class="wrapper">
			<div class="top-auctions-container">
				<h1>Most donated</h1>
				<button class="btn-outline-primary top-auctions-btn">
					<span>See all</span>
					<img src="/icons/arrow-forward-primary.svg" alt="" />
				</button>
			</div>
		</div>
	</div>
	<div class="bottom">
		<div class="wrapper">
			<div class="top-auctions">
				<!-- Auction -->
				{#each auctions as auction}
					<div class="auction">
						<div class="auction-card">
							<div class="content">
								<div class="auction-card-top">
									<div class="left">
										<h3>{auction.profile_desc}</h3>
									</div>
								</div>
								<img src={auction.nft} class="auction-card-image" alt="" />
								<div class="auction-card-bottom">
									<div class="left">
										<h4>${auction.crypto_price.toLocaleString()}<span>thousand</span></h4>
										<span class="usd">money raised</span>
									</div>
									<div class="right">
										<p><span class="usd">24</span>people donated</p>
									</div>
								</div>
								<div class="auction-btns">
									<button class="btn-primary auction-btn-place">
										<span>Donate</span>
									</button>
									<button class="btn-outline-primary auction-btn-explore">
										<span>View</span>
									</button>
								</div>
							</div>
							<div class="bg " />
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.auction-card .bg {
		background: #1d220d;
		border: 1.05854px solid #d3f85a;
		position: absolute;
		width: 282px;
		height: 474.46px;
		top: 12px;
		left: 12px;
		z-index: 1;
		display: none;
	}

	/* Hover */
	.auction-card:hover .content .auction-btns .auction-btn-place,
	.auction-card:hover .content .auction-btns .auction-btn-explore {
		padding-top: 18px;
		padding-bottom: 18px;
	}

	.auction-card:hover .bg {
		display: block;
	}
</style>
