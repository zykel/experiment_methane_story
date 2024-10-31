<script>
  import { p, mapWidth, mapHeight } from '../stores/p.js';
  export let markerData;
  export let idSuffix;

  $: projection = $p.map.project([markerData.lon, markerData.lat]);
</script>

<circle
  id="{`marker-${idSuffix}`}"
  class="{markerData.country + '-marker ping-marker'}"
  cx="{projection.x + ($mapWidth * $p.maxZoomFactor) / 2 - $mapWidth / 2}"
  cy="{projection.y + ($mapHeight * $p.maxZoomFactor) / 2 - $mapHeight / 2}"
  fill="none"
  stroke="{$p.sectorColors[markerData.sector]}"
></circle>
