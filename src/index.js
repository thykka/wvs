import Engine from './modules/engine.js';
import { initAudio, updateAudio } from './modules/audio.js';

const init = async (canvas) => {
  const width = innerWidth * .816;
  const height = innerHeight * .816;
  canvas.width = width;
  canvas.height = height;
  return {
    audio: await initAudio()
  };
};

const update = async (state) => {
  updateAudio(state.audio);
  return state;
};

const draw = (state) => {
  const { canvas, ctx, audio } = state;
  const { width, height } = canvas;
  const { frequencyDataArray } = audio;

  ctx.clearRect(0, 0, width, height);

  const bars = frequencyDataArray.length;
  const barWidth = width / bars;
  const barHeight = height;

  frequencyDataArray.forEach((value, index) => {
    const w = barWidth;
    const x = index * w;
    const h = value / bars * barHeight;
    const y = barHeight - h;
    ctx.fillRect(x, y, w, h);
  });
};

const engine = new Engine({
  container: document.getElementById('app'),
  init, update, draw
});
