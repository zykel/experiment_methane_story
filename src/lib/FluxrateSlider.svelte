<script>
  import { onMount } from 'svelte';
  import { p, filterFluxrate } from '../stores/p.js';
  import DoubleRangeSlider from './DoubleRangeSlider.svelte';
  import FluxrateLegendSVG from './FluxrateLegendSVG.svelte';

  let sliderStart;
  let sliderEnd;

  let labelLeft, labelRight;

  let isOverlapping = false;

  const fluxrateMax = $p.dataCSV.reduce(
    (acc, curr) => (curr.ch4_fluxrate > acc ? curr.ch4_fluxrate : acc),
    0
  );

  $: filterFluxrate.set([sliderStart * fluxrateMax, sliderEnd * fluxrateMax]);

  $: {
    sliderStart;
    sliderEnd;
    if (labelLeft && labelRight) {
      const bboxLeftDate = labelLeft.getBoundingClientRect();
      const bboxrightDate = labelRight.getBoundingClientRect();
      isOverlapping =
        bboxLeftDate.left + bboxLeftDate.width + 5 > bboxrightDate.left;
      // To capture strange reactivity behavior in the beginning
      if (labelLeft.innerText.includes('NaN') && !$p.portraitMode) {
        //TODO: dirty
        isOverlapping = false;
      }
    }
  }
</script>

<style>
  .legend-box {
    pointer-events: auto;
    border: 1px solid #ccc;
    background: #000000e6;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    min-width: 11rem;
    height: 160px;
    /* margin: auto; */
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
    bottom: -17px; /* Adjust this value as needed */
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 80px);
  }

  .both-labels-container {
    width: calc(100% - 80px);
    position: relative;
  }

  .label-container {
    position: absolute;
    bottom: -40px; /* Adjust this value as needed */
    pointer-events: none;
    user-select: none;
    font-size: 0.75rem;
    /* left: 0%; */
    /* transform: translateX(-50%); */
  }
</style>

<div class="legend-box">
  <div class="legend-title">emission rate</div>

  <div class="svg-and-slider-container">
    <FluxrateLegendSVG fluxrateMin="{0}" {fluxrateMax} />
    <div class="slider-container">
      <DoubleRangeSlider bind:start="{sliderStart}" bind:end="{sliderEnd}" />
    </div>
    <div class="both-labels-container">
      {#if $filterFluxrate.length == 2}
        <div
          bind:this="{labelLeft}"
          id="fluxrate-label-container-left"
          class="label-container left"
          style="
        {sliderStart < 0.5
            ? `left: calc(${sliderStart * 100}% + 40px)`
            : `right: calc(${100 - sliderStart * 100}% - 40px)`};
        transform: translate({sliderStart < 0.5 ? '-4' : '4'}px, 0px);
        "
        >
          {Math.round($filterFluxrate[0] / 1000)} [t/h]
        </div>
        <div
          bind:this="{labelRight}"
          id="fluxrate-label-container-right"
          class="label-container right"
          style="
        {sliderEnd < 0.5
            ? `left: calc(${sliderEnd * 100}% + 40px)`
            : `right: calc(${100 - sliderEnd * 100}% - 40px)`};
        transform: translate({sliderEnd < 0.5 ? '-4' : '4'}px, {isOverlapping
            ? '1rem'
            : '0px'})
        "
        >
          {Math.round($filterFluxrate[1] / 1000)} [t/h]
        </div>
      {/if}
    </div>
  </div>
</div>
