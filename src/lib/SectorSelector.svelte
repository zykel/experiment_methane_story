<script>
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
</div>
