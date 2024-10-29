<script>
  import { p, isLastStep } from '../stores/p.js';
  import SectorSelector from './SectorSelector.svelte';
  import NotifiedSelector from './NotifiedSelector.svelte';
  import FluxrateSlider from './FluxrateSlider.svelte';
  import TimeSlider from './TimeSlider.svelte';
  import RestartWidget from './RestartWidget.svelte';

  export let step;

  const paddingSide = 20;
</script>

<style>
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
    justify-content: space-around;
    gap: 10px;
    background: #000000e6;
    pointer-events: all;
    transition: opacity 0.3s;
  }

  .portrait-exploration-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
</style>

<div
  id="positioning-container"
  style="width: {$p.mapWidth}px; height: {$p.mapHeight}px"
>
  <div
    id="exploration-controls-container"
    style="width: {$p.mapWidth -
      paddingSide * 2}px; padding: 30px {paddingSide}px {30}px {paddingSide}px; 
      height: {$p.portraitMode ? 340 : 230}px;
      {$p.portraitMode ? 'align-items: flex-start;' : 'align-items: flex-end;'}
      opacity: {$isLastStep(step) ? 1 : 0};"
  >
    <!-- Include a checkbox with one option for each sector in $p.sectors and all sectors initially selected -->
    {#if $p.portraitMode}
      <div
        id="portrait-left-exploration-container"
        class="portrait-exploration-container"
      >
        <TimeSlider />
        <SectorSelector />
      </div>
      <div
        id="portrait-right-exploration-container"
        class="portrait-exploration-container"
      >
        <FluxrateSlider />
        <RestartWidget />
      </div>
    {:else}
      <TimeSlider />
      <SectorSelector />
      <FluxrateSlider />
    {/if}
    <!-- <RestartWidget /> -->

    <!-- <button on:click={pauseAnimation}>Pause</button>
    <button on:click={resumeAnimation}>Resume</button> -->
  </div>
</div>
