<script>
  import { p, getDuration } from '../stores/p.js';
  import { area } from 'd3-shape';
  import PingMarker from './PingMarker.svelte';

  export let tl;
  export let step;
  export let pingSVGNode;

  $: reposition = (projection) => {
    return {
      x: projection.x + ($p.mapWidth * $p.maxZoomFactor) / 2 - $p.mapWidth / 2,
      y:
        projection.y + ($p.mapHeight * $p.maxZoomFactor) / 2 - $p.mapHeight / 2,
    };
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
          'stroke-width': 120 / 3,
          duration: 1,
          ease: 'power1.in',
          delay: 0.5,
        },
        0
      );
      tl.fromTo(
        `#flare-path`,
        {
          opacity: 0,
          scale: 0,
          transformOrigin: '0% 100%',
        },
        {
          opacity: 1,
          duration: 2,
          scale: 1,
          // transformOrigin: '50% 50%',
          ease: 'power1.inOut',
          delay: 0, //.5,
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
              r: 60 + 2 ** (i / 1000) * 1500 - 1500,
              'stroke-width': (60 + 2 ** (i / 1000) * 1500 - 1500) / 3,
              duration: 1,
              delay:
                i *
                (($getDuration(step) - 1) / ($p.dataCSVAfterFirst.length / 2)), // Delay each circle reveal
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
              r: 520 + 2 ** (i / 1000) * 1500 - 1500,
              'stroke-width': (520 + 2 ** (i / 1000) * 1500 - 1500) / 3,
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
    {@const flareProjectedPath = $p.flarePath.map((coords) => {
      const projection = $p.map.project(coords);
      const position = reposition(projection);
      return [position.x, position.y];
    })}
    <path
      id="flare-path"
      stroke="white"
      fill="red"
      opacity="0"
      d="{flareProjectedPath
        .map((point, index) => {
          const [x, y] = point;
          return index === 0 ? `M${x},${y}` : `L${x},${y}`;
        })
        .join(' ')}"
    ></path>
    {#each $p.dataCSVAfterFirst as markerData, i}
      <PingMarker {markerData} idSuffix="{i}" />
    {/each}
  {/if}
</svg>
