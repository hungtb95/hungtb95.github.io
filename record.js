
window.onload = () => {

  const videoElement = document.getElementById('videoElement');
  const captureBtn = document.getElementById('captureBtn');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const download = document.getElementById('download');

  let blobs;
  let blob;
  let record;
  let stream;
  let voiceStream;
  let desktopStream;
  
  startBtn.style.display = 'none';
  stopBtn.style.display = 'none';

  captureBtn.onclick = async () => {
    download.style.display = 'none';
    captureBtn.style.display = 'none';
    startBtn.style.display = 'inline-block';

    const config = {
      video: true,
      audio: false,
      frameRate: 30,
      height: 2160,
      width: 3840
    };
    
    desktopStream = await navigator.mediaDevices.getDisplayMedia(config)

    const tracks = [
      ...desktopStream.getVideoTracks()
    ];
    
    console.log('Add tracks', tracks);
    stream = new MediaStream(tracks);
    const name = stream.id;
    console.log(stream);
    videoElement.srcObject = stream;
    videoElement.muted = true;
      
    blobs = [];
  
    record = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp8,opus'});
    record.ondataavailable = (e) => blobs.push(e.data);
    record.onstop = async () => {
      blob = new Blob(blobs, {type: 'video/webm'});
      let url = window.URL.createObjectURL(blob);
      console.log(blob);
      console.log(url);
      download.href = url;
      download.download = `${name}.webm`;
      download.style.display = 'block';
      videoElement.src = url;
      videoElement.controls = true;
    };
    startBtn.disabled = false;
    captureBtn.disabled = true;
  };

  startBtn.onclick = () => {
    stopBtn.style.display = 'inline-block';
    startBtn.style.display = 'none';
    startBtn.disabled = true;
    stopBtn.disabled = false;
    record.start();
  };

  stopBtn.onclick = () => {
    captureBtn.style.display = 'inline-block';
    startBtn.style.display = 'inline-block';
    captureBtn.disabled = false;
    startBtn.disabled = true;
    stopBtn.disabled = true;
    
    record.stop();
    const streams = stream.getTracks();
    streams.forEach(stream => stream.stop());
    videoElement.srcObject = null
    stream = null;
  };
};