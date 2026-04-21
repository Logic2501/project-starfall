(function () {
  Starfall.geometry = {
    getPlanetGeometry(config, canvas) {
      const gravityRadius = canvas.width * config.gravityRangeRadiusFactor;
      const atmosphereRadius = canvas.width * config.atmosphereRadiusFactor;
      const groundRadius = canvas.width * config.groundRadiusFactor;
      const centerOffsetY =
        typeof config.planetCurvature === 'number'
          ? Math.max(groundRadius - canvas.height * config.planetCurvature, 0)
          : config.planetCenterOffsetY;

      return {
        centerX: canvas.width * config.planetCenterXFactor,
        centerY: canvas.height + centerOffsetY,
        gravityRadius,
        atmosphereRadius,
        groundRadius
      };
    },

    getGroundPolyline(config, canvas) {
      const geometry = Starfall.geometry.getPlanetGeometry(config, canvas);
      const points = [];
      const segments = Math.max(8, config.groundArcSegments || 48);
      for (let i = 0; i <= segments; i += 1) {
        const t = i / segments;
        const angle = Math.PI + Math.PI * t;
        points.push({
          x: geometry.centerX + Math.cos(angle) * geometry.groundRadius,
          y: geometry.centerY + Math.sin(angle) * geometry.groundRadius
        });
      }
      return points;
    },

    intersectsGroundArc(body, polyline) {
      const radiusSq = body.radius * body.radius;
      for (let i = 0; i < polyline.length - 1; i += 1) {
        const a = polyline[i];
        const b = polyline[i + 1];
        const abx = b.x - a.x;
        const aby = b.y - a.y;
        const abLenSq = abx * abx + aby * aby || 1;
        const t = Math.max(0, Math.min(1, ((body.x - a.x) * abx + (body.y - a.y) * aby) / abLenSq));
        const px = a.x + abx * t;
        const py = a.y + aby * t;
        const dx = body.x - px;
        const dy = body.y - py;
        if ((dx * dx + dy * dy) <= radiusSq) {
          return true;
        }
      }
      return false;
    }
  };
})();
