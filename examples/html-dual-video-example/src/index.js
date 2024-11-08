import { readdir } from "fs/promises";

const rootStoragePath = "/storage/sd";
const assetPath = "/assets";
let currentVideoIndex = 0;
let visibleVideoPlayer = 1;

async function main() {
    console.log("main() - liftoff!");

    try {
        let files = await readdir(rootStoragePath + "/assets");
        files = files.filter((filename) => !filename.startsWith(".")); // remove hidden files

        const videoPlayer1 = document.getElementById("video-player-1");
        videoPlayer1.addEventListener("ended", () => playNextVideo(files));

        const videoPlayer2 = document.getElementById("video-player-2");
        videoPlayer2.addEventListener("ended", () => playNextVideo(files));

        videoPlayer1.play();

        preloadNextVideoMetadata(files);
    } catch (e) {
        console.log(e);
    }
}

// Function to preload metadata for the next video
function preloadNextVideoMetadata(files) {
    const nextVideoIndex = (currentVideoIndex + 1) % files.length;
    const nextVideoPlayerId =
        visibleVideoPlayer === 1 ? "video-player-2" : "video-player-1";
    const nextVideoPlayer = document.getElementById(nextVideoPlayerId);
    const filePath = `..${assetPath}/${files[nextVideoIndex]}`;

    nextVideoPlayer.src = filePath;
    nextVideoPlayer.load();
}

// Function to play the next video in the playlist
function playNextVideo(files) {
    currentVideoIndex = (currentVideoIndex + 1) % files.length;
    const currentVideoPlayerId =
        visibleVideoPlayer === 1 ? "video-player-1" : "video-player-2";
    const videoPlayer = document.getElementById(currentVideoPlayerId);
    videoPlayer.classList.add("hidden");

    visibleVideoPlayer = visibleVideoPlayer === 1 ? 2 : 1;

    const nextVideoPlayerId =
        visibleVideoPlayer === 1 ? "video-player-1" : "video-player-2";
    const nextVideoPlayer = document.getElementById(nextVideoPlayerId);
    nextVideoPlayer.classList.remove("hidden");
    nextVideoPlayer.play();

    // Preload metadata for the next video after starting the current one
    preloadNextVideoMetadata(files);
}

window.main = main;
