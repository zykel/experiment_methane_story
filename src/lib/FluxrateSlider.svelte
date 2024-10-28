<script>
  import { p, filterFluxrate } from '../stores/p.js';
  import DoubleRangeSlider from './DoubleRangeSlider.svelte';

  let sliderStart;
  let sliderEnd;

  const fluxrateMax = $p.dataCSV.reduce(
    (acc, curr) => (curr.ch4_fluxrate > acc ? curr.ch4_fluxrate : acc),
    0
  );

  $: filterFluxrate.set([sliderStart * fluxrateMax, sliderEnd * fluxrateMax]);
</script>

<style>
  .legend-box {
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 15rem;
    height: 7rem;
    margin: auto;
  }

  .legend-title {
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 10px;
  }
</style>

<div class="legend-box">
  <div class="legend-title">Drag to filter by fluxrate</div>
  <DoubleRangeSlider bind:start="{sliderStart}" bind:end="{sliderEnd}" />
</div>
