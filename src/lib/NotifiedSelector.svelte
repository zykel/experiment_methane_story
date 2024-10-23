<script>
  import { notifiedSelected } from '../stores/p.js';
</script>

<div class="notified-selector">
  <div class="notified-option">
    <input
      type="checkbox"
      id="notified-true"
      value="True"
      bind:group="{$notifiedSelected}"
    />
    <label for="notified-true">Notified</label>
  </div>
  <div class="notified-option">
    <input
      type="checkbox"
      id="notified-false"
      value="False"
      bind:group="{$notifiedSelected}"
    />
    <label for="notified-false">Not Notified</label>
  </div>
</div>
