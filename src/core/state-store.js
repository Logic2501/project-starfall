(function () {
  const state = {
    wave: 1,
    waveState: 'idle',
    hasStarted: false,
    activeWaveId: null,
    time: 0,
    resources: 50,
    waveStats: {},
    locale: 'zh-CN',
    running: true,
    asteroids: [],
    fragments: [],
    projectiles: [],
    turret: { x: 640, y: 655, angle: -Math.PI / 2 }
  };

  Starfall.store = {
    get: () => state,
    ensureWaveStats: (waveId) => {
      if (!state.waveStats[waveId]) {
        state.waveStats[waveId] = {
          gain: 0,
          loss: 0,
          projectileSpend: 0,
          shattered: 0,
          unshattered: 0,
          nextWaveStarted: false,
          settlementFinished: false
        };
      }
      return state.waveStats[waveId];
    },
    clearCombatEntities: () => {
      state.asteroids = [];
      state.projectiles = [];
    }
  };
})();
