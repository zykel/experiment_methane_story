<script>
    export let tl;
    export let step;

    
  $: {
    
    if (step > 0) {

        // Animate the zoomObj
        tl.to("#progress-bar-"+step, {
            duration: 3,
            width: "100%",
            ease: 'power1.inOut',
        }, 0);
    }
  }

</script>

<div class="progress-bars">
    <div class="progress-bar-container">
        <div class="progress-bar ghost" id="ghost-progress-bar-1"></div>
        <div class="progress-bar" id="progress-bar-1" style="width: {step <= 1 ? 0 : 100}%;"></div>
    </div>
    <div class="progress-bar-container">
        <div class="progress-bar ghost" id="ghost-progress-bar-2"></div>
        <div class="progress-bar" id="progress-bar-2" style="width: {step <= 2 ? 0 : 100}%;"></div>
    </div>
</div>

<style>
    .progress-bars {
        display: flex;
        justify-content: space-between;
        gap: 4px;
    }

    .progress-bar-container {
        position: relative;
        width: 198px; /* Adjust the width as needed */
        height: 4px; /* Adjust the height as needed */
        margin-bottom: 10px;
    }

    .progress-bar {
        border-radius: 2px;
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 4px;
        background-color: #bebebe;
    }

    .progress-bar.ghost {
        width: 100%;
        background-color: rgba(215, 215, 215, 0.3); /* Lighter color for ghost bar */
    }
</style>