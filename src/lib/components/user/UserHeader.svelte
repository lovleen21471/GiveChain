<script>
	export let account = '';
</script>

<section class="user-hero-section">
	<img src="/images/profile-images/profile-hero-image.png" class="hero-image" alt="" />
	<div class="user-profile-pic">
		<img src="/images/profile-images/nav-profile-pic.svg" alt="" />
	</div>
</section>
<section class="user-title-section">
	<div class="wrapper">
		<div class="top">
			<div class="left">
				<div>
					<h1>Blockheader Digital Assets</h1>
					<div class="address-details">
						<img src="/icons/ethereum.svg" alt="" />
						<span>{`${account?.slice(0, 11)}...${account?.slice(-4)}`}</span>
						<img src="/icons/copy-icon.svg" alt="" class="copy" />
					</div>
					<span class="date">Joined: Novemeber 2022</span>
				</div>
			</div>
			<div class="right">
				<button class="btn-primary" style="font-family: 'Darker Grotesque';font-size: 20px;"
					>Edit Profile</button
				>
				<button
					class="btn-outline-primary"
					style="padding: 15px 24px;font-family: 'Darker Grotesque';font-size: 20px;"
				>
					<img src="/icons/share.svg" alt="" />
					<span>Share</span>
				</button>
			</div>
		</div>
		<div class="bottom">
			The first marketplace for decentralized sealed-bidding auctions. Place your bid privately and
			may the highest bid win!
		</div>
	</div>
</section>
