<script>
  import { p } from '../stores/p.js';
  import PingMarker from './PingMarker.svelte';

  export let tl;
  export let step;
  export let pingSVGNode;

  const scaleScreenPosition = (position) => {
    return position * 1; //$p.maxZoomFactor; // TODO: Not quite right yet
  };

  $: {
    if (step == 10) {
      // Animate in first flare
      tl.fromTo(
        `#marker-first`,
        {
          opacity: 1,
          r: 0,
        },
        {
          opacity: 0,
          r: 120,
          duration: 3,
          ease: 'power1.in',
        },
        0
      );
    }
    if (step == 20) {
      // Animate the circle opacity using GSAP
      $p.dataCSVAfterFirst.forEach((_, i) => {
        if (i < $p.dataCSVAfterFirst.length / 2) {
          tl.fromTo(
            `#marker-${i}`,
            {
              opacity: 1,
              r: 0,
            },
            {
              opacity: 0,
              r: 120 + 2 ** (i / 3000) * 500 - 500,
              duration: 1,
              delay: i * 0.0015, // Delay each circle reveal
              ease: 'power1.in',
            },
            0
          );
        }
      });
    }

    if (step == 30) {
      // Animate the circle opacity using GSAP
      $p.dataCSVAfterFirst.forEach((_, i) => {
        if (i > $p.dataCSVAfterFirst.length / 2) {
          // console.log('pinging');
          tl.fromTo(
            `#marker-${i}`,
            {
              opacity: 1,
              r: 0,
            },
            {
              opacity: 0,
              r: 520 + 2 ** (i / 3000) * 500 - 500,
              duration: 1,
              delay: i * 0.0015 - ($p.dataCSVAfterFirst.length / 2) * 0.0015, // Delay each circle reveal
              ease: 'power1.out',
            },
            0
          );
        }
      });
    }
  }
</script>

<svg
  bind:this="{pingSVGNode}"
  id="ping-svg"
  class="map-overlay"
  width="{$p.mapWidth * $p.maxZoomFactor}"
  height="{$p.mapHeight * $p.maxZoomFactor}"
  transform="translate({$p.mapWidth / 2 -
    ($p.mapWidth * $p.maxZoomFactor) / 2}, {$p.mapHeight / 2 -
    ($p.mapHeight * $p.maxZoomFactor) / 2})"
>
  {#if $p.map !== null}
    <PingMarker markerData="{$p.firstFlare}" idSuffix="first" />
    {#each $p.dataCSVAfterFirst as markerData, i}
      <PingMarker {markerData} idSuffix="{i}" />
    {/each}
  {/if}
</svg>
