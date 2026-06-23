const fs = require('fs');

// Configuration - edit these values as needed
const rootStoragePath = '/storage/sd';
const assetsFolder = 'assets';

// Enable on players with multiple hardware decode pipelines (XT, 4K series) for
// near-zero-gap transitions via decoder pre-warming and early start. On single-
// decoder hardware, leave false — pre-warming would compete with the active
// player's decoder and may cause stuttering. See README for details.
const MULTI_DECODER = false;

// State tracking
let currentVideoIndex = 0;
let visibleVideoPlayer = 1;
let videoFiles = [];

function getPlayer(playerNumber) {
  return document.getElementById(`video-player-${playerNumber}`);
}

function getPlayers() {
  const visible = getPlayer(visibleVideoPlayer);
  const hidden = getPlayer(visibleVideoPlayer === 1 ? 2 : 1);
  return { visible, hidden };
}

function preloadNextVideo() {
  const nextVideoIndex = (currentVideoIndex + 1) % videoFiles.length;
  const { hidden } = getPlayers();
  hidden.pause();
  hidden.currentTime = 0;
  hidden.muted = true;
  hidden.src = `${assetsFolder}/${videoFiles[nextVideoIndex]}`;
  hidden.load();

  if (MULTI_DECODER) {
    // Warm the decode pipeline so play() starts near-instantly at switch time
    hidden.addEventListener('canplay', () => {
      hidden.play().then(() => { hidden.pause(); hidden.currentTime = 0; }).catch(() => {});
    }, { once: true });
  }
}

// Multi-decoder only: start hidden player 0.5s before end so it's already
// playing when the swap happens, eliminating decoder handoff gap.
function armEarlyStart() {
  const { visible } = getPlayers();
  visible.addEventListener('timeupdate', function onNearEnd() {
    if (visible.duration - visible.currentTime <= 0.5) {
      visible.removeEventListener('timeupdate', onNearEnd);
      getPlayers().hidden.play().catch(() => {});
    }
  });
}

function switchToNextVideo() {
  currentVideoIndex = (currentVideoIndex + 1) % videoFiles.length;
  const { visible: currentPlayer, hidden: nextPlayer } = getPlayers();

  if (MULTI_DECODER) {
    // Early start may already have the hidden player running — swap instantly.
    // Otherwise wait for `playing` to avoid revealing an unrendered frame.
    const doSwap = () => {
      currentPlayer.pause();
      currentPlayer.muted = true;
      currentPlayer.classList.add('hidden');
      nextPlayer.muted = false;
      nextPlayer.classList.remove('hidden');
      visibleVideoPlayer = visibleVideoPlayer === 1 ? 2 : 1;
      preloadNextVideo();
      armEarlyStart();
    };

    if (!nextPlayer.paused) {
      doSwap();
    } else {
      nextPlayer.play().catch(e => console.error('Play error:', e));
      nextPlayer.addEventListener('playing', doSwap, { once: true });
    }
    return;
  }

  // Single-decoder: start the hidden (preloaded) player and swap immediately.
  nextPlayer.currentTime = 0;
  nextPlayer.play().catch(e => console.error('Play error:', e));

  currentPlayer.pause();
  currentPlayer.muted = true;
  currentPlayer.classList.add('hidden');

  nextPlayer.muted = false;
  nextPlayer.classList.remove('hidden');

  visibleVideoPlayer = visibleVideoPlayer === 1 ? 2 : 1;
  preloadNextVideo();
}

async function main() {
  console.log('main() - App ready!');

  try {
    videoFiles = fs.readdirSync(`${rootStoragePath}/${assetsFolder}`);
    videoFiles = videoFiles.filter(filename => !filename.startsWith('.'));
    videoFiles.sort();

    if (videoFiles.length === 0) {
      console.error(`No video files found in ${rootStoragePath}/${assetsFolder}`);
      return;
    }

    const player1 = getPlayer(1);
    const player2 = getPlayer(2);

    player1.src = `${assetsFolder}/${videoFiles[0]}`;
    player1.currentTime = 0;
    player1.muted = false;
    player2.muted = true;

    player1.addEventListener('ended', () => switchToNextVideo());
    player2.addEventListener('ended', () => switchToNextVideo());

    player1.addEventListener('playing', () => {
      console.log('Player 1 playing');
      preloadNextVideo();
      if (MULTI_DECODER) armEarlyStart();
    }, { once: true });

  } catch (e) {
    console.error('Error in main():', e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
