import { createRealTimeBpmProcessor } from 'realtime-bpm-analyzer';

export async function initAudio({ fftSize = 128 } = {}) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = fftSize;
  const bufferLength = analyser.frequencyBinCount;
  const timeDataArray = new Uint8Array(bufferLength);
  const frequencyDataArray = new Uint8Array(bufferLength);
  const audio = {
    stream, audioContext, source, analyser, bufferLength,
    timeDataArray, frequencyDataArray,
    bpm: []
  };
  source.connect(analyser);

  const realtimeAnalyzerNode = await createRealTimeBpmProcessor(audioContext);
  realtimeAnalyzerNode.port.onmessage = (event) => {
    //console.log(event.data);
    if(event.data.message.startsWith('BPM')){
      audio.bpm = event.data.result.bpm;
    }
  };
  source.connect(realtimeAnalyzerNode);

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
  stream, audioContext, source,
  analyser, bufferLength,
  timeDataArray, frequencyDataArray, bpm,
}) {
  analyser.getByteTimeDomainData(timeDataArray);
  analyser.getByteFrequencyData(frequencyDataArray);
};
