(function () {
  const captureRuntimeError = (err) => {
    Starfall.runtime.error = err;
    // 仍然保留浏览器控制台栈，便于排查。
    console.error(err);
  };

  Starfall.loop = {
    start(update, render) {
      let last = performance.now();
      const frame = (now) => {
        const dt = Math.min(0.033, (now - last) / 1000);
        last = now;
        const state = Starfall.store.get();
        try {
          if (state.running) {
            update(dt);
          }
        } catch (err) {
          state.running = false;
          captureRuntimeError(err);
        }
        try {
          render();
        } catch (err) {
          state.running = false;
          captureRuntimeError(err);
        }
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }
  };
})();
