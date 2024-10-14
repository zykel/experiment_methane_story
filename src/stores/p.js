import { writable } from 'svelte/store';

export const p = writable({
  dataCSV: [],
  duration: 6,
  stepMax: 2,
});
