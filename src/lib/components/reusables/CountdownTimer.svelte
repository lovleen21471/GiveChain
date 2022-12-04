<script lang="ts">
	import { onDestroy, onMount } from 'svelte/internal';

	export let endTime: string;

	let displayDiv: HTMLDivElement;
	let countDownDate = new Date(endTime).getTime();

	onMount(() => {
		const x = setInterval(function () {
			// Get today's date and time
			var now = new Date().getTime();
			// Find the distance between now and the count down date
			var distance = countDownDate - now;
			// Time calculations for days, hours, minutes and seconds
			//   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);

			// Output the result in an element with id="demo"
			if (displayDiv) {
				displayDiv.innerHTML = hours + 'h ' + minutes + 'm ' + seconds + 's ';
			}

			// If the count down is over, write some text
			if (distance < 0) {
				clearInterval(x);
				if (displayDiv) {
					displayDiv.innerHTML = 'ENDED';
				}
			}
		}, 1000);
	});

	onDestroy(() => {});

	// Update the count down every 1 second
</script>

<div class="displayDiv" bind:this={displayDiv}>---</div>

<style>
	/* .displayDiv {

  font-weight: 800;
    font-size: 22px;
    line-height: 118.1%;
    color: var(--white-background);
    margin: 0;
  } */
</style>
