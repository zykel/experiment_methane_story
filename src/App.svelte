<script>
  import { p, getNextStep, isLastStep } from './stores/p.js';
  import { onMount } from 'svelte';
  import Map from './lib/Map.svelte';
  import ProgressBars from './lib/ProgressBars.svelte';
  import { gsap } from 'gsap';
  import { csv } from 'd3';

  let step = $p.steps[0];
  let tl;

  $: {
    tl = gsap.timeline({
      defaults: { duration: $p.duration + 1 },
      paused: step == $p.steps[0] ? true : false,
      onComplete: () => {
        if (!$isLastStep(step)) step = $getNextStep(step);
      },
    });
  }

  // Functions to control the animation
  function startAnimation() {
    step = $p.steps[1];
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
      if (a.tile_date < b.tile_date) return -1;
      if (a.tile_date > b.tile_date) return 1;
      return 0;
    });

    // Find ideal first flare
    const idealFlareCandidates = $p.dataCSV.filter(
      (d) =>
        d.lon >= 53.39823970699587 &&
        d.lon <= 55.025513516498485 &&
        d.lat >= 38.06969014665377 &&
        d.lat <= 39.08892395176091
    );
    $p.firstFlare = idealFlareCandidates[0];
    // Filter $p.dataCSV to only include flares after the first flare
    const indexOfFirstFlare = $p.dataCSV.indexOf(
      (d) => d.id_plume == $p.firstFlare.id_plume
    );
    $p.dataCSVAfterFirst = $p.dataCSV.slice(indexOfFirstFlare + 1);
    // $p.dataCSVAfterFirst = $p.dataCSV.filter(
    //   (d) => d.tile_date >= $p.firstFlare.tile_date // later without = in >=
    // );
    // debugger;
    // // LON
    // 53.39823970699587
    // 55.025513516498485
    // // LAT
    // 38.06969014665377
    // 39.08892395176091

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
