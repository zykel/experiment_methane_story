<script>
  import { p, getNextStep, getPreviousStep, isLastStep } from './stores/p.js';
  import { onMount } from 'svelte';
  import Map from './lib/Map.svelte';
  import ProgressBars from './lib/ProgressBars.svelte';
  import { gsap } from 'gsap';
  import { csv, json } from 'd3';

  let step = $p.steps[0];
  let tl;

  let mouseDownTime = null;
  let direction = 'forward';

  $: {
    // // Finish all runnning tweens instantly

    // Create a new timeline
    tl = gsap.timeline({
      defaults: { duration: $p.duration + 1 },
      paused: step == $p.steps[0] ? true : false,
      onComplete: () => {
        if (direction == 'forward') {
          if (!$isLastStep(step)) step = $getNextStep(step);
        }
        if (direction == 'backward') {
          if (step != $p.steps[0]) {
            step = $getPreviousStep(step);
          } else {
            step = $getNextStep(step);
          }
        }
        if (direction == 'repeat') {
          step = $p.steps[$p.steps.indexOf(step)];
        }
        if (direction == 'reset') {
          step = $p.steps[1];
        }
        direction = 'forward';
      },
    });
  }

  // Functions to control the animation
  function startAnimation() {
    // if (tl) {
    //   direction == 'reset';
    //   tl.progress(1);
    // } else step = $p.steps[1];
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

    // Load the geojson data
    $p.dataGeoJSON = await json(
      './data/unep_methanedata_detected_plumes.geojson'
    );
    const flareFeature = $p.dataGeoJSON['features'].find(
      (d) => d.properties.id_plume == $p.firstFlare.id_plume
    );
    $p.flarePath = flareFeature.geometry.coordinates[0][0];
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

    document.addEventListener('mousedown', () => {
      // Start measuring the time beginning with the mousedown event, until the mouseup event is fired
      mouseDownTime = Date.now();

      pauseAnimation();
    });
    document.addEventListener('mouseup', (event) => {
      // Treat the start widget like a click in the right half of the viewport
      const isStartWidget = event.target['classList'].contains('start-widget');

      // TBD: need to include that if clicking on the left half and 30% of the tl time has alread passed, the current step should be repeated instead of jumping to the previous step

      const mouseUpTime = Date.now();
      if (mouseUpTime - mouseDownTime < 500 || isStartWidget) {
        // Determine whether mouseup event too place in the left or the right half of the viewport
        const viewportWidth = window.innerWidth;
        const mouseUpX = event.clientX;
        if (mouseUpX < viewportWidth / 2) {
          // Get the percentage of current progress of the tl
          const progress = tl.progress();
          if (progress > 0.2) {
            // Repeat the current step
            direction = 'repeat';
          } else {
            // Skip to the previous step
            direction = 'backward';
          }
        } else {
          // Skip to the next step
          direction = 'forward';
        }
        if (tl) tl.progress(1);
      }
      resumeAnimation();
    });
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

  #main-view-container {
    position: relative;
  }

  #story-text-container {
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 5;
    padding: 20px;
  }
  .story-text {
    display: inline;
    background-color: #cacaca;
    border-radius: 5px;
    padding: 0px 0.5rem 0.2rem 0.5rem;
    color: #121212;
    font-weight: 700;
    box-decoration-break: clone; /* Ensure background and padding apply to each line */
    -webkit-box-decoration-break: clone; /* For WebKit browsers */
    line-height: 1.8;
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
    <div id="main-view-container">
      <Map {tl} {step} />
      <div id="story-text-container">
        <p class="story-text">This is a methane cloud.</p>
        <br />
        <br />
        <p class="story-text">
          It was produced when industrially generating oil and gas for energy
          generation.
        </p>
      </div>
    </div>
    <div>
      <button class="start-widget" on:click="{startAnimation}"
        >Start Animation</button
      >
      <!-- <button on:click={pauseAnimation}>Pause</button>
      <button on:click={resumeAnimation}>Resume</button> -->
    </div>
  {/if}
</div>

<!-- On mousedown on document, call pauseAnimation -->
