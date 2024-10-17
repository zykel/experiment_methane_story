<script>
  import { onMount, tick } from 'svelte';

  export let tl;
  export let step;

  let textArray = [];

  const storyText = [
    {
      step: 10,
      textArray: [
        'This is a methane cloud.',
        'It was produced when industrially generating oil and gas for energy generation.',
        'Methane is the main factor behind XY.',
      ],
    },
    {
      step: 20,
      textArray: [
        'Big industrial sectors in which methane is produced are gas and oil generation, coal mining, and (XY of?) waste',
      ],
    },
  ];

  const hideAllText = () => {
    document.querySelectorAll('.story-text').forEach((el) => {
      el['style'].opacity = 0;
    });
  };

  $: {
    // Set the opacity style of all elements with class .story-text to 0
    hideAllText();

    // if (step == 10) {
    const stepInfo = storyText.find((stepInfo) => stepInfo.step === step);
    if (typeof stepInfo !== 'undefined') {
      stepInfo.textArray.forEach((text, j) => {
        tl.fromTo(
          `#story-text-step-${step}-${j}`,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.1,
            ease: 'power1.in',
            delay: (j + 1) * 2, // Delay each text reveal
          },
          0
        );
      });
    }
    // }
  }

  //   $: {
  //     textArray.forEach((text, i) => {
  //       tl.fromTo(
  //         `#story-text-${i}`,
  //         {
  //           opacity: 0,
  //         },
  //         {
  //           opacity: 1,
  //           duration: 1,
  //           ease: 'power1.in',
  //           //   delay: (i + 1) * 1.5, // Delay each text reveal
  //         },
  //         0
  //       );
  //     });
  //   }
</script>

<style>
  #story-text-container {
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 5;
    /* padding: 20px; */
    width: 100%;
  }

  #text-positioning-container {
    position: relative;
  }

  .text-step-container {
    position: absolute;
    left: 0;
    padding: 20px;
  }

  .story-text {
    display: inline;
    background-color: #cacaca;
    border-radius: 5px;
    padding: 0px 0.5rem 0.2rem 0.5rem;
    color: #121212;
    font-weight: 700;
    box-decoration-break: clone; /* Ensure background and padding apply to each line */
    -webkit-box-decoration-break: clone; /* For WebKit browsers */
    line-height: 1.8;
    opacity: 0;
    transition: opacity 0.1s;
  }
</style>

<!-- <div id="story-text-container">
  {#each textArray as text, i}
    <p id="story-text-{i}" class="story-text">{text}</p>
    {#if i < textArray.length - 1}
      <br />
      <br />
    {/if}
  {/each}
</div> -->

<div id="story-text-container">
  <!-- <div id="text-positioning-container"> -->
  {#each storyText as stepInfo, i}
    <div class="text-step-container">
      {#each stepInfo.textArray as text, j}
        <p id="story-text-step-{stepInfo.step}-{j}" class="story-text">
          {text}
        </p>
        {#if i < stepInfo.textArray.length - 1}
          <br />
          <br />
        {/if}
      {/each}
    </div>
  {/each}
  <!-- </div> -->
</div>
