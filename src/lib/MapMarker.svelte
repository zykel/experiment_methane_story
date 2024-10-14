<script>
  // this renders a single marker. we call this component from map.js

  export let data;
  import { scaleSqrt } from 'd3';

  // change radius scale so we zoom dynamically

  let rad = 10;
</script>

<style>
  .marker {
    z-index: 4;
    border-radius: 40px;
    background-position: top;
    background-repeat: no-repeat;
    opacity: 0.7;
  }
</style>

<div
  class="marker"
  style="background-color: {'#374c80'};
  background-size: {rad}px {rad}px; height: {rad}px; width: {rad}px;"
  on:click="{function () {
    console.log(data);
  }}"
></div>
