(function () {
  Starfall.systems = Starfall.systems || {};
  let cooldown = 0;

  Starfall.systems.projectile = {
    fire() {
      const state = Starfall.store.get();
      if (cooldown > 0 || state.resources < Starfall.data.balancing.projectileCost) {
        return;
      }
      const p = Starfall.entities.createProjectile(
        state.turret.x + Math.cos(state.turret.angle) * 60,
        state.turret.y + Math.sin(state.turret.angle) * 60,
        state.turret.angle,
        Starfall.data.balancing.projectileSpeed,
        Starfall.data.balancing.weaponProfiles.standardCannon
      );
      state.projectiles.push(p);
      state.resources -= Starfall.data.balancing.projectileCost;
      if (state.activeWaveId !== null) {
        Starfall.store.ensureWaveStats(state.activeWaveId).projectileSpend += Starfall.data.balancing.projectileCost;
      }
      cooldown = Starfall.data.balancing.fireCooldown;
    },
    update(dt) {
      cooldown = Math.max(0, cooldown - dt);
      const state = Starfall.store.get();
      state.projectiles.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.ttl -= dt;
      });
      state.projectiles = state.projectiles.filter((p) => p.ttl > 0);
    }
  };
})();
