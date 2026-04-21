(function () {
  Starfall.ui = Starfall.ui || {};
  Starfall.ui.language = {
    bind() {
      const btn = document.getElementById('langBtn');
      btn.addEventListener('click', () => {
        const state = Starfall.store.get();
        state.locale = state.locale === 'zh-CN' ? 'en-US' : 'zh-CN';
      });
    }
  };
})();
