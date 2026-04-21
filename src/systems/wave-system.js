(function () {
  Starfall.systems = Starfall.systems || {};

  const hasAsteroidsOfWave = (state, waveId) => state.asteroids.some((a) => a.waveId === waveId);
  const hasFragmentsOfWave = (state, waveId) => state.fragments.some((f) => f.waveId === waveId);

  Starfall.systems.wave = {
    startNextWave() {
      const state = Starfall.store.get();
      if (state.asteroids.length > 0) {
        return false;
      }

      const prevWaveId = state.activeWaveId;
      if (prevWaveId !== null) {
        Starfall.store.ensureWaveStats(prevWaveId).nextWaveStarted = true;
      }

      if (state.hasStarted) {
        state.wave += 1;
      } else {
        state.hasStarted = true;
      }

      const waveId = state.wave;
      state.activeWaveId = waveId;
      state.waveState = 'combat';
      Starfall.store.ensureWaveStats(waveId);
      Starfall.systems.spawn.spawnWave(waveId - 1, waveId);
      return true;
    },

    collectEscapedAsteroids(canvasWidth, canvasHeight) {
      const state = Starfall.store.get();
      const keep = [];
      for (const a of state.asteroids) {
        const escaped = a.x > canvasWidth + 100 || a.y > canvasHeight + 100 || a.x < -100;
        if (escaped) {
          if (!a.captured) {
            Starfall.store.ensureWaveStats(a.waveId).unshattered += 1;
          }
        } else {
          keep.push(a);
        }
      }
      state.asteroids = keep;
    },

    updateSettlementState() {
      const state = Starfall.store.get();
      if (state.asteroids.length > 0) {
        state.waveState = 'combat';
      } else if (state.fragments.length > 0) {
        state.waveState = 'settling';
      } else {
        state.waveState = state.hasStarted ? 'idle' : 'idle';
      }
    },

    finishSettlementsIfReady() {
      const state = Starfall.store.get();
      const waveIds = Object.keys(state.waveStats).map((n) => Number(n));

      for (const waveId of waveIds) {
        const stats = state.waveStats[waveId];
        if (!stats || stats.settlementFinished) {
          continue;
        }

        if (hasAsteroidsOfWave(state, waveId) || hasFragmentsOfWave(state, waveId)) {
          continue;
        }

        stats.settlementFinished = true;

        // 只有玩家未提前点击下一波时，才显示完整结算面板。
        if (!stats.nextWaveStarted) {
          Starfall.events.emit('wave:ended', {
            wave: waveId,
            gain: stats.gain,
            loss: stats.loss,
            projectileSpend: stats.projectileSpend,
            shattered: stats.shattered,
            unshattered: stats.unshattered
          });
        }
      }
    }
  };
})();
