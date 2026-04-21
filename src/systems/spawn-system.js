 (function () {
  Starfall.systems = Starfall.systems || {};

  const pickWeighted = (weights) => {
    const total = Object.values(weights).reduce((sum, value) => sum + value, 0) || 1;
    let roll = Math.random() * total;
    for (const [key, value] of Object.entries(weights)) {
      roll -= value;
      if (roll <= 0) return key;
    }
    return Object.keys(weights)[0];
  };

  const sampleEntry = () => pickWeighted({ top: 0.42, 'left-upper': 0.29, 'right-upper': 0.29 });

  const rotate = (x, y, angle) => ({
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle)
  });

  const normalize = (x, y) => {
    const len = Math.hypot(x, y) || 1;
    return { x: x / len, y: y / len };
  };

  const sampleTrajectoryClass = (weights) => pickWeighted(weights);

  const sampleDirection = (entry, trajectoryClass, spawnX, canvasWidth) => {
    const fromLeft = spawnX < canvasWidth * 0.5;
    const directionMap = {
      top: {
        graze: fromLeft ? { x: 0.95, y: 0.22 } : { x: -0.95, y: 0.22 },
        nearMiss: fromLeft ? { x: 0.72, y: 0.42 } : { x: -0.72, y: 0.42 },
        recoverable: fromLeft ? { x: 0.45, y: 0.64 } : { x: -0.45, y: 0.64 }
      },
      'left-upper': {
        graze: { x: 0.98, y: 0.08 },
        nearMiss: { x: 0.9, y: 0.24 },
        recoverable: { x: 0.78, y: 0.4 }
      },
      'right-upper': {
        graze: { x: -0.98, y: 0.08 },
        nearMiss: { x: -0.9, y: 0.24 },
        recoverable: { x: -0.78, y: 0.4 }
      }
    };
    const spreadMap = {
      graze: Math.PI / 18,
      nearMiss: Math.PI / 14,
      recoverable: Math.PI / 16
    };
    const base = directionMap[entry][trajectoryClass];
    const rotated = rotate(base.x, base.y, (Math.random() * 2 - 1) * spreadMap[trajectoryClass]);
    return normalize(rotated.x, rotated.y);
  };

  const sampleSpawnPoint = (entry, canvasWidth, canvasHeight, topZoneRatio) => {
    const topLimit = canvasHeight * topZoneRatio;
    if (entry === 'top') {
      return {
        x: 120 + Math.random() * (canvasWidth - 240),
        y: -canvasHeight * 0.08 + Math.random() * (canvasHeight * 0.23)
      };
    }
    if (entry === 'left-upper') {
      return {
        x: -80,
        y: canvasHeight * 0.02 + Math.random() * (topLimit - canvasHeight * 0.02)
      };
    }
    return {
      x: canvasWidth + 80,
      y: canvasHeight * 0.02 + Math.random() * (topLimit - canvasHeight * 0.02)
    };
  };

  Starfall.systems.spawn = {
    sampleTrajectoryClass,
    sampleDirection,

    spawnWave(waveIndex, waveId) {
      const state = Starfall.store.get();
      const wave = Starfall.data.waves[Math.min(waveIndex, Starfall.data.waves.length - 1)];
      const canvas = Starfall.config.canvas;

      for (let i = 0; i < wave.spawnCount; i += 1) {
        const entry = sampleEntry();
        const spawn = sampleSpawnPoint(entry, canvas.width, canvas.height, Starfall.config.spawnTopZoneRatio);
        const trajectoryClass = sampleTrajectoryClass(Starfall.config.trajectoryWeights);
        const direction = sampleDirection(entry, trajectoryClass, spawn.x, canvas.width);
        const sizeScale = 0.8 + Math.random() * 0.7;
        const asteroid = Starfall.entities.createAsteroid(
          spawn.x,
          spawn.y,
          wave.speed,
          Math.round(wave.value * (0.85 + sizeScale * 0.25)),
          waveId,
          {
            sizeScale,
            direction
          }
        );
        asteroid.spawnEntry = entry;
        asteroid.trajectoryClass = trajectoryClass;
        state.asteroids.push(asteroid);
      }
    }
  };
})();
