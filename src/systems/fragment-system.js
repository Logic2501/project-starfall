(function () {
  Starfall.systems = Starfall.systems || {};
  Starfall.systems.fragment = {
    update(dt) {
      const state = Starfall.store.get();
      const margin = 100;
      const geometry = Starfall.geometry.getPlanetGeometry(Starfall.config, Starfall.config.canvas);
      const { centerX, centerY, gravityRadius: gravityRange } = geometry;
      const gravityK = Starfall.config.fragmentGravity;
      const survivors = [];
      state.fragments.forEach((f) => {
        if (f.landingUntil !== null) {
          survivors.push(f);
          return;
        }
        if (
          f.x < -margin ||
          f.x > Starfall.config.canvas.width + margin ||
          f.y < -margin ||
          f.y > Starfall.config.canvas.height + margin
        ) {
          if (!f.captured) {
            f.lost_reason = 'uncaptured';
            Starfall.store.ensureWaveStats(f.waveId).loss += Math.round(f.massValue);
          }
          return;
        }
        const dx = centerX - f.x;
        const dy = centerY - f.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist <= gravityRange) {
          const accel = gravityK / (dist + 120);
          const ax = (dx / dist) * accel;
          const ay = (dy / dist) * accel;
          f.vx += ax * dt;
          f.vy += ay * dt;
        }
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.rotation += f.spin * dt;
        survivors.push(f);
      });
      state.fragments = survivors;
    }
  };
})();
