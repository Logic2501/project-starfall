(function () {
  Starfall.data = Starfall.data || {};
  Starfall.data.balancing = {
    fireCooldown: 0.18,
    projectileSpeed: 900,
    asteroidBaseSpeedScale: 0.7,
    asteroidSpeedMultiplier: 1.5,
    atmosphereEntrySpeedFactor: 0.9,
    atmosphereDeepSpeedFactor: 0.75,
    projectileCost: 1,
    projectileRadius: 24,
    baseAsteroidValue: 10,
    ablationThreshold: 4,
    weaponProfiles: {
      standardCannon: {
        damage_mode: 'explosive',
        impact_power: 1.0,
        impulse: 160,
        spread: 0.8,
        upwardBias: 0.2,
        decomposition: 1.0
      }
    }
  };
})();
