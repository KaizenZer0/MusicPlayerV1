const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const canvas = document.getElementById('visualizer');
const canvasContext = canvas.getContext('2d');
const card = document.querySelector('.card'); // Select the card element

let isPlaying = false;

playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.textContent = 'Play';
        card.classList.remove('glowing'); // Remove glowing effect when paused
    } else {
        audioPlayer.play();
        playPauseBtn.textContent = 'Pause';
        card.classList.add('glowing'); // Add glowing effect when playing
    }
    isPlaying = !isPlaying;
});

audioPlayer.addEventListener('ended', () => {
    playPauseBtn.textContent = 'Play';
    isPlaying = false;
    card.classList.remove('glowing'); // Remove glowing effect when music ends
});

// Setup audio visualizer
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audioPlayer);
source.connect(analyser);
analyser.connect(audioContext.destination);
analyser.fftSize = 128;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

function draw() {
    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 1.0;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
    
        // Orange and White Gradient
        const red = 255; // Maximum red value for the orange color
        const green = 165 + (90 * (i / bufferLength)); // Starts at 165 for orange and increases towards white
        const blue = 0 + (255 * (i / bufferLength)); // Starts at 0 (orange) and increases towards white
    
        canvasContext.fillStyle = `rgb(${red},${green},${blue})`;
        canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    
        x += barWidth + 1;
    }
}

draw();

audioPlayer.addEventListener('play', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
});
