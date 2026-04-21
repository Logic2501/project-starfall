(function () {
  Starfall.config = {
    canvas: { width: 1280, height: 720 },
    planetCenterXFactor: 0.5,
    planetCurvature: 0.37,
    planetCenterOffsetY: 663.52,
    gravityRangeRadiusFactor: 1.027,
    atmosphereRadiusFactor: 0.846,
    groundRadiusFactor: 0.7265,
    groundArcSegments: 48,
    landingHighlightSeconds: 0.45,
    spawnTopZoneRatio: 0.4,
    trajectoryWeights: {
      graze: 0.7,
      nearMiss: 0.2,
      recoverable: 0.1
    },
    fragmentGravity: 28600,
    asteroidGravity: 14950,
    prototypeVersion: 'v0.2'
  };
})();
