import { writable, derived } from 'svelte/store';

// p without self-derived values
const pInit = {
  dataCSV: [],
  dataCSVAfterFirst: [],
  firstFlare: null,
  dataGeoJSON: [],
  flarePath: [],
  duration: 6,
  stepMax: 2,
  mapWidth: 300, //700,
  mapHeight: 600, //400,
  map: null,
  initialZoomOverall: 13,
  targetZoomOverall: 1,
  steps: [0, 10, 20, 30],
  // Could be useful to include individual step durations
};

// p including self-derived values
export const p = writable({
  ...pInit,
  // Rememeber that these derived values are not reactive
  nrSteps: pInit.steps.length,
  maxZoomFactor: 2 ** (pInit.initialZoomOverall - pInit.targetZoomOverall),
});

export const isLastStep = derived(
  p,
  ($p) =>
    function (step) {
      return step == $p.steps[$p.steps.length - 1];
    }
);

export const getNextStep = derived(
  p,
  ($p) =>
    function (step) {
      // Inside $p.steps, find the input step and return the subsequent entry of $p.steps
      const index = $p.steps.indexOf(step);
      if (index < 0) return null;
      if (index == $p.nrSteps - 1) return step;
      return $p.steps[index + 1];

      return step == $p.steps[$p.steps.length - 1];
    }
);

export const getPreviousStep = derived(
  p,
  ($p) =>
    function (step) {
      // Inside $p.steps, find the input step and return the previous entry of $p.steps
      const index = $p.steps.indexOf(step);
      if (index < 0) return null;
      if (index == 0) return step;
      return $p.steps[index - 1];
    }
);

// Alternative (maybe)
// import { writable, derived } from 'svelte/store';

// const initialP = {
//   dataCSV: [],
//   duration: 6,
//   stepMax: 2,
//   mapWidth: 700,
//   mapHeight: 500,
//   map: null,
//   initialZoomOverall: 10,
//   targetZoomOverall: 1,
//   steps: [0, 10, 20],
// };

// export const p = writable(initialP);

// derived(p, $p => {
//   return {
//     ...$p,
//     nrSteps: $p.steps.length
//   };
// }).subscribe(updatedP => {
//   p.set(updatedP);
// });
