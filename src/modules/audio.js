
export async function initAudio({ fftSize = 128 } = {}) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  console.log(stream);
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = fftSize;
  const bufferLength = analyser.frequencyBinCount;
  const timeDataArray = new Uint8Array(bufferLength);
  const frequencyDataArray = new Uint8Array(bufferLength);
  source.connect(analyser);
  return {
    stream, audioContext, source, analyser, bufferLength, timeDataArray, frequencyDataArray,
  };
};

export async function updateAudio({
  stream, audioContext, source,
  analyser, bufferLength,
  timeDataArray, frequencyDataArray
}) {
  analyser.getByteTimeDomainData(timeDataArray);
  analyser.getByteFrequencyData(frequencyDataArray);
};
