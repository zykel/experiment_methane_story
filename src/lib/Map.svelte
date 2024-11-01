<script>
  import {
    p,
    sectorsSelected,
    notifiedSelected,
    filterFluxrate,
    filterTime,
    getDuration,
    isLastStep,
    mapWidth,
    mapHeight,
  } from '../stores/p.js';
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
  let ease = 'power1.inOut';

  let lonCenter = $p.firstFlare.lon; //54.2828085816237;
  let latCenter = $p.firstFlare.lat; //38.65034094375579;

  $: dx = $mapWidth / 2 - ($mapWidth * $p.maxZoomFactor) / 2;
  $: dy = $mapHeight / 2 - ($mapHeight * $p.maxZoomFactor) / 2;

  let pingSVGNode;

  $: adjustZoomToScreensize = (zoom) => {
    if ($mapHeight <= 0) return zoom;
    let newZoom = zoom - Math.log2(800 / $mapHeight);
    newZoom = newZoom < 0 ? 0 : newZoom;
    newZoom = newZoom > 22 ? 22 : newZoom;
    return newZoom;
  };

  $: getSvgTransform = (zoom) => {
    const scale =
      1 / 2 ** Math.abs(zoom - adjustZoomToScreensize($p.minimalZoomOverall));
    return `translate(${dx}px,${dy}px) scale(${scale})`;
  };

  const doLogError = (message) => {
    const errorLog = document.getElementById('error-log');
    errorLog.textContent = errorLog.textContent + '-----' + message;
  };

  // Function to initialize the map
  onMount(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY; // Use your token here
    $p.map = new mapboxgl.Map({
      container: 'mapbox-map-container',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lonCenter, latCenter], // Replace with your initial coordinates
      zoom: adjustZoomToScreensize($p.minimalZoomOverall),
    });

    // Function to update the SVG transformation
    function updateSVGTransform() {
      select(pingSVGNode).style('transform', getSvgTransform($p.map.getZoom()));
      // TODO: extract reactive zoom variable
      // $p.zoom = $p.map.getZoom();
    }

    // Add event listeners for move and zoom events
    // map.on('move', updateSVGTransform);
    $p.map.on('zoom', updateSVGTransform);

    // Add GeoJSON source
    $p.map.on('load', () => {
      // timeout for 0.5 seconds
      $p.map.setZoom(adjustZoomToScreensize($p.initialZoomOverall));
      // Initial transformation update
      updateSVGTransform();
      document.getElementById('interaction-blocker').style.opacity = '0';
      // Add a source for the positions of the points inside $p.dataCSV, including the property ch4_fluxrate to use it for the size of the merkers later on
      doLogError('LOGGING AT POSITION 1');
      $p.map.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: $p.dataCSV.map((d) => {
            return {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [d.lon, d.lat],
              },
              properties: {
                ch4_fluxrate: d.ch4_fluxrate,
                sector: d.sector,
                tile_date: d.tile_date,
                ch4_fluxrate_std: d.ch4_fluxrate_std,
                notified: d.notified,
                timestamp: d.timestamp,
              },
            };
          }),
        },
      });
      doLogError('LOGGING AT POSITION 2');
      // Add a layer for the points with the point color depending on the sector
      $p.map.addLayer({
        id: 'points',
        type: 'circle',
        source: 'points',
        paint: {
          // Color
          'circle-color': 'transparent', // Make the circle fill transparent
          'circle-stroke-color': [
            'match',
            ['get', 'sector'],
            'Waste',
            $p.sectorColors['Waste'],
            'Coal',
            $p.sectorColors['Coal'],
            'Oil and Gas',
            $p.sectorColors['Oil and Gas'],
            '#000000',
          ],
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['sqrt', ['get', 'ch4_fluxrate']],
            0,
            $p.minCircleRadius,
            Math.sqrt(
              $p.dataCSV.reduce((acc, d) => Math.max(acc, d.ch4_fluxrate), 0)
            ),
            $p.maxCircleRadius,
          ],
        },
        // layout: {
        //   visibility: 'none', // Initially hide the layer
        // },
      });

      doLogError('LOGGING AT POSITION 3');
      // Update the layer filter whenever selectedSectors or ch4Range changes
      function updateFilter() {
        $p.map.setFilter('points', [
          'all',
          ['in', ['get', 'sector'], ['literal', $sectorsSelected]],
          // ['in', ['get', 'notified'], ['literal', $notifiedSelected]],
          ['>=', ['get', 'ch4_fluxrate'], $filterFluxrate[0]],
          ['<=', ['get', 'ch4_fluxrate'], $filterFluxrate[1]],
          ['>=', ['get', 'timestamp'], $filterTime[0]],
          ['<=', ['get', 'timestamp'], $filterTime[1]],
        ]);
      }

      doLogError('LOGGING AT POSITION 4');
      sectorsSelected.subscribe(updateFilter);
      // notifiedSelected.subscribe(updateFilter);
      filterFluxrate.subscribe(updateFilter);
      filterTime.subscribe(updateFilter);

      // Add event listeners for hover
      $p.map.on('mouseenter', 'points', (e) => {
        // $p.map.getCanvas().style.cursor = 'pointer';
      });

      $p.map.on('mouseleave', 'points', () => {
        // $p.map.getCanvas().style.cursor = '';
        // hoveredFeature.set(null);
      });
    });
  });

  $: {
    if ($p.map && step > $p.steps[0]) {
      doLogError('LOGGING AT POSITION 5');
      if (step == $p.steps[1]) {
        // Reset the zoom level
        $p.map.setZoom(adjustZoomToScreensize($p.initialZoomOverall));
      }
      if (step == 2) {
        // Setup where to zoom to
        initialZoom = $p.initialZoomOverall;
        targetZoom = $p.initialZoomOverall + 0.5;
        // ease = 'power1.inOut';
      }
      if (step == 5) {
        // Setup where to zoom to
        initialZoom = $p.initialZoomOverall + 0.5;
        targetZoom = $p.minimalZoomOverall;
        // ease = 'power1.inOut';
      }
      if (step == 10) {
        // Setup where to zoom to
        initialZoom = $p.minimalZoomOverall;
        targetZoom = $p.targetZoom10;
        // ease = 'power1.inOut';
      }
      if (step == 20) {
        // Setup where to zoom to
        initialZoom = $p.targetZoom10;
        targetZoom = $p.targetZoom20;
        // ease = 'power1.inOut';
      }
      if (step == 30) {
        // Setup where to zoom to
        initialZoom = $p.targetZoom20;
        targetZoom = $p.targetZoomOverall;
        // ease = 'power1.inOut';
      }

      if ([2, 5, 10, 20, 30].includes(step)) {
        // Perform the actual zoom
        // Create an object to hold zoom level and animate this instead of the map directly
        let zoomObj = { zoom: adjustZoomToScreensize(initialZoom) };

        // Reset map center to the initial position
        $p.map.setCenter([lonCenter, latCenter]);

        // Animate the zoomObj
        tl.to(
          zoomObj,
          {
            duration: $getDuration(step),
            zoom: adjustZoomToScreensize(targetZoom),
            ease: ease, // TODO: Check if inout easing is not actually nicer
            onUpdate: () => {
              // Update the map's zoom level during the animation
              $p.map.setZoom(zoomObj.zoom);
            },
          },
          0
        );
      }

      if (step == 50) {
        const opacityObj = { opacity: 0 };
        const targetOpacity = 0.5;
        tl.to(
          opacityObj,
          {
            duration: 2,
            opacity: targetOpacity,
            ease: ease,
            onUpdate: () => {
              // Update the circle opacity
              $p.map.setPaintProperty(
                'points',
                'circle-stroke-opacity',
                opacityObj.opacity
              );
            },
          },
          0
        );
      } else if (step == 60) {
        $p.map.setPaintProperty('points', 'circle-stroke-opacity', 0.5);
      } else if (step < 50) {
        $p.map.setPaintProperty('points', 'circle-stroke-opacity', 0);
      }
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
  #svg-map-container {
    overflow: hidden;
    pointer-events: none;
  }
</style>

<div id="map-container" style="width: {$mapWidth}px; height: {$mapHeight}px">
  <div
    id="mapbox-map-container"
    style="width: {$mapWidth}px; height: {$mapHeight}px"
  ></div>
  <div
    id="svg-map-container"
    style="width: {$mapWidth}px; height: {$mapHeight}px"
  >
    <PingSVG bind:pingSVGNode {tl} {step} />
  </div>
</div>
