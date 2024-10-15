<script>
  import { p } from '../stores/p.js';
  import { select, csv, csvParse, zoomIdentity } from 'd3';
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox CSS
  import MapMarker from './MapMarker.svelte';
  import PingSVG from './PingSVG.svelte';

  export let tl;
  export let step;

  $: {
    if ($p.map !== null) {
      const deScaleScreenPosition = (position) => {
        return position / 2 ** ($p.initialZoomOverall - $p.targetZoomOverall);
      };

      // Create an SVG element and append it to the map container
      //   const svg = select($p.map.getCanvasContainer())
      const svg = select('#svg-map-container')
        .append('svg')
        .attr('id', 'ping-svg')
        .attr('class', 'map-overlay')
        .attr('width', $p.mapWidth)
        .attr('height', $p.mapHeight);

      $p.dataCSV.forEach((marker_data, i) => {
        const projection = $p.map.project([marker_data.lon, marker_data.lat]);
        const x = deScaleScreenPosition(projection.x) + $p.mapWidth / 2;
        const y = deScaleScreenPosition(projection.y) + $p.mapHeight / 2;
        svg
          .append('circle')
          .attr('id', `marker-${i}`)
          .attr('class', marker_data.country + '-marker')
          .attr('cx', x)
          .attr('cy', y)
          .attr('fill', 'red');
      });
    }
  }

  $: {
    if (step == 1) {
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

    if (step == 2) {
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
