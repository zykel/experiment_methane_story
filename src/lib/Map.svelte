<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox CSS

  export let tl;
  export let step;

  let map; // Store the map instance
  let initialZoom = 10;
  let targetZoom;
  
  // Function to initialize the map
  onMount(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvNCIsImEiOiJja3Z0b2ViNTIwdG55MzBseWZ3Mmc0bXluIn0.F3y-oHZn9KCmgPNR_11zzg'; // Use your token here
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [38, 50], // Replace with your initial coordinates
      zoom: initialZoom,
    });


  });

  $: {
    
    if (map && step > 0) {
        
        if (step >= 1) {
            initialZoom = 10;
            targetZoom = 5;
        }
        if (step >= 2) {
            initialZoom = 5;
            targetZoom = 2;
        }

        // Create an object to hold zoom level and animate this instead of the map directly
        let zoomObj = { zoom: initialZoom };

        // Animate the zoomObj
        tl.to(zoomObj, {
        duration: 3,
        zoom: targetZoom,
        ease: 'power1.inOut',
        onUpdate: () => {
            // Update the map's zoom level during the animation
            map.setZoom(zoomObj.zoom);
        },
        });
    }
  }
</script>

<div id="map"></div>


<style>
    #map {
      width: 400px;
      height: 500px; /* Adjust as necessary */
    }
</style>