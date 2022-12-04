<script>
	import HeroSection from '$lib/components/hero-section/HeroSection.svelte';
	import TopAuctionsSection from '$lib/components/top-auctions-section/TopAuctionsSection.svelte';
	import HowToSellSection from '$lib/components/how-to-sell-section/HowToSellSection.svelte';
	import TopSellersSection from '$lib/components/top-sellers-section/TopSellersSection.svelte';
</script>

<svelte:head>
	<title>GiveChain</title>
	<meta name="description" content="Decentralized charity giving" />
</svelte:head>

<HeroSection />
<TopAuctionsSection />
<HowToSellSection />
<TopSellersSection />
