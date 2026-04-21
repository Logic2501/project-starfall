(function () {
  Starfall.systems = Starfall.systems || {};
  Starfall.systems.collision = {
    update() {
      const state = Starfall.store.get();
      const impacts = [];
      for (const p of state.projectiles) {
        for (const a of state.asteroids) {
          const dx = a.x - p.x;
          const dy = a.y - p.y;
          if ((dx * dx + dy * dy) <= (a.radius + p.radius) ** 2) {
            impacts.push({
              projectileId: p.id,
              asteroidId: a.id,
              point: { x: p.x, y: p.y },
              direction: { x: p.vx, y: p.vy },
              damageProfile: p.damageProfile || null
            });
          }
        }
      }
      if (impacts.length > 0) {
        Starfall.systems.fracture.applyImpacts(impacts);
      }
    }
  };
})();
