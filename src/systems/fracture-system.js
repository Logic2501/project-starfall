(function () {
  Starfall.systems = Starfall.systems || {};

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  const rotate = (x, y, angle) => ({
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle)
  });

  const normalize = (x, y) => {
    const len = Math.hypot(x, y) || 1;
    return { x: x / len, y: y / len };
  };

  const getPolygonRadius = (polygon) => {
    let r = 0;
    for (const p of polygon) {
      r = Math.max(r, Math.hypot(p.x, p.y));
    }
    return r;
  };

  const buildFragmentVelocity = ({ impact, worldPos, damageProfile }) => {
    const profile = damageProfile || Starfall.data.balancing.weaponProfiles.standardCannon;
    const shotDir = normalize(impact.direction?.x ?? 1, impact.direction?.y ?? 0);
    const away = normalize(worldPos.x - impact.point.x, worldPos.y - impact.point.y);
    const mixX = away.x * profile.spread + shotDir.x * (1 - profile.spread);
    const mixY = away.y * profile.spread + shotDir.y * (1 - profile.spread) - profile.upwardBias;
    const out = normalize(mixX, mixY);
    const speed = profile.impulse * profile.impact_power * (0.65 + Math.random() * 0.7);
    return { vx: out.x * speed, vy: out.y * speed };
  };

  const pickSeeds = (chunks, count) => {
    const shuffled = [...chunks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const rotateVector = (x, y, angle) => ({
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle)
  });

  const buildGroupsByDecomposition = (chunks, decomposition) => {
    if (chunks.length <= 1) return [{ chunks, preserveDirection: true }];

    const coreChunks = chunks.filter((c) => c.kind === 'core');
    const detailChunks = chunks.filter((c) => c.kind !== 'core');
    if (coreChunks.length === 0) {
      return [{ chunks, preserveDirection: true }];
    }

    const desiredLargeGroups = 2 + Math.floor(Math.random() * 2); // 2~3
    const largeGroupCount = Math.max(2, Math.min(desiredLargeGroups, coreChunks.length));
    const coreSeeds = pickSeeds(coreChunks, largeGroupCount);
    const largeGroups = Array.from({ length: coreSeeds.length }, () => []);

    coreChunks.forEach((chunk) => {
      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      coreSeeds.forEach((seed, i) => {
        const dx = seed.ox - chunk.ox;
        const dy = seed.oy - chunk.oy;
        const d = dx * dx + dy * dy;
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      });
      largeGroups[bestIdx].push(chunk);
    });

    const detachCount = Math.min(
      detailChunks.length,
      Math.round(detailChunks.length * clamp01(decomposition))
    );
    const shuffledDetail = [...detailChunks].sort(() => Math.random() - 0.5);
    const detachedDetails = shuffledDetail.slice(0, detachCount);
    const keptDetails = shuffledDetail.slice(detachCount);

    // 一部分小块继续粘在大碎块上，维持 2~3 个较大的主碎块视觉。
    keptDetails.forEach((chunk, idx) => {
      largeGroups[idx % largeGroups.length].push(chunk);
    });

    const outputGroups = largeGroups
      .filter((g) => g.length > 0)
      .map((chunksInGroup) => ({ chunks: chunksInGroup, preserveDirection: true }));

    if (detachedDetails.length > 0) {
      const smallGroupCount = Math.max(
        1,
        Math.min(detachedDetails.length, 1 + Math.round(clamp01(decomposition) * 3))
      );
      const detailSeeds = pickSeeds(detachedDetails, smallGroupCount);
      const smallGroups = Array.from({ length: detailSeeds.length }, () => []);
      detachedDetails.forEach((chunk) => {
        let bestIdx = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        detailSeeds.forEach((seed, i) => {
          const dx = seed.ox - chunk.ox;
          const dy = seed.oy - chunk.oy;
          const d = dx * dx + dy * dy;
          if (d < bestDist) {
            bestDist = d;
            bestIdx = i;
          }
        });
        smallGroups[bestIdx].push(chunk);
      });
      outputGroups.push(
        ...smallGroups.filter((g) => g.length > 0).map((g) => ({ chunks: g, preserveDirection: false }))
      );
    }

    return outputGroups;
  };

  const buildFragmentsFromAsteroid = (asteroid, impact) => {
    const profile = impact.damageProfile || Starfall.data.balancing.weaponProfiles.standardCannon;
    const effectiveDecomposition = clamp01((profile.decomposition ?? 1) * (0.75 + profile.impact_power * 0.35));

    const groups = buildGroupsByDecomposition(asteroid.layout, effectiveDecomposition);
    const fragments = [];
    const asteroidDir = normalize(asteroid.vx, asteroid.vy);
    const asteroidSpeed = Math.hypot(asteroid.vx, asteroid.vy);

    for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
      const { chunks: group, preserveDirection } = groups[groupIndex];
      let cx = 0;
      let cy = 0;
      for (const chunk of group) {
        cx += chunk.ox;
        cy += chunk.oy;
      }
      cx /= group.length;
      cy /= group.length;

      const parts = group.map((chunk) => ({
        kind: chunk.kind,
        ox: chunk.ox - cx,
        oy: chunk.oy - cy,
        polygon: chunk.polygon
      }));

      let size = 0;
      let massValue = 0;
      let hasCore = false;
      for (const part of parts) {
        const polygonRadius = getPolygonRadius(part.polygon);
        size = Math.max(size, Math.hypot(part.ox, part.oy) + polygonRadius);
        if (part.kind === 'core') {
          hasCore = true;
          massValue += asteroid.value * 0.18;
        } else {
          massValue += asteroid.value * 0.07;
        }
      }

      const centerWorldOffset = rotate(cx, cy, asteroid.rotation);
      const worldPos = {
        x: asteroid.x + centerWorldOffset.x,
        y: asteroid.y + centerWorldOffset.y
      };
      let velocity = buildFragmentVelocity({ impact, worldPos, damageProfile: profile });
      if (preserveDirection) {
        // 大碎块保持原方向（偏移不超过 30 度）。
        const angleOffset = (Math.random() * 2 - 1) * (Math.PI / 6);
        const dir = rotateVector(asteroidDir.x, asteroidDir.y, angleOffset);
        const keepSpeed = asteroidSpeed * (0.9 + profile.impact_power * 0.25);
        velocity = {
          vx: dir.x * keepSpeed + (Math.random() - 0.5) * 10,
          vy: dir.y * keepSpeed + (Math.random() - 0.5) * 10
        };
      }

      fragments.push(
        Starfall.entities.createFragment({
          x: worldPos.x,
          y: worldPos.y,
          waveId: asteroid.waveId,
          size,
          parts,
          kind: hasCore ? 'core' : 'detail',
          massValue,
          vx: velocity.vx,
          vy: velocity.vy,
          rotation: asteroid.rotation,
          spin: (Math.random() - 0.5) * 2.4
        })
      );
    }

    return fragments;
  };

  Starfall.systems.fracture = {
    applyImpacts(impacts) {
      const state = Starfall.store.get();
      const firstImpactByAsteroid = new Map();
      for (const impact of impacts) {
        if (!firstImpactByAsteroid.has(impact.asteroidId)) {
          firstImpactByAsteroid.set(impact.asteroidId, impact);
        }
      }
      const dedupedImpacts = [...firstImpactByAsteroid.values()];

      const projectileHitSet = new Set(impacts.map((i) => i.projectileId));
      const asteroidHitSet = new Set(dedupedImpacts.map((i) => i.asteroidId));

      state.projectiles = state.projectiles.filter((p) => !projectileHitSet.has(p.id));

      for (const impact of dedupedImpacts) {
        const asteroid = state.asteroids.find((a) => a.id === impact.asteroidId);
        if (!asteroid) {
          continue;
        }
        const generated = buildFragmentsFromAsteroid(asteroid, impact);
        state.fragments.push(...generated);
      }

      for (const asteroidId of asteroidHitSet) {
        const asteroid = state.asteroids.find((a) => a.id === asteroidId);
        if (asteroid) {
          Starfall.store.ensureWaveStats(asteroid.waveId).shattered += 1;
        }
      }
      state.asteroids = state.asteroids.filter((a) => !asteroidHitSet.has(a.id));
    }
  };
})();
