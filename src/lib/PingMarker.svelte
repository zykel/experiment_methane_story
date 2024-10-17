<script>
  import { p } from '../stores/p.js';
  export let markerData;
  export let idSuffix;

  $: projection = $p.map.project([markerData.lon, markerData.lat]);
</script>

<circle
  id="{`marker-${idSuffix}`}"
  class="{markerData.country + '-marker ping-marker'}"
  cx="{projection.x + ($p.mapWidth * $p.maxZoomFactor) / 2 - $p.mapWidth / 2}"
  cy="{projection.y + ($p.mapHeight * $p.maxZoomFactor) / 2 - $p.mapHeight / 2}"
  fill="{$p.sectorColors[markerData.sector]}"
></circle>
