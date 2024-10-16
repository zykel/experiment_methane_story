<script>
  import { p } from '../stores/p.js';
  import { range } from 'd3-array';
  export let tl;
  export let step;

  let gap = 4; // Gap between progress bars

  $: {
    if (step > 0) {
      // Animate the zoomObj
      tl.to(
        '#progress-bar-' + step,
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
    display: flex;
    justify-content: space-between;
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

<div class="progress-bars" style="gap: {gap}px">
  {#each $p.steps.slice(1, $p.steps.length) as s}
    <div
      class="progress-bar-container"
      style="width: {$p.mapWidth / 2 - gap / 2}px;"
    >
      <div class="progress-bar ghost" id="ghost-progress-bar-{s}"></div>
      <div
        class="progress-bar"
        id="progress-bar-{s}"
        style="width: {step <= s ? 0 : 100}%;"
      ></div>
    </div>
  {/each}
</div>
