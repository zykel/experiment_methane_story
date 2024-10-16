<script>
  import { p } from '../stores/p.js';

  export let tl;
  export let step;
  export let pingSVGNode;

  const deScaleScreenPosition = (position) => {
    return position / 2 ** ($p.initialZoomOverall - $p.targetZoomOverall);
  };

  $: {
    if (step == 10) {
      // Animate the circle opacity using GSAP
      $p.dataCSV.forEach((_, i) => {
        if (i < $p.dataCSV.length / 2) {
          tl.fromTo(
            `#marker-${i}`,
            {
              opacity: 1,
              r: 0,
            },
            {
              opacity: 0,
              r: 0.2 + (i / 6000) * 10,
              duration: 1,
              delay: i * 0.0015, // Delay each circle reveal
              ease: 'power1.in',
            },
            0
          );
        }
      });
    }

    if (step == 20) {
      // Animate the circle opacity using GSAP
      $p.dataCSV.forEach((_, i) => {
        if (i > $p.dataCSV.length / 2) {
          // console.log('pinging');
          tl.fromTo(
            `#marker-${i}`,
            {
              opacity: 1,
              r: 0,
            },
            {
              opacity: 0,
              r: 0.2 + (i / 6000) * 10,
              duration: 1,
              delay: i * 0.0015 - ($p.dataCSV.length / 2) * 0.0015, // Delay each circle reveal
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
  width="{$p.mapWidth}"
  height="{$p.mapHeight}"
>
  {#if $p.map !== null}
    {#each $p.dataCSV as marker_data, i}
      {@const projection = $p.map.project([marker_data.lon, marker_data.lat])}
      <circle
        id="{`marker-${i}`}"
        class="{marker_data.country + '-marker'}"
        cx="{deScaleScreenPosition(projection.x) + $p.mapWidth / 2}"
        cy="{deScaleScreenPosition(projection.y) + $p.mapHeight / 2}"
        fill="red"
      ></circle>
    {/each}
  {/if}
</svg>
