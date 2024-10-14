<script>
  import { p } from '../stores/p.js';
  import { select, csv, csvParse } from 'd3';
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox CSS
  import MapMarker from './MapMarker.svelte';

  export let tl;
  export let step;

  let map; // Store the map instance
  let initialZoom = 15;
  let targetZoom;

  // Convert the array to a GeoJSON object
  $: circleData = {
    type: 'FeatureCollection',
    features: $p.dataCSV.map((d) => {
      // debugger
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [d.lon, d.lat],
        },
        properties: {},
      };
    }),
  };

  // Example GeoJSON data
  const geojsonData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [38, 50],
        },
        properties: {
          title: 'Point 1',
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [38.5, 50.5],
        },
        properties: {
          title: 'Point 2',
        },
      },
    ],
  };

  // Function to initialize the map
  onMount(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY; // Use your token here
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [54.01610983773737, 38.3918319439921], // Replace with your initial coordinates
      zoom: initialZoom,
    });

    // Add GeoJSON source
    map.on('load', () => {
      // map.addSource('points', {
      //   type: 'geojson',
      //   data: circleData
      // });

      //   //   Add a layer to display the points as circles
      // map.addLayer({
      //   id: 'points',
      //   type: 'circle',
      //   source: 'points',
      //   paint: {
      //     'circle-radius': 6,
      //     'circle-color': '#007cbf'
      //   }
      // });

      console.log('loading markers');
      // OPTION EXEX
      // const container = map.getCanvasContainer();
      //     const svg = select(container).append("svg")
      //         .attr('id', 'map-svg')
      //         .attr('class', 'map-svg');
      $p.dataCSV.forEach((marker_data) => {
        //     svg.append('circle')
        //         .attr('cx', marker_data.lon)
        //         .attr('cy', marker_data.lat)
        //         .attr('r', 5)
        //         .attr('fill', 'red')
        //         .attr('class', 'map-marker')
        //         .on('click', () => {
        //             console.log(marker_data);
        //         });
      });

      //     // OPTION Rudi
      $p.dataCSV.forEach((marker_data) => {
        const mark = document.createElement('div');

        new MapMarker({
          target: mark,
          props: { data: marker_data },
        });

        new mapboxgl.Marker({ element: mark })
          .setLngLat([marker_data.lon, marker_data.lat])
          .addTo(map);
      });
    });
  });

  $: {
    if (map && step > 0) {
      if (step >= 1) {
        initialZoom = 15;
        targetZoom = 5;
      }
      if (step >= 2) {
        initialZoom = 5;
        targetZoom = 2;
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
            map.setZoom(zoomObj.zoom);
          },
        },
        0
      );
    }
  }
</script>

<style>
  #map {
    width: 400px;
    height: 500px; /* Adjust as necessary */
  }
</style>

<div id="map"></div>
