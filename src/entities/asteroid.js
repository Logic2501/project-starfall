(function () {
  Starfall.entities = Starfall.entities || {};

  const makePolygon = (baseRadius, pointsCount, jitter) => {
    const points = [];
    for (let i = 0; i < pointsCount; i += 1) {
      const t = (i / pointsCount) * Math.PI * 2;
      const radius = baseRadius * (1 - jitter + Math.random() * jitter * 2);
      points.push({ x: Math.cos(t) * radius, y: Math.sin(t) * radius });
    }
    return points;
  };

  const scalePolygon = (polygon, scale) =>
    polygon.map((point) => ({
      x: point.x * scale,
      y: point.y * scale
    }));

  const createLayout = (sizeScale) => {
    const coreCount = 4 + Math.floor(Math.random() * 3); // 4~6
    const detailCount = 4 + Math.floor(Math.random() * 5); // 4~8
    const chunks = [];

    for (let i = 0; i < coreCount; i += 1) {
      chunks.push({
        kind: 'core',
        ox: ((Math.random() - 0.5) * 22) * sizeScale,
        oy: ((Math.random() - 0.5) * 16) * sizeScale,
        polygon: scalePolygon(
          makePolygon(16 + Math.random() * 8, 6 + Math.floor(Math.random() * 3), 0.28),
          sizeScale
        )
      });
    }

    for (let i = 0; i < detailCount; i += 1) {
      chunks.push({
        kind: 'detail',
        ox: ((Math.random() - 0.5) * 30) * sizeScale,
        oy: ((Math.random() - 0.5) * 22) * sizeScale,
        polygon: scalePolygon(
          makePolygon(5 + Math.random() * 5, 5 + Math.floor(Math.random() * 3), 0.4),
          sizeScale
        )
      });
    }
    return chunks;
  };

  Starfall.entities.createAsteroid = (x, y, speed, value, waveId, options = {}) => {
    const sizeScale = options.sizeScale ?? 1;
    const direction = options.direction || { x: 1, y: 0.15 };
    const dirLength = Math.hypot(direction.x, direction.y) || 1;
    const speedBase = speed * Starfall.data.balancing.asteroidBaseSpeedScale;
    const startSpeed = speedBase * Starfall.data.balancing.asteroidSpeedMultiplier;

    return {
      id: crypto.randomUUID(),
      waveId,
      x,
      y,
      vx: (direction.x / dirLength) * startSpeed,
      vy: (direction.y / dirLength) * startSpeed,
      speedBase,
      cruiseSpeed: startSpeed,
      atmosphereAdjusted: false,
      radius: 26 * sizeScale,
      captured: false,
      captureScored: false,
      landingUntil: null,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.8,
      layout: createLayout(sizeScale),
      hp: 100,
      value,
      sizeScale
    };
  };
})();
