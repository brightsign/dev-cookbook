const fs = require('fs');

// Configuration - edit these values as needed
const rootStoragePath = '/storage/sd';
const assetsFolder = 'assets';

// State tracking
let currentVideoIndex = 0;
let visibleVideoPlayer = 1;
let videoFiles = [];

// Helper function to get player element by number
function getPlayer(playerNumber) {
  return document.getElementById(`video-player-${playerNumber}`);
}

// Helper function to get the currently visible and hidden players
function getPlayers() {
  const visible = getPlayer(visibleVideoPlayer);
  const hidden = getPlayer(visibleVideoPlayer === 1 ? 2 : 1);
  return { visible, hidden };
}

async function main() {
  console.log('main() - App ready!');

  try {
    // Load and filter video files
    videoFiles = fs.readdirSync(`${rootStoragePath}/${assetsFolder}`);
    videoFiles = videoFiles.filter(filename => !filename.startsWith('.'));
    videoFiles.sort();
    
    // console.log('Video files:', videoFiles);
    
    if (videoFiles.length === 0) {
      console.error(`No video files found in ${rootStoragePath}/${assetsFolder}`);
      return;
    }
    
    const player1 = getPlayer(1);
    const player2 = getPlayer(2);
    
    // Initialize first video
    player1.src = `${assetsFolder}/${videoFiles[0]}`;
    player1.currentTime = 0;
    player1.muted = false; // Ensure audio is enabled for first player
    player2.muted = true;  // Mute the second player initially
    console.log('Player 1 loaded:', videoFiles[0]);
    
    // Set up video ended listeners for both players
    player1.addEventListener('ended', () => switchToNextVideo());
    player2.addEventListener('ended', () => switchToNextVideo());
    
    // Preload next video once first video starts playing
    player1.addEventListener('playing', () => {
      console.log('Player 1 playing');
      preloadNextVideo();
    }, { once: true });

  } catch (e) {
    console.error('Error in main():', e);
  }
}

// Preload the next video in the hidden player
function preloadNextVideo() {
  const nextVideoIndex = (currentVideoIndex + 1) % videoFiles.length;
  const { hidden } = getPlayers();
  const filePath = `${assetsFolder}/${videoFiles[nextVideoIndex]}`;

  console.log(`Preloading: ${videoFiles[nextVideoIndex]}`);
  
  // Reset and load the next video
  hidden.pause();
  hidden.currentTime = 0;
  hidden.muted = true; // Ensure hidden player is muted
  hidden.src = filePath;
  hidden.load();
}

// Switch to the next video seamlessly
function switchToNextVideo() {
  currentVideoIndex = (currentVideoIndex + 1) % videoFiles.length;
  const { visible: currentPlayer, hidden: nextPlayer } = getPlayers();
  
  console.log(`Switching to: ${videoFiles[currentVideoIndex]}`);
  
  // Ensure next player starts from beginning
  nextPlayer.currentTime = 0;
  
  // Start playing the next video (while still hidden)
  nextPlayer.play().catch(e => console.error('Play error:', e));
  
  // Switch visibility and audio immediately - the video is already preloaded
  currentPlayer.pause();
  currentPlayer.muted = true; // Mute the outgoing player
  currentPlayer.classList.add('hidden');
  
  nextPlayer.muted = false; // Unmute the incoming player
  nextPlayer.classList.remove('hidden');
  
  // Toggle which player is visible
  visibleVideoPlayer = visibleVideoPlayer === 1 ? 2 : 1;
  
  // Preload the next video in the now-hidden player
  preloadNextVideo();
}

// Call main when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
