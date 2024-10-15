<script>
  import { p } from './stores/p.js';
  import { onMount } from 'svelte';
  import Map from './lib/Map.svelte';
  import ProgressBars from './lib/ProgressBars.svelte';
  import { gsap } from 'gsap';
  import { csv } from 'd3';

  let step = 0;
  let tl;

  $: {
    tl = gsap.timeline({
      defaults: { duration: $p.duration + 1 },
      paused: step == 0 ? true : false,
      onComplete: () => {
        if (step < $p.stepMax) step += 1;
      },
    });
  }

  // Functions to control the animation
  function startAnimation() {
    step = 1;
    // tl.play();
  }

  function pauseAnimation() {
    tl.pause();
  }

  function resumeAnimation() {
    tl.resume();
  }

  onMount(async () => {
    $p.dataCSV = await csv('./data/unep_methanedata_detected_plumes.csv');
    document.addEventListener('mousedown', pauseAnimation);
    document.addEventListener('mouseup', resumeAnimation);
  });

  $: console.log($p.dataCSV);
</script>

<style>
  button {
    margin: 10px;
    padding: 5px 10px;
  }

  :global(body) {
    background-color: #121212; /* Dark background color */
    color: #ffffff; /* Light text color for contrast */
  }
</style>

<ProgressBars {tl} {step} />
{#if $p.dataCSV.length > 0}
  <Map {tl} {step} />
{/if}

<!-- On mousedown on document, call pauseAnimation -->

<div>
  <button on:click="{startAnimation}">Start Animation</button>
  <!-- <button on:click={pauseAnimation}>Pause</button>
  <button on:click={resumeAnimation}>Resume</button> -->
</div>
