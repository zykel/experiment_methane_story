<script>
  import { p } from '../stores/p.js';

  $: doLogError = (message, errorLog) => {
    // const errorItem = document.createElement('div');
    errorLog = document.getElementById('error-log');
    errorLog.textContent = errorLog.textContent + '<br>' + message;
  };

  // Listen for general errors
  window.addEventListener('error', function (event) {
    doLogError(
      `Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`
    );
  });

  // Listen for unhandled promise rejections
  window.addEventListener('unhandledrejection', function (event) {
    doLogError(`Unhandled Promise Rejection: ${event.reason}`);
  });

  $: {
    if ($p.map) {
      $p.map.on('error', function (event) {
        const errorMessage = `Map Error: ${event.error.message}`;
        doLogError(errorMessage);
      });
    }
  }
</script>

<style>
  .centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgb(212, 42, 181);
  }
</style>

<div id="error-log" class="centered">v1.13</div>
