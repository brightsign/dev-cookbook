//14/11/24 HTML Dual video playback - RLB

console.log("Dual video player events Test");

const videoElement1 = document.querySelector(".container1 video");
const videoElement2 = document.querySelector(".container2 video");

const container1 = document.querySelector(".container1");
const container2 = document.querySelector(".container2");
const gaplessTransition = 200; // Gapless transition time 
//const delayedVideoTransition = 0.5; // Delayed video transition time
const delayedloadTime1 = 1.0; // Delayed load transition time video 1
const delayedloadTime2 = 0.5; // Delayed load transition time video 2
const delayedTransitionTime1 = 1.0; // Delayed transition show next video time video 1
const delayedTransitionTime2 = 0.5; // Delayed transition show next video time video 2
let triggerTime1;
let triggerTime2;

videoElement1.setAttribute("hwz", "z-index:-1");
videoElement2.setAttribute("hwz", "z-index:-2");

videoElement1.muted = true;
videoElement1.src = "Text_1_small.mov";

videoElement2.muted = true;
videoElement2.src = "Text_2_small.mov";

window.onload = function() {

	console.log("Window loaded...");

    videoElement1.load();

	videoElement1.addEventListener("ended", (event) => {
		console.log("Video 1 ended...");
	});

	videoElement2.addEventListener("ended", (event) => {
		console.log("Video 2 ended...");
	});


	videoElement1.addEventListener("playing", (event) => {
		console.log("Video 1 playing...");
		console.log("video 1 duration: " + videoElement1.duration)
        triggerTime1 = (videoElement1.duration - delayedloadTime1) * 1000; // in milliseconds
        console.log("video 1 Trigger Time: " + triggerTime1)
        // Set a timeout to play videoElement2
		setTimeout(() => {
            videoElement2.src = "";
            videoElement2.src = "Text_2_small.mov";
			videoElement2.load();
			videoElement2.play();
            console.log("Load video 2...");
            setTimeout(() => {
                console.log("Showing video 2...");
                videoElement1.src = "" 
            }, delayedTransitionTime1 * 1000);
		}, triggerTime1);
	})

    videoElement2.addEventListener("playing", (event) => {
		console.log("Video 2 playing...");
		console.log("video 2 duration: " + videoElement2.duration)
        triggerTime2 = (videoElement2.duration - delayedloadTime2) * 1000; // in milliseconds
        console.log("video 2 Trigger Time: " + triggerTime2)
        // Set a timeout to play videoElement1
        setTimeout(() => {
            videoElement1.src = "";
            videoElement1.src = "Text_1_small.mov";
			videoElement1.load();
			videoElement1.play();
            console.log("Load video 1...");
            setTimeout(() => {
                console.log("Showing video 1...");
                videoElement2.src = ""  
            }, delayedTransitionTime2 * 1000);
		}, triggerTime2);
	})

    videoElement1.play();
};