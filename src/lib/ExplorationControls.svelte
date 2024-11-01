<script>
  import { p, isLastStep, mapWidth, mapHeight } from '../stores/p.js';
  import SectorSelector from './SectorSelector.svelte';
  import NotifiedSelector from './NotifiedSelector.svelte';
  import FluxrateSlider from './FluxrateSlider.svelte';
  import TimeSlider from './TimeSlider.svelte';
  import RestartWidget from './RestartWidget.svelte';

  export let step;

  const paddingSide = 10;
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

  #square-restart-widget-container {
    pointer-events: auto;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 15px);
    transition: opacity 0.3s;
  }

  #dataset-link-container {
    pointer-events: auto;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background: #000000;
    border: 1px solid #ccc;
    padding: 0px 5px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 5px;
    margin-bottom: 8px;
    transition: opacity 0.3s;
  }

  #dataset-link {
    color: #ffffff;
  }

  #dataset-link:hover {
    color: #007bff; /* Hover color */
  }

  #exploration-controls-container {
    display: flex;
    /* justify-content: space-around; */
    justify-content: center;
    gap: 10px;
    /* background: #000000e6; */
    pointer-events: all;
    transition: opacity 0.3s;
    margin-left: auto;
    margin-right: auto;
    pointer-events: none;
  }

  .portrait-exploration-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  #interaction-blocker {
    position: absolute;
    top: 0;
    left: 0;
    background: #2f2f2f;
    user-select: none;
  }
</style>

<div
  id="positioning-container"
  style="width: {$mapWidth}px; height: {$mapHeight}px"
>
  <div
    id="exploration-controls-container"
    style="width: {$p.portraitMode
      ? 'calc(13rem + 8rem + 10px + 40px)'
      : $mapWidth - paddingSide * 2 + 'px'}; 
      min-width: {$p.portraitMode
      ? 'calc(13rem + 8rem + 10px + 40px)'
      : $mapWidth - paddingSide * 2 + 'px'}; 
      height: {$p.portraitMode ? 350 : 230}px;
      {$p.portraitMode ? 'flex-direction: column;' : 'align-items: center;'}
      opacity: {$isLastStep(step) ? 1 : 0};
      padding-bottom: {$p.portraitMode ? 15 : 35}px;"
  >
    <!-- Include a checkbox with one option for each sector in $p.sectors and all sectors initially selected -->
    {#if $p.portraitMode}
      <div
        id="portrait-top-exploration-container"
        class="portrait-exploration-container"
      >
        <SectorSelector />
        <FluxrateSlider />
      </div>
      <div
        id="portrait-bottom-exploration-container"
        class="portrait-exploration-container"
      >
        <TimeSlider />
        <!-- <RestartWidget /> -->
      </div>
    {:else}
      <SectorSelector />
      <TimeSlider />
      <FluxrateSlider />
    {/if}
    <!-- <RestartWidget /> -->

    <!-- <button on:click={pauseAnimation}>Pause</button>
    <button on:click={resumeAnimation}>Resume</button> -->
  </div>
  <div
    id="square-restart-widget-container"
    style="opacity: {$isLastStep(step) ? 1 : 0};"
  >
    <RestartWidget />
  </div>
  <div
    id="dataset-link-container"
    style="opacity: {$isLastStep(step) ? 1 : 0};"
  >
    <a
      id="dataset-link"
      target="_blank"
      rel="noopener noreferrer"
      href="https://methanedata.unep.org/plumemap">Link to data set</a
    >
  </div>
</div>
<div
  id="interaction-blocker"
  style="
    width: {$mapWidth}px; 
    height: {$mapHeight}px; 
    display: {step == $p.explorationStep ? 'none' : 'block'};"
></div>
