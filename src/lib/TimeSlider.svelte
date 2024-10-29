<script>
  import { p, filterFluxrate, filterTime } from '../stores/p.js';
  import DoubleRangeSlider from './DoubleRangeSlider.svelte';
  import TimeLegendSVG from './TimeLegendSVG.svelte';

  let sliderStart;
  let sliderEnd;

  let leftDate, rightDate;

  let isOverlapping = false;

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

  $: {
    sliderStart;
    sliderEnd;
    if (leftDate && rightDate) {
      const bboxLeftDate = leftDate.getBoundingClientRect();
      const bboxrightDate = rightDate.getBoundingClientRect();
      isOverlapping =
        bboxLeftDate.left + bboxLeftDate.width + 5 > bboxrightDate.left;
      // To capture strange reactivity behavior in the beginning
      if (leftDate.innerText.includes('Invalid Date')) isOverlapping = false;
    }
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
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

  .date-label-container {
    position: absolute;
    bottom: -30px; /* Adjust this value as needed */
    pointer-events: none;
    user-select: none;
    font-size: 0.75rem;
    /* left: 0%; */
    /* transform: translateX(-50%); */
  }

  .date-label-container.left {
    /* transform: translate(-8px, 0px); */
  }

  .date-label-container.right {
    /* transform: translate(8px, 0px); */ /* Done dynamically below */
  }
</style>

<div class="legend-box">
  <div class="legend-title">date</div>
  <div class="svg-and-slider-container">
    <TimeLegendSVG {timestampMin} {timestampMax} {filterTime} />
    <div class="slider-container">
      <DoubleRangeSlider bind:start="{sliderStart}" bind:end="{sliderEnd}" />
    </div>
    <div
      bind:this="{leftDate}"
      id="date-label-container-left"
      class="date-label-container left"
      style="
        {sliderStart < 0.5
        ? `left: ${sliderStart * 100}%`
        : `right: ${100 - sliderStart * 100}%`};
        transform: translate({sliderStart < 0.5 ? '-8' : '8'}px, 0px);
        "
    >
      {formatDate($filterTime[0])}
    </div>
    <div
      bind:this="{rightDate}"
      id="date-label-container-right"
      class="date-label-container right"
      style="
        {sliderEnd < 0.5
        ? `left: ${sliderEnd * 100}%`
        : `right: ${100 - sliderEnd * 100}%`};
        transform: translate({sliderEnd < 0.5 ? '-8' : '8'}px, {isOverlapping
        ? '1rem'
        : '0px'})
        "
    >
      {formatDate($filterTime[1])}
    </div>
  </div>
</div>
