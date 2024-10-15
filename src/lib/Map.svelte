<script>
  import { p } from '../stores/p.js';
  import { select, csv, csvParse, zoomIdentity } from 'd3';
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox CSS
  import MapMarker from './MapMarker.svelte';

  export let tl;
  export let step;

  // let map; // Store the map instance
  let initialZoom;
  let targetZoom;

  let lonCenter = 54.2828085816237;
  let latCenter = 38.65034094375579;

  $: mapWidth = $p.mapWidth;
  $: mapHeight = $p.mapHeight;

  const getSvgTransform = (zoom) => {
    return zoomIdentity.scale(2 ** (zoom - $p.targetZoomOverall));
  };

  const deScaleScreenPosition = (position) => {
    return position / 2 ** ($p.initialZoomOverall - $p.targetZoomOverall);
  };

  // Function to initialize the map
  onMount(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY; // Use your token here
    $p.map = new mapboxgl.Map({
      container: 'mapbox-map-container',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lonCenter, latCenter], // Replace with your initial coordinates
      zoom: $p.initialZoomOverall,
    });

    // Create an SVG element and append it to the map container
    const svg = select($p.map.getCanvasContainer())
      .append('svg')
      .attr('class', 'map-overlay')
      .attr('width', mapWidth)
      .attr('height', mapHeight);

    // Function to update the SVG transformation
    function updateSVGTransform() {
      svg.attr('transform', getSvgTransform($p.map.getZoom()));
    }

    // Add event listeners for move and zoom events
    // map.on('move', updateSVGTransform);
    $p.map.on('zoom', updateSVGTransform);

    // debugger;
    $p.dataCSV.forEach((marker_data, i) => {
      const projection = $p.map.project([marker_data.lon, marker_data.lat]);
      const x = deScaleScreenPosition(projection.x) + mapWidth / 2;
      const y = deScaleScreenPosition(projection.y) + mapHeight / 2;
      svg
        .append('circle')
        .attr('id', `marker-${i}`)
        .attr('class', marker_data.country + '-marker')
        .attr('cx', x)
        .attr('cy', y)
        .attr('fill', 'red');
    });

    // Initial transformation update
    updateSVGTransform();

    // Add GeoJSON source
    $p.map.on('load', () => {});
  });

  $: {
    if ($p.map && step > 0) {
      // const mue = map.querySourceFeatures({
      //   sourceLayer: 'points',
      //   filter: ['==', ['get', 'id'], 'point-1'],
      // });
      if (step >= 1) {
        initialZoom = $p.initialZoomOverall;
        targetZoom = 5;
      }
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
      if (step >= 2) {
        initialZoom = 5;
        targetZoom = $p.targetZoomOverall;
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

      // Create an object to hold zoom level and animate this instead of the map directly
      let zoomObj = { zoom: initialZoom };

      // Animate the zoomObj
      tl.to(
        zoomObj,
        {
          duration: $p.duration,
          zoom: targetZoom,
          ease: 'power1.inOut',
          onUpdate: () => {
            // Update the map's zoom level during the animation
            $p.map.setZoom(zoomObj.zoom);
          },
        },
        0
      );
    }
  }
</script>

<style>
  #map-container {
    position: relative;
  }

  #mapbox-map-container,
  #svg-map-container {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

<div id="map-container" style="width: {mapWidth}px; height: {mapHeight}px">
  <div
    id="mapbox-map-container"
    style="width: {mapWidth}px; height: {mapHeight}px"
  ></div>
  <div
    id="svg-map-container"
    style="width: {mapWidth}px; height: {mapHeight}px"
  ></div>
</div>
