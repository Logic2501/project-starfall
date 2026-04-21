(function () {
  Starfall.render = Starfall.render || {};
  const drawPolygon = (ctx, points) => {
    if (!points || points.length < 3) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
  };

  Starfall.render.drawCombat = ({ ctx }) => {
    const state = Starfall.store.get();

    ctx.save();
    ctx.translate(state.turret.x, state.turret.y);
    ctx.rotate(state.turret.angle);
    ctx.fillStyle = '#97badf';
    ctx.fillRect(0, -12, 116, 24);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(state.turret.x, state.turret.y, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#6f89a8';
    ctx.fill();

    state.asteroids.forEach((a) => {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rotation);
      for (const chunk of a.layout) {
        ctx.save();
        ctx.translate(chunk.ox, chunk.oy);
        drawPolygon(ctx, chunk.polygon);
        if (a.captured) {
          ctx.fillStyle = '#8ee89f';
        } else {
          ctx.fillStyle = chunk.kind === 'core' ? '#8a8f98' : '#9aa0aa';
        }
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    });

    state.fragments.forEach((f) => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rotation);
      for (const part of f.parts) {
        ctx.save();
        ctx.translate(part.ox, part.oy);
        drawPolygon(ctx, part.polygon);
        if (f.captured) {
          ctx.fillStyle = '#8ee89f';
        } else if (part.kind === 'core') {
          ctx.fillStyle = '#d8a36d';
        } else {
          ctx.fillStyle = '#e7c089';
        }
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    });

    state.projectiles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd879';
      ctx.fill();
    });
  };
})();
