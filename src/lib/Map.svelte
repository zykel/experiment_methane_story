<script>
  import { p } from '../stores/p.js';
  import { select, zoomIdentity } from 'd3';
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import PingSVG from './PingSVG.svelte';

  export let tl;
  export let step;

  // let map; // Store the map instance
  let initialZoom;
  let targetZoom;

  let lonCenter = 54.2828085816237;
  let latCenter = 38.65034094375579;

  $: mapWidth = $p.mapWidth;
  $: mapHeight = $p.mapHeight;

  let pingSVGNode;

  const getSvgTransform = (zoom) => {
    return zoomIdentity.scale(2 ** (zoom - $p.targetZoomOverall));
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

    // Function to update the SVG transformation
    function updateSVGTransform() {
      select(pingSVGNode).attr('transform', getSvgTransform($p.map.getZoom()));
      // TODO: extract reactive zoom variable
      // $p.zoom = $p.map.getZoom();
    }

    // Add event listeners for move and zoom events
    // map.on('move', updateSVGTransform);
    $p.map.on('zoom', updateSVGTransform);

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
      if (step >= 10) {
        initialZoom = $p.initialZoomOverall;
        targetZoom = 5;
      }
      if (step >= 20) {
        initialZoom = 5;
        targetZoom = $p.targetZoomOverall;
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
    overflow: hidden;
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
  >
    <PingSVG bind:pingSVGNode {tl} {step} />
  </div>
</div>
