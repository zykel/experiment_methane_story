<script>
	import { p } from './stores/p.js';
  import { onMount } from 'svelte';
  import Map from './lib/Map.svelte';
  import ProgressBars from './lib/ProgressBars.svelte';
  import { gsap } from 'gsap';

  let step = 0;
  const stepMax = 2;
  let tl;
  
  $: {
      tl = gsap.timeline({ 
      defaults: { duration: $p.duration + 1 },
      paused: step == 0 ? true : false,
      onComplete: () => {
        if (step < stepMax) step += 1;
      }
    });
  }

  // Functions to control the animation
  function startAnimation() {
    step = 1;
    // tl.play();
  }

  function pauseAnimation() {
    tl.pause();
  }

  function resumeAnimation() {
    tl.resume();
  }

  onMount(() => {
    document.addEventListener('mousedown', pauseAnimation);
    document.addEventListener('mouseup', resumeAnimation);
  });
</script>

<ProgressBars tl={tl} step={step} />
<Map tl={tl} {step} />

<!-- On mousedown on document, call pauseAnimation -->

<div>
  <button on:click={startAnimation}>Start Animation</button>
  <!-- <button on:click={pauseAnimation}>Pause</button>
  <button on:click={resumeAnimation}>Resume</button> -->
</div>

<style>

  button {
    margin: 10px;
    padding: 5px 10px;
  }


  :global(body) {
    background-color: #121212; /* Dark background color */
    color: #ffffff; /* Light text color for contrast */
  }
</style>