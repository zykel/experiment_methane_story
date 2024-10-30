<style>
  button {
    margin: 10px;
    padding: 5px 10px;
  }

  .restart-widget {
    pointer-events: auto;
    font-family: 'Quicksand', system-ui, Avenir, Helvetica, Arial, sans-serif;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 10px;
    background-color: #ccccccd4;
    color: #040404;
    border: 1px solid #040404;
    border-radius: 5px;
    /* font-size: 16px; */
    cursor: pointer;
    transition:
      background-color 0.2s,
      transform 0.2s;
  }

  .restart-widget:hover {
    background-color: #ecececd4;
    transform: scale(1.05);
  }

  .restart-widget:active {
    background-color: #ffffffd4;
    transform: scale(1);
  }

  .restart-widget svg {
    width: 20px;
    height: 20px;
    fill: #040404;
  }

  .restart-widget {
    margin-right: 8px;
  }

  svg {
    margin-left: 8px;
  }

  .loop-symbol-tip {
    fill: none;
    stroke: #040404;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 4;
    stroke-dasharray: none;
    stroke-opacity: 1;
  }

  .loop-symbol-loop {
    fill: none;
    fill-opacity: 1;
    stroke: #040404;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 4;
    stroke-dasharray: none;
    stroke-opacity: 1;
    paint-order: stroke fill markers;
    stop-color: #040404;
  }
</style>

<button class="restart-widget">
  Restart Story
  <svg viewBox="0 0 24 24">
    <path
      class="loop-symbol-loop"
      d="M 12.000017,4.9604552 A 8.2653095,8.1680251 0 0 1 19.636168,10.002712 8.2653095,8.1680251 0 0 1 17.844474,18.904146 8.2653095,8.1680251 0 0 1 8.8370202,20.674751 8.2653095,8.1680251 0 0 1 3.7347078,13.12848"
    ></path>
    <path
      class="loop-symbol-tip"
      d="M 13.41037,8.2395263 9.8250111,4.9703662 13.41037,1.7012055"
    ></path>
  </svg>
</button>
