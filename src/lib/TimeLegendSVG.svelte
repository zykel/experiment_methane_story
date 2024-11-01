<script>
  import { p, sectorsSelected, filterFluxrate } from '../stores/p.js';
  import { scaleTime, scaleLinear, histogram } from 'd3';

  export let timestampMin;
  export let timestampMax;
  export let filterTime;

  let svg, x, histogramGenerator, binsInside, binsOutside, combinedBins, y;

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

      const insideFilter = (d) =>
        d.timestamp >= $filterTime[0] &&
        d.timestamp <= $filterTime[1] &&
        d.ch4_fluxrate >= $filterFluxrate[0] &&
        d.ch4_fluxrate <= $filterFluxrate[1] &&
        $sectorsSelected.includes(d.sector);

      // Filter data into two subsets
      const dataInside = $p.dataCSV.filter(insideFilter);
      const dataOutside = $p.dataCSV.filter((d) => !insideFilter(d));

      // Apply the histogram function to data
      binsInside = histogramGenerator(dataInside);
      binsOutside = histogramGenerator(dataOutside);

      // Combine bins for stacking
      combinedBins = binsInside.map((bin, i) => ({
        x0: bin.x0,
        x1: bin.x1,
        inside: bin.length,
        outside: binsOutside[i] ? binsOutside[i].length : 0,
      }));

      // Y axis: scale and draw
      y = scaleLinear()
        .range([height, 0])
        .domain([
          0,
          Math.max(...combinedBins.map((d) => d.inside + d.outside)),
        ]);
    }
  }
</script>

<style>
  svg {
    width: 100%;
  }
</style>

<svg
  bind:this="{svg}"
  style="
height: {$p.portraitMode ? 30 : 92}px"
>
  {#if binsInside && binsInside}
    <text fill="gray" x="{x.range()[0]}" y="{y(300) - 4}" font-size="0.8rem"
      >300</text
    >
    <line
      x1="{x.range()[0]}"
      x2="{x.range()[1]}"
      y1="{y(300)}"
      y2="{y(300)}"
      stroke="#414141"
      stroke-width="1"
    ></line>
    {#each binsInside as bin, i}
      <rect
        x="{x(bin.x0)}"
        y="{y(bin.length)}"
        width="{x(bin.x1) - x(bin.x0) < 1
          ? x(bin.x1) - x(bin.x0)
          : x(bin.x1) - x(bin.x0) - 1}"
        height="{y(0) - y(bin.length)}"
        fill="rgb(220,220,220)"
      ></rect>
      <rect
        x="{x(binsOutside[i].x0)}"
        y="{y(bin.length + binsOutside[i].length)}"
        width="{x(binsOutside[i].x1) - x(binsOutside[i].x0) < 1
          ? x(binsOutside[i].x1) - x(binsOutside[i].x0)
          : x(binsOutside[i].x1) - x(binsOutside[i].x0) - 1}"
        height="{y(bin.length) - y(bin.length + binsOutside[i].length)}"
        fill="#414141"
      ></rect>
    {/each}
  {/if}
</svg>
