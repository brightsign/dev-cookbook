import { readdir } from 'fs/promises';

// HTML Single video playback - RLB

console.log("Single video player events Test");

const videoPlayer = document.querySelector(".container1 video");
const container = document.querySelector(".container1");
let currentVideoIndex = 0;
let videoFiles = [];

async function loadVideoFiles() {
    try {
        const rootStoragePath = '/storage/sd';
        let files = await readdir(rootStoragePath + '/assets');
        videoFiles = files.filter(filename => !filename.startsWith('.'));
        console.log("Video files loaded:", videoFiles);
    } catch (e) {
        console.error("Error loading video files:", e);
    }
}

window.onload = async function() {
    console.log("Window loaded...");
    
    await loadVideoFiles();
    videoPlayer.setAttribute("hwz", "z-index:-1");

    videoPlayer.addEventListener("ended", () => {
        console.log("Video ended...");
        playNextVideo();
    });

    videoPlayer.addEventListener("playing", (event) => {
        console.log("Video playing...");
        console.log("video duration: " + videoPlayer.duration);
    });

    videoPlayer.play();
    console.log("Initial video started...");
};

function playNextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videoFiles.length;
    const filePath = `../assets/${videoFiles[currentVideoIndex]}`;
    
    console.log("Loading next video: " + filePath);
    videoPlayer.src = "";  // Clear current source
    videoPlayer.src = filePath;
    videoPlayer.load();
    videoPlayer.play();
    console.log("Next video started...");
}