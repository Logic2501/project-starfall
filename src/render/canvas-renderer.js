(function () {
  Starfall.render = Starfall.render || {};
  Starfall.render.create = (canvas) => {
    const ctx = canvas.getContext('2d');
    return { ctx, width: canvas.width, height: canvas.height };
  };
})();
