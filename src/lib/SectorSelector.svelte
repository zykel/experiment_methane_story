<script>
  import { p, sectorsSelected } from '../stores/p.js';
  // Function to toggle selection
  function toggleSelection(sector) {
    sectorsSelected.update((selected) => {
      if (selected.includes(sector)) {
        return selected.filter((s) => s !== sector);
      } else {
        return [...selected, sector];
      }
    });
  }

  // Function to check if a sector is selected
  $: isSelected = (sector) => $sectorsSelected.includes(sector);
</script>

<style>
  .sector-box {
    pointer-events: auto;
    border: 1px solid #ccc;
    background: #000000e6;
    border-radius: 10px;
    text-align: center;
    min-width: 11rem;
    width: 11rem;
    height: 160px;
    /* margin: auto; */
  }

  .sector-title {
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 32px;
  }

  .sector-options {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    gap: 2px;
  }

  .sector-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    width: 3rem;
  }

  .sector-circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-bottom: 5px;
    border: 2px solid;
  }
  .sector-circle.portrait-mode {
    width: 20px;
    height: 20px;
  }

  .sector-circle.waste {
    border-color: var(--color-waste); /* Color for Waste */
  }

  .sector-circle.coal {
    border-color: var(--color-coal); /* Color for Coal */
  }

  .sector-circle.oil-gas {
    border-color: var(--color-oil-and-gas); /* Color for Oil and Gas */
  }

  .sector-circle.deselected {
    border-color: #414141;
  }

  .sector-name {
    cursor: pointer;
    font-size: 0.75rem;
  }
  .sector-name.deselected {
    color: grey;
  }
</style>

<div
  class="sector-box"
  style="
    padding:{$p.portraitMode ? 10 : 20}px;
    {$p.portraitMode ? 'width: 8rem' : ''};
    {$p.portraitMode ? 'min-width: 8rem' : ''};"
>
  <div class="sector-title">sectors</div>
  <div class="sector-options">
    <div
      class="sector-option"
      on:click="{() => toggleSelection('Oil and Gas')}"
    >
      <div
        id="sector-circle-oil-and-gas"
        class="sector-circle oil-gas {isSelected('Oil and Gas')
          ? ''
          : 'deselected'} {$p.portraitMode ? 'portrait-mode' : ''}"
      ></div>
      <label
        for="sector-circle-oil-and-gas"
        class="sector-name {isSelected('Oil and Gas') ? '' : 'deselected'}"
        >Oil & Gas</label
      >
    </div>
    <div class="sector-option" on:click="{() => toggleSelection('Coal')}">
      <div
        id="sector-circle-coal"
        class="sector-circle coal {isSelected('Coal')
          ? ''
          : 'deselected'} {$p.portraitMode ? 'portrait-mode' : ''}"
      ></div>
      <label
        for="sector-circle-coal"
        class="sector-name {isSelected('Coal') ? '' : 'deselected'}">Coal</label
      >
    </div>
    <div class="sector-option" on:click="{() => toggleSelection('Waste')}">
      <div
        id="sector-circle-waste"
        class="sector-circle waste {isSelected('Waste')
          ? ''
          : 'deselected'} {$p.portraitMode ? 'portrait-mode' : ''}"
      ></div>
      <label
        for="sector-circle-waste"
        class="sector-name {isSelected('Waste') ? '' : 'deselected'}"
        >Waste</label
      >
    </div>
  </div>
</div>

<!-- <script>
  import { sectorsSelected } from '../stores/p.js';
</script>

<div class="sector-selector">
  <div class="sector-option">
    <input
      type="checkbox"
      id="sector-waste"
      value="Waste"
      bind:group="{$sectorsSelected}"
    />
    <label for="sector-waste">Waste</label>
  </div>
  <div class="sector-option">
    <input
      type="checkbox"
      id="sector-coal"
      value="Coal"
      bind:group="{$sectorsSelected}"
    />
    <label for="sector-coal">Coal</label>
  </div>
  <div class="sector-option">
    <input
      type="checkbox"
      id="sector-oil-gas"
      value="Oil and Gas"
      bind:group="{$sectorsSelected}"
    />
    <label for="sector-oil-gas">Oil and Gas</label>
  </div>
</div> -->
