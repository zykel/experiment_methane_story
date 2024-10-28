<script>
  import { p } from '../stores/p.js';
  import { scaleTime, scaleLinear, histogram } from 'd3';

  export let timestampMin;
  export let timestampMax;
  export let filterTime;

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

      bins = histogramGenerator(
        $p.dataCSV.filter(
          (d) => d.timestamp >= $filterTime[0] && d.timestamp <= $filterTime[1]
        )
      );

      y = scaleLinear()
        .range([height, 0])
        .domain([0, Math.max(...bins.map((d) => d.length))]);
    }
  }
</script>

<style>
  svg {
    width: 100%;
    height: 40px;
  }
</style>

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
