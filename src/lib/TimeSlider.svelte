<script>
  import { p, filterFluxrate, filterTime } from '../stores/p.js';
  import DoubleRangeSlider from './DoubleRangeSlider.svelte';

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
</script>

<DoubleRangeSlider bind:start="{sliderStart}" bind:end="{sliderEnd}" />
