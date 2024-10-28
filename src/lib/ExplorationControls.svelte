<script>
  import { p, isLastStep } from '../stores/p.js';
  import SectorSelector from './SectorSelector.svelte';
  import NotifiedSelector from './NotifiedSelector.svelte';
  import FluxrateSlider from './FluxrateSlider.svelte';
  import TimeSlider from './TimeSlider.svelte';
  export let step;

  const paddingSide = 20;
</script>

<style>
  button {
    margin: 10px;
    padding: 5px 10px;
  }

  #positioning-container {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: flex-end;
    pointer-events: none;
  }
  #exploration-controls-container {
    display: flex;
    align-items: center;
    background: #000000e6;
    height: 250px;
    pointer-events: all;
    transition: opacity 0.3s;
  }
</style>

<div
  id="positioning-container"
  style="width: {$p.mapWidth}px; height: {$p.mapHeight}px"
>
  <div
    id="exploration-controls-container"
    style="width: {$p.mapWidth -
      paddingSide * 2}px; padding: 0 {paddingSide}px 0 {paddingSide}px; 
      opacity: {$isLastStep(step) ? 1 : 0};"
  >
    <button class="restart-widget">Restart Story</button>
    <!-- Include a checkbox with one option for each sector in $p.sectors and all sectors initially selected -->
    <SectorSelector />
    <!-- <NotifiedSelector /> -->
    <TimeSlider />
    <FluxrateSlider />

    <!-- <button on:click={pauseAnimation}>Pause</button>
    <button on:click={resumeAnimation}>Resume</button> -->
  </div>
</div>
