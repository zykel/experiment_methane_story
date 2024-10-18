<script>
  import { onMount, tick } from 'svelte';
  import { p } from '../stores/p';

  export let tl;
  export let step;

  let textArray = [];

  const storyText = [
    {
      step: 10,
      textArray: [
        {
          text: 'This is a methane cloud measured by the XY satellite.<br><br>Methane is released when industrially processing oil and gas for energy generation.',
          start: 2,
          duration: 3,
        },
        {
          text: 'It is the second-largest contributor to climate warming after carbon dioxide.',
          start: 6,
        },
      ],
    },
    {
      step: 20,
      textArray: [
        {
          text: `Big industrial sectors in which methane is released are <span style="color: ${$p.sectorColors['Oil and Gas']}">oil and gas generation</span>, <span style="color: ${$p.sectorColors['Coal']}">coal mining</span>, and <span style="color: ${$p.sectorColors['Waste']}">processing of waste</span>.`,
          start: 2,
        },
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
      stepInfo.textArray.forEach((textInfo, j) => {
        tl.fromTo(
          `#story-text-step-${step}-${j}`,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.1,
            ease: 'power1.in',
            delay: textInfo.start, // Delay each text reveal
          },
          0
        );

        // TODO: Could make this optional: Only remove if not last text in array - however this would make the last text int the array potentially be displayed for longer, introducing somewhat of an inconsistency - dunno if that is relevant
        const removeTime =
          textInfo.start +
          (textInfo.duration
            ? textInfo.duration
            : $p.defaultTextDisplayDuration);
        tl.to(
          `#story-text-step-${step}-${j}`,
          {
            duration: 0.1,
            ease: 'power1.in',
            delay: removeTime,
            opacity: 0,
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
    display: flex;
    align-items: center;
    height: 300px;
  }

  .text-step-container {
    position: absolute;
    left: 0;
    padding: 20px;
    /* margin-top: auto;
    margin-bottom: auto; */
  }

  .story-text {
    display: inline;
    background-color: #ffffff;
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
  <div id="text-positioning-container">
    {#each storyText as stepInfo, i}
      {#each stepInfo.textArray as textInfo, j}
        <div class="text-step-container">
          <p id="story-text-step-{stepInfo.step}-{j}" class="story-text">
            {@html textInfo.text}
          </p>
          <!-- {#if i < stepInfo.textArray.length - 1}
          <br />
          <br />
        {/if} -->
        </div>
      {/each}
    {/each}
  </div>
</div>
