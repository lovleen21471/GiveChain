<script>
	import { goto } from '$app/navigation';
</script>

<div class="hero-section">
	<div class="wrapper">
		<section class="hero-container">
			<div class="hero-text">
				<h1>
					Donate to social and enviornmental causes on the
					<span>most secure and decentralized platform</span>
				</h1>
                
				<div class="hero-btns">
					<button class="btn-primary hero-btn-explore" on:click={() => goto('/explore')}>
						<span>Explore</span>
						<img src="/icons/arrow-forward-black.svg" alt="" />
					</button>
					<button
						class="btn-outline-primary hero-btn-create-auction"
						on:click={() => goto('/user/create-auction')}
					>
						<span>Create</span>
					</button>
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	
</style>
