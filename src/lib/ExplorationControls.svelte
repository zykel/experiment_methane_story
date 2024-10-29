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
    pointer-events: all;
    transition: opacity 0.3s;
  }

  .restart-widget {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition:
      background-color 0.2s,
      transform 0.2s;
  }

  .restart-widget:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  .restart-widget:active {
    background-color: #004494;
    transform: scale(1);
  }

  .restart-widget svg {
    margin-right: 8px;
    width: 20px;
    height: 20px;
    fill: white;
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
      height: {$p.mapHeight / 2.5}px;
      opacity: {$isLastStep(step) ? 1 : 0};"
  >
    <button class="restart-widget">
      Restart Story
      <svg viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2z"></path>
        <path d="M13 0h-2v8h2z"></path>
      </svg>
    </button>
    <!-- Include a checkbox with one option for each sector in $p.sectors and all sectors initially selected -->
    <SectorSelector />
    <!-- <NotifiedSelector /> -->
    <TimeSlider />
    <FluxrateSlider />

    <!-- <button on:click={pauseAnimation}>Pause</button>
    <button on:click={resumeAnimation}>Resume</button> -->
  </div>
</div>
