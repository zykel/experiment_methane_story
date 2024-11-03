import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  base: '/experiment_methane_story/',
  plugins: [svelte(), envCompatible()],
});
