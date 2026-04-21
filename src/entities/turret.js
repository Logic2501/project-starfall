(function () {
  Starfall.entities = Starfall.entities || {};
  Starfall.entities.updateTurretAngle = (state, targetX, targetY) => {
    state.turret.angle = Math.atan2(targetY - state.turret.y, targetX - state.turret.x);
  };
})();
