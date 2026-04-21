(function () {
  const canvas = document.getElementById('previewCanvas');
  const select = document.getElementById('sceneSelect');
  const playBtn = document.getElementById('playBtn');
  const resetBtn = document.getElementById('resetBtn');

  const runner = Starfall.preview.createRunner({
    canvas,
    scenes: Starfall.preview.scenes
  });

  runner.getScenes().forEach((scene, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = scene.label;
    select.appendChild(option);
  });
  select.value = String(runner.getSceneIndex());

  select.addEventListener('change', (e) => {
    runner.setSceneIndex(Number(e.target.value));
  });

  playBtn.addEventListener('click', () => {
    const playing = runner.togglePlay();
    playBtn.textContent = playing ? '暂停' : '播放';
  });

  resetBtn.addEventListener('click', () => {
    runner.reset();
  });
})();
