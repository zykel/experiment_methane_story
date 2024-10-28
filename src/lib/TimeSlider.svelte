<script>
  import { p, filterFluxrate, filterTime } from '../stores/p.js';
  import DoubleRangeSlider from './DoubleRangeSlider.svelte';
  import {
    scaleTime,
    scaleLinear,
    axisBottom,
    axisLeft,
    histogram,
    select,
  } from 'd3';

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

  let svg, x, histogramGenerator, bins, y;

  $: {
    if (svg) {
      // Get svg width and height
      const width = svg.clientWidth;
      const height = svg.clientHeight;

      x = scaleTime().domain([timestampMin, timestampMax]).range([0, width]);

      // Set the parameters for the histogram
      histogramGenerator = histogram()
        .value((d) => d.timestamp)
        .domain(x.domain())
        .thresholds(x.ticks(40)); // Adjust the number of bins

      bins = histogramGenerator($p.dataCSV);

      y = scaleLinear()
        .range([height, 0])
        .domain([0, Math.max(...bins.map((d) => d.length))]);
    }
  }
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

  svg {
    width: 100%;
    height: 40px;
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
    <svg bind:this="{svg}">
      {#if bins}
        {#each bins as bin}
          <rect
            x="{x(bin.x0)}"
            y="{y(bin.length)}"
            width="{x(bin.x1) - x(bin.x0) - 1}"
            height="{y(0) - y(bin.length)}"
            fill="white"
          ></rect>
        {/each}
      {/if}
    </svg>
    <div class="slider-container">
      <DoubleRangeSlider bind:start="{sliderStart}" bind:end="{sliderEnd}" />
    </div>
  </div>
</div>
