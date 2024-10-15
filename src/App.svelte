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
    const dataCSVUnsorted = await csv(
      './data/unep_methanedata_detected_plumes.csv'
    );
    $p.dataCSV = dataCSVUnsorted.sort(function (a, b) {
      if (a.insert_date < b.insert_date) return -1;
      if (a.insert_date > b.insert_date) return 1;
      return 0;
    });
    document.addEventListener('mousedown', pauseAnimation);
    document.addEventListener('mouseup', resumeAnimation);
  });

  $: console.log($p.dataCSV);
</script>

<style>
  #story-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    flex-direction: column;
  }
  button {
    margin: 10px;
    padding: 5px 10px;
  }

  :global(body) {
    background-color: #121212; /* Dark background color */
    color: #ffffff; /* Light text color for contrast */
  }
</style>

<div id="story-content">
  {#if $p.dataCSV.length > 0}
    <ProgressBars {tl} {step} />
    <Map {tl} {step} />
    <div>
      <button on:click="{startAnimation}">Start Animation</button>
      <!-- <button on:click={pauseAnimation}>Pause</button>
      <button on:click={resumeAnimation}>Resume</button> -->
    </div>
  {/if}
</div>

<!-- On mousedown on document, call pauseAnimation -->
