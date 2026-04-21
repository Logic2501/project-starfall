(function () {
  Starfall.entities = Starfall.entities || {};
  Starfall.entities.createProjectile = (x, y, angle, speed, damageProfile) => ({
    id: crypto.randomUUID(),
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: Starfall.data.balancing.projectileRadius,
    ttl: 2.0,
    damageProfile
  });
})();
