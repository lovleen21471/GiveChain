<script lang="ts">
	import type { Auction } from '$lib/interfaces';
	import { AVAILABLE_AUCTIONS } from '$lib/stores/main';
	import { sortArrayofObjects } from '$lib/utils/otherUtils';

	export let profile_name: string;
	export let profile_desc: string;
	export let profile_pic: string;
	export let nft: string;
	export let liked: boolean;
	export let tokenId: number;
	export let showLike = true;

	const handleLikeAuction = (tokenId: number) => {
		let newAuction = $AVAILABLE_AUCTIONS.find((x) => x.tokenId === tokenId);
		if (newAuction) {
			newAuction.liked = !newAuction.liked;
			AVAILABLE_AUCTIONS.set(
				sortArrayofObjects(
					[...$AVAILABLE_AUCTIONS.filter((x) => x.tokenId !== tokenId), newAuction],
					'tokenId'
				)
			);
		}
	};
</script>

<div class="card-top-template-top">
	<div class="auction-card-top">
		<div class="left">
			<span>{profile_name}</span>
			<p>{profile_desc}</p>
		</div>
		<img src={profile_pic} alt="" />
	</div>
	<img src={nft} class="auction-card-image" alt="" />
	{#if showLike}
		{#if liked}
			<img
				src="/icons/full-heart.svg"
				alt=""
				class="liked"
				on:click={() => handleLikeAuction(tokenId)}
			/>
		{:else}
			<img
				src="/icons/empty-heart.svg"
				alt=""
				class="liked"
				on:click={() => handleLikeAuction(tokenId)}
			/>
		{/if}
	{/if}
</div>

<style>
	* {
		font-family: 'Darker Grotesque', sans-serif;
	}

	.card-top-template-top .auction-card-top .left span {
		font-size: 11.47px;
	}
	.card-top-template-top .auction-card-image {
		width: 204.79px;
		height: 197.41px;
		margin-top: 13.35px;
	}
	.card-top-template-top .liked {
		cursor: pointer;
		position: absolute;
		width: 24.57px;
		height: 24.57px;
		right: 23px;
		top: 67px;
	}
	.card-top-template-top .auction-card-top .left p {
		font-size: 13.11px;
	}
	.card-top-template-top .auction-card-top img {
		width: 29.49px;
		height: 29.49px;
	}
</style>
