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

<DoubleRangeSlider bind:start="{sliderStart}" bind:end="{sliderEnd}" />
