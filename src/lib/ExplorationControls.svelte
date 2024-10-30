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
    padding-bottom: 40px;
    pointer-events: none;
  }

  @media (max-width: 400px) {
    #exploration-controls-container {
      padding-bottom: 0px;
    }
  }

  .portrait-exploration-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  #interaction-blocker {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    background: #000000;
  }
</style>

<div
  id="positioning-container"
  style="width: {$p.mapWidth}px; height: {$p.mapHeight}px"
>
  <div
    id="exploration-controls-container"
    style="width: {$p.mapWidth - paddingSide * 2}px; 
      padding-left: {paddingSide}px;
      padding-right: {paddingSide}px; 
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
      <SectorSelector />
      <TimeSlider />
      <FluxrateSlider />
    {/if}
    <!-- <RestartWidget /> -->

    <!-- <button on:click={pauseAnimation}>Pause</button>
    <button on:click={resumeAnimation}>Resume</button> -->
  </div>
  {#if !$p.portraitMode}
    <div
      id="square-restart-widget-container"
      style="opacity: {$isLastStep(step) ? 1 : 0};"
    >
      <RestartWidget />
    </div>
  {/if}
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
    width: {$p.mapWidth}px; 
    height: {$p.mapHeight}px; 
    display: {step == $p.explorationStep ? 'none' : 'block'};"
></div>
