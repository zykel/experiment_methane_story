<script>
  import { p, getDuration, isLastStep } from '../stores/p.js';
  import { area } from 'd3-shape';
  import PingMarker from './PingMarker.svelte';
  import { get } from 'svelte/store';

  export let tl;
  export let step;
  export let pingSVGNode;

  $: maxFluxrate = $p.dataCSV.reduce(
    (acc, d) => Math.max(acc, d.ch4_fluxrate),
    0
  );

  $: reposition = (projection) => {
    return {
      x: projection.x + ($p.mapWidth * $p.maxZoomFactor) / 2 - $p.mapWidth / 2,
      y:
        projection.y + ($p.mapHeight * $p.maxZoomFactor) / 2 - $p.mapHeight / 2,
    };
  };

  $: getRadius = (i, fluxrate, initialZoom, targetZoom) => {
    return (
      200 *
      2 **
        ((i / ($p.dataCSVAfterFirst.length / 2)) * (initialZoom - targetZoom) +
          (Math.log2($p.maxZoomFactor) - initialZoom)) *
      (($p.minCircleRadius +
        (fluxrate / maxFluxrate) ** (1 / 2) *
          ($p.maxCircleRadius - $p.minCircleRadius)) /
        $p.maxCircleRadius)
    );
  };

  $: getStrokeWidth = (i, initialZoom, targetZoom) => {
    return (
      200 *
      2 **
        ((i / ($p.dataCSVAfterFirst.length / 2)) * (initialZoom - targetZoom) +
          (Math.log2($p.maxZoomFactor) - initialZoom)) *
      ($p.minCircleRadius / $p.maxCircleRadius)
    );
  };

  $: {
    if (step == 10) {
      // Animate in first flare
      tl.fromTo(
        `#marker-first`,
        {
          opacity: 1,
          'stroke-width': 0,
          r: 0,
        },
        {
          opacity: 0,
          r: 120,
          'stroke-width': 120 / 8,
          duration: 1,
          ease: 'power1.in',
          delay: 2,
        },
        0
      );
      // tl.fromTo(
      //   `#flare-path`,
      //   {
      //     opacity: 0,
      //     scale: 0,
      //     transformOrigin: '0% 100%',
      //   },
      //   {
      //     opacity: 1,
      //     duration: 2,
      //     scale: 1,
      //     // transformOrigin: '50% 50%',
      //     ease: 'power1.inOut',
      //     delay: 0, //.5,
      //   },
      //   0
      // );
    }
    if (step == 20) {
      // Animate the circle opacity using GSAP
      $p.dataCSVAfterFirst.forEach((d, i) => {
        if (i < $p.dataCSVAfterFirst.length / 2) {
          tl.fromTo(
            `#marker-${i}`,
            {
              opacity: 1,
              r: 0,
              'stroke-width': 0,
            },
            {
              opacity: 0,
              r: getRadius(i, d.ch4_fluxrate, $p.targetZoom10, $p.targetZoom20),
              // 'stroke-width': (60 + 2 ** (i / 1000) * 1500 - 1500) / 8,
              'stroke-width': getStrokeWidth(
                i,
                $p.targetZoom10,
                $p.targetZoom20
              ),
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
      // tl.fromTo(
      //   `#flare-path`,
      //   {
      //     opacity: 1,
      //   },
      //   {
      //     opacity: 0,
      //     duration: 2,
      //     ease: 'power1.inOut',
      //   },
      //   0
      // );
    }

    if (step == 30) {
      // Animate the circle opacity using GSAP
      $p.dataCSVAfterFirst.forEach((d, i) => {
        if (i > $p.dataCSVAfterFirst.length / 2) {
          // console.log('pinging');
          // debugger;
          const radius = getRadius(
            i - $p.dataCSVAfterFirst.length / 2,
            d.ch4_fluxrate,
            $p.targetZoom20,
            $p.targetZoomOverall
          );
          // const strokeWidth = (520 + 2 ** (i / 1000) * 1500 - 1500) / 8;

          const strokeWidth = getStrokeWidth(
            i - $p.dataCSVAfterFirst.length / 2,
            $p.targetZoom20,
            $p.targetZoomOverall
          );
          // console.log(radius);
          // console.log(strokeWidth);
          tl.fromTo(
            `#marker-${i}`,
            {
              opacity: 1,
              r: 0,
              'stroke-width': 0,
            },
            {
              opacity: 0,
              r: radius,
              'stroke-width': strokeWidth,
              duration: 1,
              delay:
                (i - $p.dataCSVAfterFirst.length / 2) *
                (($getDuration(step) - 1) / ($p.dataCSVAfterFirst.length / 2)), // Delay each circle reveal
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
      stroke-width="3"
      fill="{$p.sectorColors[$p.firstFlare.sector]}"
      opacity="{$isLastStep(step) ? 0 : 1}"
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
