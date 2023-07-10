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
  const { frequencyDataArray, bpm } = audio;

  ctx.fillStyle = '#00002020';
  ctx.fillRect(0, 0, width, height);

  const bars = frequencyDataArray.length;
  const barWidth = width / bars;
  const barHeight = height;

  ctx.fillStyle = 'rgba(200, 200, 255, 0.8)';

  //Display most probable bpm value
  if(bpm.length > 0) {
    console.log('Tempo', bpm[0].tempo);
  }

  frequencyDataArray.forEach((value, index) => {
    const w = barWidth;
    const x = index * w;
    const h = 0.2 * value / bars * barHeight;
    const y = barHeight - 0.8*h;
    let crossRatio = 0.55;
    ctx.fillRect(crossRatio * x, y-0.2*h, w, 0.5*h);
    ctx.fillRect(bars * w - crossRatio * x, y-0.2*h, w, 0.5*h);

    //ctx.fillRect(x, h-y, w, 0.5*h);
  });
};

const engine = new Engine({
  container: document.getElementById('app'),
  init, update, draw
});
