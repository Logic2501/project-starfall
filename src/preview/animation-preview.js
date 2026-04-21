(function () {
  Starfall.preview = Starfall.preview || {};

  Starfall.preview.createRunner = ({ canvas, scenes }) => {
    const ctx = canvas.getContext('2d');
    const state = {
      scenes,
      sceneIndex: 0,
      playing: true,
      sceneState: null,
      lastTs: performance.now()
    };

    const activateScene = (index) => {
      state.sceneIndex = index;
      const scene = state.scenes[state.sceneIndex];
      state.sceneState = scene.create();
      scene.reset?.(state.sceneState);
    };

    const reset = () => {
      activateScene(state.sceneIndex);
    };

    const setSceneIndex = (index) => {
      activateScene(index);
    };

    const togglePlay = () => {
      state.playing = !state.playing;
      return state.playing;
    };

    const tick = (ts) => {
      const dt = Math.min(0.033, (ts - state.lastTs) / 1000);
      state.lastTs = ts;
      const scene = state.scenes[state.sceneIndex];

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (state.playing) {
        scene.update?.(state.sceneState, dt);
      }
      scene.draw(state.sceneState, ctx, canvas);
      requestAnimationFrame(tick);
    };

    activateScene(0);
    requestAnimationFrame(tick);

    return {
      getScenes: () => state.scenes,
      getSceneIndex: () => state.sceneIndex,
      isPlaying: () => state.playing,
      setSceneIndex,
      togglePlay,
      reset
    };
  };
})();
