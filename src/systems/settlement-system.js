  (function () {
    Starfall.systems = Starfall.systems || {};

  Starfall.systems.settlement = {
    update() {
      const state = Starfall.store.get();
      const { canvas } = Starfall.config;
      const survivors = [];

      for (const f of state.fragments) {
        if (f.landingUntil !== null) {
          if (state.time < f.landingUntil) {
            survivors.push(f);
          }
          continue;
        }
        if (f.x < -100 || f.x > canvas.width + 100 || f.y < -120) {
          if (!f.captured) {
            f.lost_reason = 'uncaptured';
            Starfall.store.ensureWaveStats(f.waveId).loss += Math.round(f.massValue);
          }
          continue;
        }
        survivors.push(f);
      }

      state.fragments = survivors;
    }
  };
})();
