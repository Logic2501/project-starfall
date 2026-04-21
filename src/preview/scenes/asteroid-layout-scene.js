(function () {
  Starfall.preview = Starfall.preview || {};
  Starfall.preview.scenes = Starfall.preview.scenes || [];

  const drawPolygon = (ctx, points) => {
    if (!points || points.length < 3) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
  };

  Starfall.preview.scenes.push({
    id: 'asteroid-layout',
    label: '天体拼接结构预览',
    create() {
      return {
        asteroid: Starfall.entities.createAsteroid(480, 270, 0, 10)
      };
    },
    reset(sceneState) {
      sceneState.asteroid = Starfall.entities.createAsteroid(480, 270, 0, 10);
    },
    update(sceneState, dt) {
      sceneState.asteroid.rotation += dt * 0.6;
    },
    draw(sceneState, ctx, canvas) {
      const a = sceneState.asteroid;
      ctx.fillStyle = '#0d1626';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rotation);
      for (const chunk of a.layout) {
        ctx.save();
        ctx.translate(chunk.ox, chunk.oy);
        drawPolygon(ctx, chunk.polygon);
        ctx.fillStyle = chunk.kind === 'core' ? '#8a8f98' : '#a2a8b1';
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      ctx.fillStyle = '#d8e0ee';
      ctx.fillText('主体块 + 附着块（统一生成框架）', 16, 24);
    }
  });
})();
