<script>
  import { p, filterFluxrate, filterTime } from '../stores/p.js';
  import DoubleRangeSlider from './DoubleRangeSlider.svelte';
  import TimeLegendSVG from './TimeLegendSVG.svelte';

  let sliderStart;
  let sliderEnd;

  // Get first and last date from $p.dataCSV d => d.timestamp
  const timestampMin = $p.dataCSV.reduce(
    (acc, curr) => (curr.timestamp < acc ? curr.timestamp : acc),
    Infinity
  );
  const timestampMax = $p.dataCSV.reduce(
    (acc, curr) => (curr.timestamp > acc ? curr.timestamp : acc),
    0
  );

  // Map from range [0, 1] to [dateMin, dateMax]
  $: filterTime.set([
    sliderStart * (timestampMax - timestampMin) + timestampMin,
    sliderEnd * (timestampMax - timestampMin) + timestampMin,
  ]);

  // const fluxrateMax = $p.dataCSV.reduce(
  //   (acc, curr) => (curr.ch4_fluxrate > acc ? curr.ch4_fluxrate : acc),
  //   0
  // );

  // $: filterFluxrate.set([sliderStart * fluxrateMax, sliderEnd * fluxrateMax]);

  // X axis: scale and draw

  // Apply the histogram function to data
</script>

<style>
  .legend-box {
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 15rem;
    margin: auto;
  }

  .legend-title {
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .svg-and-slider-container {
    position: relative;
  }

  .slider-container {
    position: absolute;
    bottom: -7px; /* Adjust this value as needed */
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }
</style>

<div class="legend-box">
  <div class="legend-title">Filter by date</div>
  <div class="svg-and-slider-container">
    <TimeLegendSVG {timestampMin} {timestampMax} {filterTime} />
    <div class="slider-container">
      <DoubleRangeSlider bind:start="{sliderStart}" bind:end="{sliderEnd}" />
    </div>
  </div>
</div>
