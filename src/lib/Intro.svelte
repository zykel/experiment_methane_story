<script>
  export let step;
</script>

<style>
  .blurry-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(20px); /* Adjust the blur amount as needed */
    -webkit-backdrop-filter: blur(20px); /* For Safari support */
    background-color: rgba(
      24,
      24,
      24,
      0
    ); /* Optional: Add a semi-transparent background */
    pointer-events: none; /* Optional: Allow clicks to pass through */
  }

  #intro-text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin: 3rem 0 3rem 0;
    padding: 20px;
    /* background-color: rgba(0, 0, 0, 0.5); */
    border-radius: 5px;
    color: white;
  }

  .icon-svg {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 24px;
    width: 24px; /* Adjust the size as needed */
    height: 24px; /* Adjust the size as needed */
    margin-right: 16px; /* Adjust the spacing as needed */
  }

  .navigation-entry-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .icon-path {
    fill: none;
    stroke: #ffffff;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 4;
  }

  .bold {
    font-weight: bold;
  }

  h1 {
    text-align: center;
  }
</style>

<div class="blurry-div" style="display: {step > 0 ? 'none' : 'flex'};">
  <h1>A Quick Dive into UNEP's Methane Data</h1>
  <div id="intro-text-container">
    <div class="navigation-entry-container">
      <svg class="icon-svg" viewBox="0 0 20 24">
        <path
          class="icon-path"
          d="m 18.000002,2.0000127 c 0,0 0,19.9999753 0,19.9999753"
        ></path>
        <path
          class="icon-path"
          d="m 2.000003,21.999988 c 0,0 0,-19.9999753 0,-19.9999753 C 2.000003,2.0000127 17,12 17,12 17,12 2.000003,21.999988 2.000003,21.999988 Z"
        ></path>
      </svg>
      <p>
        To skip forward, <span class="bold">tap on the right side</span> of the view.
      </p>
    </div>
    <div class="navigation-entry-container">
      <svg class="icon-svg" viewBox="0 0 20 24">
        <path
          class="icon-path"
          d="m 6.428125,2.0000123 c 0,0 0,19.9999757 0,19.9999757"
        ></path>
        <path
          class="icon-path"
          d="m 13.571876,2.0000124 c 0,0 0,19.9999756 0,19.9999756"
        ></path>
      </svg>
      <p>To pause, <span class="bold">tap and hold</span>.</p>
    </div>
    <div class="navigation-entry-container">
      <svg class="icon-svg" viewBox="0 0 20 24">
        <path
          class="icon-path"
          d="m 1.9999976,2.0000127 c 0,0 0,19.9999753 0,19.9999753"
        ></path>
        <path
          class="icon-path"
          d="m 17.999997,21.999988 c 0,0 0,-19.9999753 0,-19.9999753 0,0 -14.9999969,9.9999873 -14.9999969,9.9999873 0,0 14.9999969,9.999988 14.9999969,9.999988 z"
        ></path>
      </svg>
      <p>
        To skip backward, <span class="bold">tap on the left side</span> of the view.
      </p>
    </div>
  </div>
  <p>Tap to begin.</p>
</div>
