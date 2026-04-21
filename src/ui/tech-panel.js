(function () {
  Starfall.ui = Starfall.ui || {};
  Starfall.ui.tech = {
    bind() {
      const btn = document.getElementById('techBtn');
      btn.addEventListener('click', () => {
        // v0.2 原型：科技壳，不做复杂树。
        alert('科技壳：后续接入 3 节点火炮线。');
      });
    }
  };
})();
