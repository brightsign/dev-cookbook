import { readdir } from 'fs/promises';

// HTML Single video playback - RLB

console.log("Single video player events Test");

const videoElement1 = document.querySelector("#video-player");
const container1 = document.querySelector(".container1");

// Configuration constants
const loadDelay = 0.5; // Delay before loading next video

// Video management variables
let currentVideoIndex = 0;
let videoFiles = [];

// Initialize video settings
function initializeVideo(videoElement) {
    videoElement.setAttribute("hwz", "z-index:-1");
    videoElement.muted = true;
}

async function loadVideoFiles() {
    try {
        const rootStoragePath = '/storage/sd';
        let files = await readdir(rootStoragePath + '/assets');
        videoFiles = files.filter(filename => !filename.startsWith('.') && filename.endsWith('.mov'));
        console.log("Video files loaded:", videoFiles);
    } catch (e) {
        console.error("Error loading video files:", e);
    }
}

function playNextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videoFiles.length;
    const filePath = `../assets/${videoFiles[currentVideoIndex]}`;
    
    console.log("Loading next video: " + filePath);
    videoElement1.src = "";  // Clear current source
    videoElement1.src = filePath;
    videoElement1.load();
    videoElement1.play();
    console.log("Next video started...");
}

window.onload = async function() {
    console.log("Window loaded...");
    
    await loadVideoFiles();
    initializeVideo(videoElement1);

    // Event listeners for video states
    videoElement1.addEventListener("ended", () => {
        console.log("Video ended...");
        playNextVideo();
    });

    videoElement1.addEventListener("playing", (event) => {
        console.log("Video playing...");
        console.log("video duration: " + videoElement1.duration);
    });

    videoElement1.play();
    console.log("Initial video started...");
};