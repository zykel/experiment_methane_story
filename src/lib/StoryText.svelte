<script>
  import { onMount, tick } from 'svelte';
  import { p } from '../stores/p';

  export let tl;
  export let step;

  let textArray = [];

  const storyText = [
    {
      step: 5,
      textArray: [
        {
          paragraphs: [
            'Methane is second biggest driver of global warming after carbon dioxide and is responsible for 30% of warming from human sources.',
          ],
          start: 0,
        },
      ],
    },
    {
      step: 10,
      textArray: [
        {
          paragraphs: [
            'This is a methane flare from an oil an gas plant in Turkmenistan in November 2023 (CHANGE).',
            'It was identified by the UN’s Methane Alert and Response System (MARS), which uses satellites to track methane emission sources.',
          ],
          start: 2,
          // duration: 4,
        },
        // {
        //   paragraphs: [
        //     'It is the second-largest contributor to climate warming after carbon dioxide.',
        //     // 'Methane has a shorter atmospheric lifetime than CO2 but absorbs much more energy while it exists in the atmosphere, meaning 1 tonne of methane is equivalent to between 28 and 36 tonnes of CO2 over 100 years.',
        //   ],
        //   start: 6,
        // },
      ],
    },
    {
      step: 20,
      textArray: [
        {
          paragraphs: [
            `MARS is currenty being used to inform governments and companies of methane emitting events across the energy (<span style="color: ${$p.sectorColors['Oil and Gas']}">oil & gas</span> and <span style="color: ${$p.sectorColors['Coal']}">coal</span>) and <span style="color: ${$p.sectorColors['Waste']}">waste</span> industries.`,
          ],
          start: 4,
        },
      ],
    },
    {
      step: 30,
      textArray: [
        {
          paragraphs: [
            'Turkmenistan has the highest detected Methane emissions, followed by India, Pakistan and the US.',
            'However, the underlying production often also takes place for consumption in other countries.',
          ],
          start: 4,
          duration: 3,
        },
      ],
    },
    {
      step: 50,
      textArray: [
        {
          paragraphs: [
            'MARS will soon be able to detect smaller plumes and incorporate other sectors like agriculture.',
            'For now, feel free to explore these methane emissions yourself!',
          ],
          start: 2,
        },
      ],
    },
  ];

  const hideAllText = () => {
    if (onlyOneTextPanelPerStep) {
      document.querySelectorAll('.text-paragraph').forEach((el) => {
        el['style'].opacity = 0;
      });
    } else {
      document.querySelectorAll('.story-text').forEach((el) => {
        el['style'].opacity = 0;
      });
    }
  };

  const onlyOneTextPanelPerStep = true;

  $: {
    // Set the opacity style of all elements with class .story-text to 0
    hideAllText();

    if (onlyOneTextPanelPerStep) {
      const stepInfo = storyText.find((stepInfo) => stepInfo.step === step);
      if (typeof stepInfo !== 'undefined') {
        const j = 0;
        const textInfo = stepInfo.textArray[j];
        const duration = textInfo.duration
          ? textInfo.duration
          : $p.defaultTextDisplayDuration;
        textInfo.paragraphs.forEach((text, k) => {
          tl.fromTo(
            `#text-paragraph-${step}-${j}-${k}`,
            {
              opacity: 0,
            },
            {
              opacity: 1,
              duration: 0.1,
              ease: 'power1.in',
              delay: textInfo.start + k * duration, // Delay each text reveal
            },
            0
          );
        });
      }
    } else {
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
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 5;
    /* padding: 20px; */
    /* left: 230px;
    width: 300px; TODO:*/
    width: 100%;
  }

  #text-positioning-container {
    position: relative;
    display: flex;
    align-items: center;
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
    color: #121212;
    font-weight: 700;
    line-height: 1.8;
    transition: opacity 0.1s;
  }

  .text-paragraph {
    display: inline;
    background-color: #ffffff;
    border-radius: 5px;
    padding: 0px 0.5rem 0.2rem 0.5rem;
    box-decoration-break: clone; /* Ensure background and padding apply to each line */
    -webkit-box-decoration-break: clone; /* For WebKit browsers */
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

<div
  id="story-text-container"
  style="width: {$p.mapWidth > $p.maxTextWidth
    ? $p.maxTextWidth + 'px'
    : '100%'}; 
    left: {$p.mapWidth > $p.maxTextWidth
    ? ($p.mapWidth - $p.maxTextWidth) / 2 + 'px'
    : '0'};"
>
  <div id="text-positioning-container" style="height: {$p.mapHeight / 2}px">
    {#each storyText as stepInfo, i}
      {#each stepInfo.textArray as textInfo, j}
        <div class="text-step-container">
          <p
            id="story-text-step-{stepInfo.step}-{j}"
            class="story-text"
            style="opacity: {onlyOneTextPanelPerStep ? 1 : 0}"
          >
            {#each textInfo.paragraphs as text, k}
              <span
                id="text-paragraph-{stepInfo.step}-{j}-{k}"
                class="text-paragraph"
                style="opacity: {onlyOneTextPanelPerStep ? 0 : 1}"
                >{@html text}</span
              >
              {#if k < textInfo.paragraphs.length - 1}
                <br />
                <br />
              {/if}
            {/each}
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
