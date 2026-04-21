(function () {
  Starfall.preview = Starfall.preview || {};
  Starfall.preview.scenes = Starfall.preview.scenes || [];

  const spawnFragments = () => {
    const parts = [];
    for (let i = 0; i < 4; i += 1) {
      parts.push({
        x: 480,
        y: 260,
        r: 12 + Math.random() * 8,
        kind: 'big',
        vx: (Math.random() - 0.5) * 120,
        vy: -40 + Math.random() * 80
      });
    }
    for (let i = 0; i < 16; i += 1) {
      parts.push({
        x: 480,
        y: 260,
        r: 4 + Math.random() * 4,
        kind: 'small',
        vx: (Math.random() - 0.5) * 260,
        vy: (Math.random() - 0.5) * 180
      });
    }
    return parts;
  };

  Starfall.preview.scenes.push({
    id: 'fracture-burst',
    label: '爆裂碎片扩散预览',
    create() {
      return {
        timer: 0,
        fragments: spawnFragments()
      };
    },
    reset(sceneState) {
      sceneState.timer = 0;
      sceneState.fragments = spawnFragments();
    },
    update(sceneState, dt) {
      sceneState.timer += dt;
      for (const f of sceneState.fragments) {
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.vy += 60 * dt;
      }
      if (sceneState.timer > 2.2) {
        sceneState.timer = 0;
        sceneState.fragments = spawnFragments();
      }
    },
    draw(sceneState, ctx, canvas) {
      ctx.fillStyle = '#111727';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const f of sceneState.fragments) {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = f.kind === 'big' ? '#d4a074' : '#f1cb82';
        ctx.fill();
      }

      ctx.fillStyle = '#e6edf8';
      ctx.fillText('命中点附近优先崩裂（大碎块 + 小碎块）', 16, 24);
    }
  });
})();
