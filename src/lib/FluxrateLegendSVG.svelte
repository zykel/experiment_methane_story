<script>
  import { p, sectorsSelected, filterFluxrate } from '../stores/p.js';
  import { scaleTime, scaleLinear, scaleSqrt, histogram } from 'd3';

  export let fluxrateMin;
  export let fluxrateMax;

  let svg, x1, x2, y, r1, r2, pathData;

  $: {
    if (svg) {
      // Get svg width and height
      const width = svg.clientWidth;
      const height = svg.clientHeight;

      const xScale = scaleLinear()
        .domain([fluxrateMin, fluxrateMax])
        .range([41, width - 41]);

      const rScale = scaleSqrt()
        .domain([fluxrateMin, fluxrateMax])
        .range([2, 40]);

      x1 = xScale($filterFluxrate[0]);
      y = height / 2;
      x2 = xScale($filterFluxrate[1]);
      r1 = rScale($filterFluxrate[0]);
      r2 = rScale($filterFluxrate[1]);

      // Calculate the distance and angle
      const d = x2 - x1;
      const theta = Math.asin((r2 - r1) / d);

      // Calculate tangent points
      const x1TopTangentX = x1 + r1 * Math.sin(theta);
      const x1TopTangentY = y - r1 * Math.cos(theta);
      const x1BottomTangentX = x1 + r1 * Math.sin(theta);
      const x1BottomTangentY = y + r1 * Math.cos(theta);

      const x2TopTangentX = x2 - r2 * Math.sin(theta);
      const x2TopTangentY = y - r2 * Math.cos(theta);
      const x2BottomTangentX = x2 - r2 * Math.sin(theta);
      const x2BottomTangentY = y + r2 * Math.cos(theta);

      // SVG path string using template literals
      pathData = `
        M ${x1TopTangentX},${x1TopTangentY}
        A ${r1},${r1} 0 1,0 ${x1BottomTangentX},${x1BottomTangentY}
        L ${x2BottomTangentX},${x2BottomTangentY}
        A ${r2},${r2} 0 1,0 ${x2TopTangentX},${x2TopTangentY}
        L ${x1TopTangentX},${x1TopTangentY}
        Z
      `;
    }
  }
</script>

<style>
  svg {
    width: 100%;
    height: 82px;
  }
</style>

<svg bind:this="{svg}">
  <!-- <path d="{pathData}" fill="black" stroke="white" stroke-width="1"></path> -->
  {#if y}
    <line
      {x1}
      y1="{y + r1}"
      {x2}
      y2="{y + r2}"
      stroke="gray"
      stroke-width="2"
      stroke-dasharray="5,5"
    ></line>
    <line
      {x1}
      y1="{y - r1}"
      {x2}
      y2="{y - r2}"
      stroke="gray"
      stroke-width="2"
      stroke-dasharray="5,5"
    ></line>
    <circle
      cx="{x1}"
      cy="{y}"
      r="{r1}"
      fill="none"
      stroke="white"
      stroke-width="2"
    ></circle>
    <circle
      cx="{x2}"
      cy="{y}"
      r="{r2}"
      fill="none"
      stroke="white"
      stroke-width="2"
    ></circle>
  {/if}
</svg>
