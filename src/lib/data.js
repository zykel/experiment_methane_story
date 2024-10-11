export async function load() {
  const response = await fetch("/unep_methanedata_detected_plumes.geojson");
  const geojsonDataNew = await response.json();

  return {
    geojsonDataNew,
  };
}
