(function () {
  Starfall.ui = Starfall.ui || {};
  Starfall.ui.hud = {
    update() {
      const state = Starfall.store.get();
      const t = Starfall.i18n[state.locale] || Starfall.i18n['zh-CN'];
      document.getElementById('waveLabel').textContent = `${t.wave}：${state.wave}`;
      document.getElementById('resourceLabel').textContent = `${t.resources}：${state.resources}`;
      document.getElementById('pauseBtn').textContent = state.running ? t.pause : t.resume;
      const panel = document.getElementById('resultPanel');
      if (Starfall.runtime.error) {
        const msg = String(Starfall.runtime.error?.message || Starfall.runtime.error).slice(0, 180);
        panel.textContent = `运行错误：${msg}`;
        return;
      }
      if (state.activeWaveId !== null) {
        const stats = state.waveStats[state.activeWaveId];
        if (stats) {
          panel.textContent =
            `${t.gain}：+${stats.gain} | ${t.loss}：${stats.loss} | ${t.projectileSpend}：${stats.projectileSpend} | ${t.shattered}：${stats.shattered} | ${t.unshattered}：${stats.unshattered}`;
        }
      }
      const startBtn = document.getElementById('startWaveBtn');
      const hasAsteroids = state.asteroids.length > 0;
      const inSettling = state.waveState === 'settling';
      startBtn.disabled = hasAsteroids;
      if (hasAsteroids) {
        startBtn.textContent = t.waveInProgress;
      } else if (inSettling) {
        startBtn.textContent = `${t.startWave} (${t.settlingInProgress})`;
      } else {
        startBtn.textContent = t.startWave;
      }
    }
  };
})();
