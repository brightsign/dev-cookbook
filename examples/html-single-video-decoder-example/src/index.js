import { readdir } from 'fs/promises';

const rootStoragePath = '/storage/sd';
let currentVideoIndex = 0;

async function main() {
  console.log('main() - Remote liftoff!');

  try {
    let files = await readdir(rootStoragePath + '/assets');
    files = files.filter(filename => !filename.startsWith('.')); // remove hidden files
    
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.addEventListener('ended', () => {
      playNextVideo(files)
    });

    videoPlayer.play();
  } catch (e) {
    console.log(e);
  }
}

// Function to play the next video in the playlist
function playNextVideo(files) {
  const videoPlayer = document.getElementById('video-player');

  currentVideoIndex = (currentVideoIndex + 1) % files.length;
  const filePath = `../assets/${files[currentVideoIndex]}`;

  videoPlayer.src = filePath;
  videoPlayer.play();
}

window.main = main;