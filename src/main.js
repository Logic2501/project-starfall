(function () {
  const canvas = document.getElementById('battlefield');
  const renderer = Starfall.render.create(canvas);
  const state = Starfall.store.get();

  const startBtn = document.getElementById('startWaveBtn');
  const pauseBtn = document.getElementById('pauseBtn');

  let pointer = { x: state.turret.x, y: state.turret.y - 80 };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    pointer.x = (e.clientX - rect.left) * scaleX;
    pointer.y = (e.clientY - rect.top) * scaleY;
    Starfall.entities.updateTurretAngle(state, pointer.x, pointer.y);
  });

  canvas.addEventListener('mousedown', () => {
    Starfall.systems.projectile.fire();
  });

  startBtn.addEventListener('click', () => {
    const started = Starfall.systems.wave.startNextWave();
    if (started) {
      document.getElementById('resultPanel').textContent = '';
    }
  });

  pauseBtn.addEventListener('click', () => {
    state.running = !state.running;
  });

  Starfall.ui.postWave.bind();
  Starfall.ui.tech.bind();
  Starfall.ui.language.bind();

  const update = (dt) => {
    state.time += dt;
    const geometry = Starfall.geometry.getPlanetGeometry(Starfall.config, Starfall.config.canvas);
    const groundPolyline = Starfall.geometry.getGroundPolyline(Starfall.config, Starfall.config.canvas);
    const { centerX, centerY, atmosphereRadius } = geometry;
    const asteroidSurvivors = [];

    state.asteroids.forEach((a) => {
      if (a.landingUntil !== null) {
        if (state.time < a.landingUntil) {
          asteroidSurvivors.push(a);
        }
        return;
      }

      const dx = centerX - a.x;
      const dy = centerY - a.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist <= atmosphereRadius) {
        const depth = Math.max(0, Math.min(1, (atmosphereRadius - dist) / atmosphereRadius));
        const targetFactor =
          Starfall.data.balancing.atmosphereEntrySpeedFactor +
          (Starfall.data.balancing.atmosphereDeepSpeedFactor - Starfall.data.balancing.atmosphereEntrySpeedFactor) * depth;
        const target = a.cruiseSpeed * targetFactor;
        const speed = Math.hypot(a.vx, a.vy) || 1;
        const normalizedX = a.vx / speed;
        const normalizedY = a.vy / speed;
        if (!a.atmosphereAdjusted) {
          a.vx = normalizedX * target;
          a.vy = normalizedY * target;
          a.atmosphereAdjusted = true;
        } else if (speed > target) {
          a.vx = normalizedX * target;
          a.vy = normalizedY * target;
        }
        const accel = Starfall.config.asteroidGravity / (dist + 120);
        a.vx += (dx / dist) * accel * dt;
        a.vy += (dy / dist) * accel * dt;
      }
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      a.rotation += a.spin * dt;

      if (Starfall.geometry.intersectsGroundArc({ x: a.x, y: a.y, radius: a.radius }, groundPolyline)) {
        a.captured = true;
        if (!a.captureScored) {
          const gain = Math.round(a.value);
          const stats = Starfall.store.ensureWaveStats(a.waveId);
          stats.gain += gain;
          state.resources += gain;
          a.captureScored = true;
        }
        a.landingUntil = state.time + Starfall.config.landingHighlightSeconds;
        a.vx = 0;
        a.vy = 0;
        a.spin = 0;
        asteroidSurvivors.push(a);
        return;
      }

      asteroidSurvivors.push(a);
    });
    state.asteroids = asteroidSurvivors;

    Starfall.systems.projectile.update(dt);
    Starfall.systems.collision.update();
    Starfall.systems.fragment.update(dt);
    Starfall.systems.capture.update(dt);
    Starfall.systems.settlement.update();
    Starfall.systems.wave.collectEscapedAsteroids(canvas.width, canvas.height);
    Starfall.systems.wave.updateSettlementState();
    Starfall.systems.wave.finishSettlementsIfReady();
  };

  const render = () => {
    Starfall.render.drawBackground(renderer);
    Starfall.render.drawCombat(renderer);
    Starfall.render.drawOverlay(renderer);
    Starfall.ui.hud.update();
  };

  // 先绘制一帧静态背景，避免运行时异常前出现空白画布。
  render();
  Starfall.loop.start(update, render);
})();
