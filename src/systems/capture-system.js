(function () {
  Starfall.systems = Starfall.systems || {};
  Starfall.systems.capture = {
    update() {
      const state = Starfall.store.get();
      const groundPolyline = Starfall.geometry.getGroundPolyline(Starfall.config, Starfall.config.canvas);
      state.fragments.forEach((f) => {
        if (f.landingUntil !== null) {
          return;
        }
        if (Starfall.geometry.intersectsGroundArc({ x: f.x, y: f.y, radius: f.size }, groundPolyline)) {
          f.captured = true;
          if (!f.captureScored) {
            const gain = Math.round(f.massValue);
            const stats = Starfall.store.ensureWaveStats(f.waveId);
            stats.gain += gain;
            state.resources += gain;
            f.captureScored = true;
          }
          f.landingUntil = state.time + Starfall.config.landingHighlightSeconds;
          f.landed = true;
          f.vx = 0;
          f.vy = 0;
          f.spin = 0;
        }
      });
    }
  };
})();
