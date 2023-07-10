import { createRealTimeBpmProcessor } from 'realtime-bpm-analyzer';
import styles from '../styles/audio-player.scss';

export function createAudioPlayer({
  src, container = document.body
}) {
  const player = new Audio();
  player.crossOrigin = 'anonymous';
  player.src = src;
  player.loop = true;
  player.autoplay = true;
  player.controls = true;
  container.appendChild(player);
  return player;
}

export async function initAudio({ fftSize = 128, player } = {}) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = fftSize;
  const realtimeAnalyzerNode = await createRealTimeBpmProcessor(audioContext);

  let songSource, micSource;

  if(player) {
    songSource = audioContext.createMediaElementSource(player);
    songSource.connect(analyser);
    songSource.connect(audioContext.destination);
    songSource.connect(realtimeAnalyzerNode);
  } else {
    micSource = audioContext.createMediaStreamSource(stream);
    micSource.connect(analyser);
    micSource.connect(realtimeAnalyzerNode);
  }

  const bufferLength = analyser.frequencyBinCount;
  const timeDataArray = new Uint8Array(bufferLength);
  const frequencyDataArray = new Uint8Array(bufferLength);
  const audio = {
    stream, audioContext, songSource, micSource, analyser, bufferLength,
    timeDataArray, frequencyDataArray,
    bpm: []
  };

  realtimeAnalyzerNode.port.onmessage = (event) => {
    //console.log(event.data);
    if(event.data.message.startsWith('BPM')){
      audio.bpm = event.data.result.bpm;
    }
  };

  // Enable the continuous feature
  realtimeAnalyzerNode.port.postMessage({
    message: 'ASYNC_CONFIGURATION',
    parameters: {
      continuousAnalysis: true,
      stabilizationTime: 10_000,
    }
  });


  return audio;
};

export async function updateAudio({
  stream, audioContext, songSource, micSource,
  analyser, bufferLength,
  timeDataArray, frequencyDataArray, bpm,
}) {
  analyser.getByteTimeDomainData(timeDataArray);
  analyser.getByteFrequencyData(frequencyDataArray);
};
