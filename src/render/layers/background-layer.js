  (function () {
    Starfall.render = Starfall.render || {};
    Starfall.render.drawBackground = ({ ctx, width, height }) => {
    const geometry = Starfall.geometry.getPlanetGeometry(Starfall.config, { width, height });
    const { centerX, centerY, gravityRadius, atmosphereRadius, groundRadius } = geometry;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0d1626';
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.arc(centerX, centerY, atmosphereRadius, Math.PI, 0);
    ctx.fillStyle = '#31584e';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, groundRadius, Math.PI, 0);
    ctx.fillStyle = '#28463e';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, gravityRadius, Math.PI, 0);
    ctx.strokeStyle = 'rgba(90, 180, 220, 0.2)';
    ctx.lineWidth = 6;
    ctx.stroke();
  };
})();
