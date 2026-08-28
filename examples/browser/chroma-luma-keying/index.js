// Configuration - edit these values as needed before deploying to a player
const videoPath = 'assets/chroma-key-test.webm';

// 'luma'   - key based on brightness (luma-key). Simple, but cannot tell
//            background apart from dark/black foreground content - see
//            README "Preparing source video" before using this on content
//            with dark tones anywhere in the foreground.
// 'chroma' - key based on color (cb-key + cr-key). Works even when the
//            foreground contains dark or black content, as long as the
//            background is a saturated color not used anywhere in the
//            foreground (classic green/blue-screen approach).
const keyingMode = 'chroma';

// Luma range to key out in 'luma' mode, as [low, high] (0-255).
// [0, 32] is the "black pixel masking" value -
// narrow this to your source's actual measured background luma (see
// README "Measuring the actual key value in a clip") if foreground content
// is getting keyed out along with the background.
const lumaRange = [0, 32];

// Cb/Cr ranges to key out in 'chroma' mode, as [low, high] (0-255).
// Centered on the measured background of assets/chroma-key-test.webm
// (Cb=54, Cr=34 via `ffprobe`/`signalstats`) with margin for encoding noise.
const cbRange = [40, 70];
const crRange = [20, 50];

// Video layer stacking position relative to the graphics layer.
// 1 (or any positive value)  = video in front of graphics
// -1 or -2                   = video behind graphics (needed if you have
//                              subtitles/captions, which render on the
//                              graphics layer)
const zIndex = 1;

function packKeyRange([low, high], mask = 0xff) {
  const byte = n => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${byte(mask)}${byte(high)}${byte(low)}`;
}

function buildHwzValue() {
  const parts = [`z-index:${zIndex}`];
  if (keyingMode === 'chroma') {
    parts.push(`cb-key:${packKeyRange(cbRange)}`);
    parts.push(`cr-key:${packKeyRange(crRange)}`);
    parts.push(`luma-key:#000100`); // this is a workaround needed for chroma keying to work
  } else {
    parts.push(`luma-key:${packKeyRange(lumaRange)}`);
  }
  return `${parts.join('; ')};`;
}

function main() {
  const video = document.getElementById('keyed-video');
  const readout = document.getElementById('readout');
  const hwzValue = buildHwzValue();

  readout.textContent = `keyingMode="${keyingMode}"  hwz="${hwzValue}"`;
  console.log(`Applying hwz="${hwzValue}" to ${videoPath}`);

  video.setAttribute('hwz', hwzValue);
  video.src = videoPath;
  video.load();
  video.play().catch(e => console.error('Play error:', e));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
