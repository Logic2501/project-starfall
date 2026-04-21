(function () {
  Starfall.entities = Starfall.entities || {};
  Starfall.entities.createFragment = ({
    x,
    y,
    waveId,
    size,
    massValue,
    vx,
    vy,
    parts,
    kind = 'detail',
    rotation = 0,
    spin = 0
  }) => ({
    id: crypto.randomUUID(),
    x,
    y,
    waveId,
    vx,
    vy,
    size,
    parts,
    kind,
    rotation,
    spin,
    massValue,
    captureScored: false,
    captured: false,
    landingUntil: null,
    lost_reason: null,
    landed: false
  });
})();
