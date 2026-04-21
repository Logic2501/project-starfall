  (function () {
    Starfall.render = Starfall.render || {};
  Starfall.render.drawOverlay = ({ ctx, width, height }) => {
    const polyline = Starfall.geometry.getGroundPolyline(Starfall.config, { width, height });
    if (polyline.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(polyline[0].x, polyline[0].y);
    for (let i = 1; i < polyline.length; i += 1) {
      ctx.lineTo(polyline[i].x, polyline[i].y);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 2;
    ctx.stroke();
  };
})();
