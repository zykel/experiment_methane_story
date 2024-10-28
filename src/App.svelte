<script>
  import {
    p,
    getNextStep,
    getPreviousStep,
    isLastStep,
    getDurationWithBuffer,
  } from './stores/p.js';
  import { onMount } from 'svelte';
  import Map from './lib/Map.svelte';
  import ProgressBars from './lib/ProgressBars.svelte';
  import StoryText from './lib/StoryText.svelte';
  import ExplorationControls from './lib/ExplorationControls.svelte';
  import Intro from './lib/Intro.svelte';
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
      defaults: { duration: $getDurationWithBuffer(step) },
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
    $p.dataCSV = dataCSVUnsorted
      .map((d) => {
        return {
          ...d,
          timestamp: new Date(d.tile_date).getTime(),
          lon: +d.lon,
          lat: +d.lat,
          wind_u: +d.wind_u,
          wind_v: +d.wind_v,
          ch4_fluxrate: +d.ch4_fluxrate,
          ch4_fluxrate_std: +d.ch4_fluxrate_std,
        };
      })
      .sort(function (a, b) {
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
    console.log($p.firstFlare);
    // Filter $p.dataCSV to only include flares after the first flare
    const indexOfFirstFlare = $p.dataCSV.findIndex(
      (d) => d.id_plume == $p.firstFlare.id_plume
    );
    console.log('First flare', indexOfFirstFlare);
    // debugger;
    $p.dataCSVAfterFirst = $p.dataCSV.slice(indexOfFirstFlare + 1);

    // Load the geojson data
    $p.dataGeoJSON = await json(
      './data/unep_methanedata_detected_plumes.geojson'
    );
    const flareFeature = $p.dataGeoJSON['features'].find(
      (d) => d.properties.id_plume == $p.firstFlare.id_plume
    );
    $p.flareGeometry = flareFeature.geometry;
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
      const isRestartWidget =
        event.target['classList'].contains('restart-widget');
      if (isRestartWidget) {
        direction = 'forward';
        step = $p.steps[1];
        return;
      }

      if (step == $p.explorationStep) {
        // In the exploration step, navigation should be deactivated
        tl.progress(1);
        return;
      }

      // TBD: need to include that if clicking on the left half and 30% of the tl time has alread passed, the current step should be repeated instead of jumping to the previous step

      const mouseUpTime = Date.now();
      if (mouseUpTime - mouseDownTime < 380) {
        // Determine whether mouseup event too place in the left or the right section of the viewport
        const viewportWidth = window.innerWidth;
        const mouseUpX = event.clientX;
        // Split at a third of the map from the left
        if (mouseUpX < viewportWidth / 2 - $p.mapWidth / 6) {
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
    overflow: hidden;
  }

  :global(body) {
    background-color: #121212; /* Dark background color */
    color: #ffffff; /* Light text color for contrast */
  }
</style>

<div id="story-content">
  {#if $p.dataCSV.length > 0}
    <div
      id="main-view-container"
      style="
    border-radius: {$p.portraitMode ? 0 : 10}px;"
    >
      <Map {tl} {step} />
      <StoryText {tl} {step} />
      <ExplorationControls {step} />
      <ProgressBars {tl} {step} />
      <Intro {step} />
    </div>
  {/if}
</div>

<!-- On mousedown on document, call pauseAnimation -->
