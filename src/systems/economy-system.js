(function () {
  Starfall.systems = Starfall.systems || {};
  Starfall.systems.economy = {
    snapshotWaveResult(waveId) {
      const state = Starfall.store.get();
      const stats = state.waveStats[waveId] || { gain: 0, loss: 0, shattered: 0, unshattered: 0 };
      return {
        gain: stats.gain,
        loss: stats.loss,
        shattered: stats.shattered,
        unshattered: stats.unshattered
      };
    }
  };
})();
