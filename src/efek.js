'use strict';

const canvas = document.getElementById('efek');
const ctx = canvas.getContext('2d');

ctx.globalCompositeOperation = 'screen';

ctx.canvas.width  = canvas.offsetWidth * 2;
ctx.canvas.height = canvas.offsetHeight * 2;

function getLocalStream() {
  navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((stream) => {
      console.log(stream);

      const audioctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioctx.createMediaStreamSource(stream);

      const analyser = audioctx.createAnalyser();

      analyser.fftSize = 128;
      const bufferLength = analyser.frequencyBinCount;
      const timeDataArray = new Uint8Array(bufferLength);
      const frequencyDataArray = new Uint8Array(bufferLength);

      source.connect(analyser);

      function draw() {
        let WIDTH = ctx.canvas.width;
        let HEIGHT = ctx.canvas.height;
        requestAnimationFrame(draw);

        console.log('draw');

        analyser.getByteTimeDomainData(timeDataArray);
        analyser.getByteFrequencyData(frequencyDataArray);

        ctx.fillStyle = "rgb(10, 10, 10)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.lineWidth = 2;

        ctx.beginPath();

        const sliceWidth = (WIDTH * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {

          const w = timeDataArray[i] / 128.0;
          const v = frequencyDataArray[i] / 128;

          const y = v*0.3*HEIGHT;
          const j = w*0.3*HEIGHT;

          console.log('['+i+':'+v+' - '+x+','+y+']');

          ctx.strokeStyle = "#00ff00";

          let timescale = 0.008;

          var r = parseInt(Math.sin(timescale * Date.now() + i * 0.124 + 128) * 128 + 128);
          var g = parseInt(Math.cos(timescale * Date.now() + i * 0.235) * 128 + 128);
          var b = parseInt(Math.sin(timescale * Date.now() + i * 0.0125) * 128 + 128);
          ctx.fillStyle = 'rgba('+r+','+g+','+b+')';

          if (i === 0) {
            ctx.moveTo(x, y);

          } else {

            ctx.fillStyle = 'rgba('+g+','+b+','+r+', 0.2)';
            ctx.fillRect(WIDTH - 2*x, 0.5*HEIGHT, 2*sliceWidth, y*5 + (Math.sin(0.004 * Date.now() + i * 0.04) * 128));
            ctx.fillRect(WIDTH - 2*x, 0.5*HEIGHT, 2*sliceWidth, -y*5 - (Math.sin(0.004 * Date.now() + i * 0.04) * 128 ));

            ctx.fillStyle = 'rgba('+r+','+g+','+b+', 1)';
            ctx.fillRect(x, 0.5*HEIGHT, sliceWidth, y);
            ctx.fillRect(x, 0.5*HEIGHT, sliceWidth, -y);

            ctx.strokeStyle = "#ffffff";
            ctx.lineTo(x, -j+0.8*HEIGHT);

            ctx.stroke();

          }

          x += sliceWidth;
        }

      }

      draw();

    })
    .catch((err) => {
      console.error(`you got an error: ${err}`);
    });
}

getLocalStream();
