  (function () {
    Starfall.ui = Starfall.ui || {};
    Starfall.ui.postWave = {
      bind() {
      Starfall.events.on('wave:ended', ({ wave, gain, loss, projectileSpend, shattered, unshattered }) => {
        const state = Starfall.store.get();
        const t = Starfall.i18n[state.locale] || Starfall.i18n['zh-CN'];
        const panel = document.getElementById('resultPanel');
        panel.textContent = `${t.wave} ${wave} | ${t.gain}：+${gain} | ${t.loss}：${loss} | ${t.projectileSpend}：${projectileSpend} | ${t.shattered}：${shattered} | ${t.unshattered}：${unshattered}`;
      });
    }
  };
})();
