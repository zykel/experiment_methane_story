import { writable } from "svelte/store";

export const p = writable({
  duration: 6,
  stepMax: 2,
});
