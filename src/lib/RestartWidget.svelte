<style>
  button {
    margin: 10px;
    padding: 5px 10px;
  }

  .restart-widget {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition:
      background-color 0.2s,
      transform 0.2s;
  }

  .restart-widget:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  .restart-widget:active {
    background-color: #004494;
    transform: scale(1);
  }

  .restart-widget svg {
    margin-right: 8px;
    width: 20px;
    height: 20px;
    fill: white;
  }
</style>

<button class="restart-widget">
  Restart Story
  <svg viewBox="0 0 24 24">
    <path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2z"></path>
    <path d="M13 0h-2v8h2z"></path>
  </svg>
</button>
