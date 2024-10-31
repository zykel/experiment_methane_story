<script>
  import { p, mapWidth } from '../stores/p.js';
  import { range } from 'd3-array';
  export let tl;
  export let step;

  const gap = 4; // Gap between progress bars
  const padding = 5; // Padding left and right
  const lastBarWidth = 16; // Width of the last bar
  const barWidth =
    ($mapWidth - ($p.nrSteps - 2) * gap - lastBarWidth - 2 * padding) /
    ($p.nrSteps - 2); // Width of the bars
  $: lastStep = $p.steps[$p.steps.length - 1]; // Last step

  $: {
    if (step > $p.steps[0]) {
      // Animate the zoomObj
      tl.fromTo(
        '#progress-bar-' + step,
        {
          width: '0%',
        },
        {
          width: '100%',
          ease: 'none',
        },
        0
      );
    }
  }
</script>

<style>
  .progress-bars {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
  }

  .progress-bar-container {
    position: relative;
    /* width: 198px; Adjust the width as needed */
    height: 4px; /* Adjust the height as needed */
    margin-bottom: 10px;
  }

  .progress-bar {
    border-radius: 2px;
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 4px;
    background-color: #bebebe;
  }

  .progress-bar.ghost {
    width: 100%;
    background-color: rgba(
      215,
      215,
      215,
      0.3
    ); /* Lighter color for ghost bar */
  }
</style>

<div class="progress-bars" style="gap: {gap}px; padding: {padding}px;">
  {#each $p.steps.slice(1, $p.nrSteps - 1) as s}
    <div class="progress-bar-container" style="width: {barWidth}px;">
      <div class="progress-bar ghost" id="ghost-progress-bar-{s}"></div>
      <div
        class="progress-bar"
        id="progress-bar-{s}"
        style="width: {step <= s ? 0 : 100}%;"
      ></div>
    </div>
  {/each}
  <div
    class="progress-bar-container last-step-container"
    style="width: {lastBarWidth}px; height: {lastBarWidth}px;"
  >
    <div
      class="progress-bar ghost"
      id="ghost-progress-bar-{lastStep}"
      style="height: {lastBarWidth}px;"
    ></div>
    <div
      class="progress-bar"
      id="progress-bar-{lastStep}"
      style="width: {step <= lastStep ? 0 : 100}%; height: {lastBarWidth}px;"
    ></div>
  </div>
</div>
