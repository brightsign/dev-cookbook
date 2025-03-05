// HTML Dual video playback - RLB

console.log("Dual video player events Test");

const videoElement1 = document.querySelector(".container1 video");
const videoElement2 = document.querySelector(".container2 video");
const container1 = document.querySelector(".container1");
const container2 = document.querySelector(".container2");

// Configuration constants
const gaplessTransition = 200; // Gapless transition time 
const delayedloadTime1 = 1.0; // Delayed load transition time video 1
const delayedloadTime2 = 0.5; // Delayed load transition time video 2
const delayedTransitionTime1 = 1.0; // Delayed transition show next video time video 1
const delayedTransitionTime2 = 0.5; // Delayed transition show next video time video 2

// Timing variables
let triggerTime1;
let triggerTime2;

// Initialize video settings
function initializeVideo(videoElement, zIndex, source) {
    videoElement.setAttribute("hwz", `z-index:${zIndex}`);
    videoElement.muted = true;
    videoElement.src = `../assets/${source}`;
}

// Promise wrapper for setTimeout
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function handleVideo1Playing(event) {
    console.log("Video 1 playing...");
    console.log("video 1 duration: " + videoElement1.duration);
    triggerTime1 = (videoElement1.duration - delayedloadTime1) * 1000;
    console.log("video 1 Trigger Time: " + triggerTime1);

    await delay(triggerTime1);
    videoElement2.src = "";
    videoElement2.src = "../assets/Text_2_small.mov";
    videoElement2.load();
    videoElement2.play();
    console.log("Load video 2...");
    
    await delay(delayedTransitionTime1 * 1000);
    console.log("Showing video 2...");
    videoElement1.src = "";
}

async function handleVideo2Playing(event) {
    console.log("Video 2 playing...");
    console.log("video 2 duration: " + videoElement2.duration);
    triggerTime2 = (videoElement2.duration - delayedloadTime2) * 1000;
    console.log("video 2 Trigger Time: " + triggerTime2);

    await delay(triggerTime2);
    videoElement1.src = "";
    videoElement1.src = "../assets/Text_1_small.mov";
    videoElement1.load();
    videoElement1.play();
    console.log("Load video 1...");
    
    await delay(delayedTransitionTime2 * 1000);
    console.log("Showing video 1...");
    videoElement2.src = "";
}

window.onload = async function() {
    console.log("Window loaded...");

    // Initialize videos
    initializeVideo(videoElement1, -1, "Text_1_small.mov");
    initializeVideo(videoElement2, -2, "Text_2_small.mov");
    videoElement1.load();

    // Event listeners for video end
    videoElement1.addEventListener("ended", () => {
        console.log("Video 1 ended...");
    });

    videoElement2.addEventListener("ended", () => {
        console.log("Video 2 ended...");
    });

    // Event listeners for video playing
    videoElement1.addEventListener("playing", handleVideo1Playing);
    videoElement2.addEventListener("playing", handleVideo2Playing);

    videoElement1.play();
};