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

  let map; // Store the map instance
  let initialZoomOverall = 10;
  let targetZoomOverall = 2;
  let initialZoom;
  let targetZoom;

  let mapWidth = 400;
  let mapHeight = 500;

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
  // $: circleData = $p.dataCSV.map((d) => ({
  //   type: 'Feature',
  //   geometry: {
  //     type: 'Point',
  //     coordinates: [d.lon, d.lat],
  //   },
  //   properties: {},
  // }));

  const getSvgTransform = (zoom) => {
    return zoomIdentity.scale(2 ** (zoom - targetZoomOverall));
  };

  // Function to initialize the map
  onMount(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY; // Use your token here
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [54.01610983773737, 38.3918319439921], // Replace with your initial coordinates
      zoom: initialZoomOverall,
    });

    // Create an SVG element and append it to the map container
    const svg = select(map.getCanvasContainer())
      .append('svg')
      .attr('class', 'map-overlay')
      .attr('width', mapWidth)
      .attr('height', mapHeight);

    // Function to update the SVG transformation
    function updateSVGTransform() {
      svg.attr('transform', getSvgTransform(map.getZoom()));
    }

    // Add event listeners for move and zoom events
    // map.on('move', updateSVGTransform);
    map.on('zoom', updateSVGTransform);

    // Initial transformation update
    updateSVGTransform(); // TODO: Check if it changes something if this is done after the circle creation below

    // Example: Append a circle to the SVG
    const lngLat = [54.01610983773737, 38.3928319439921];
    const projected = map.project(lngLat);

    svg
      .append('circle')
      .attr('cx', projected.x)
      .attr('cy', projected.y)
      .attr('r', 2)
      .attr('fill', 'red');

    // $p.dataCSV.forEach((marker_data) => {
    //       svg.append('circle')
    //           .attr('cx', marker_data.lon)
    //           .attr('cy', marker_data.lat)
    //           .attr('r', 5)
    //           .attr('fill', 'red')
    //           .attr('class', 'map-marker')
    //           .on('click', () => {
    //               console.log(marker_data);
    //           });
    //   });

    // svg
    //   .append('circle')
    //   .attr('cx', 100)
    //   .attr('cy', 100)
    //   .attr('r', 10)
    //   .attr('fill', 'red');

    // circleData.forEach((circleDatum) => {});
    // Add GeoJSON source
    map.on('load', () => {
      // map.addSource('points', {
      //   type: 'geojson',
      //   data: circleData,
      // });

      // map.addLayer({
      //   id: 'points',
      //   type: 'circle',
      //   source: 'points',
      //   paint: {
      //     'circle-radius': 6,
      //     'circle-color': '#007cbf', // Default color
      //   },
      // });

      // $p.dataCSV.forEach((marker_data, idx) => {
      //   if (idx % 2 == 0) {
      //     // Example: Change the appearance of the first point
      //     map.setFeatureState(
      //       { source: 'points', id: idx },
      //       { selected: true }
      //     );
      //   }
      // });

      console.log('loading markers');
      // OPTION EXEX
      // const container = map.getCanvasContainer();
      //     const svg = select(container).append("svg")
      //         .attr('id', 'map-svg')
      //         .attr('class', 'map-svg');
      // $p.dataCSV.forEach((marker_data) => {
      //     svg.append('circle')
      //         .attr('cx', marker_data.lon)
      //         .attr('cy', marker_data.lat)
      //         .attr('r', 5)
      //         .attr('fill', 'red')
      //         .attr('class', 'map-marker')
      //         .on('click', () => {
      //             console.log(marker_data);
      //         });
      // });

      //     // OPTION Rudi
      // $p.dataCSV.forEach((marker_data) => {
      //   const mark = document.createElement('div');

      //   new MapMarker({
      //     target: mark,
      //     props: { data: marker_data },
      //   });

      //   new mapboxgl.Marker({ element: mark })
      //     .setLngLat([marker_data.lon, marker_data.lat])
      //     .addTo(map);
      // });
    });
  });

  $: {
    if (map && step > 0) {
      // const mue = map.querySourceFeatures({
      //   sourceLayer: 'points',
      //   filter: ['==', ['get', 'id'], 'point-1'],
      // });
      if (step >= 1) {
        initialZoom = initialZoomOverall;
        targetZoom = 5;

        // Animate the circle opacity using GSAP
        // circleData.features.forEach((feature, index) => {
        //   tl.to(
        //     { opacity: 0 },
        //     {
        //       opacity: 1,
        //       duration: 0.5,
        //       delay: index * 0.0005, // Delay each circle reveal
        //       ease: 'power1.inOut',
        //       onUpdate: function () {
        //         map.setPaintProperty(
        //           'points',
        //           'circle-opacity',
        //           this.targets()[0].opacity
        //         );
        //       },
        //     },
        //     0
        //   );
        // });
      }
      if (step >= 2) {
        initialZoom = 5;
        targetZoom = targetZoomOverall;
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

<div id="map" style="width: {mapWidth}px; height: {mapHeight}px"></div>
