# BrightSign Dual Video Player HTML5 Application - Seamless Playback

> A seamless HTML5 video player application for BrightSign that provides gap-free video transitions using dual video elements with background preloading.

## 🎯 Why Use This Approach?

**This dual video player provides truly seamless, gap-free video playback** - essential for advertising and professional digital signage where any visible gap between videos is unacceptable.

### The Dual Player Advantage:
- ✅ **Zero visible gaps** - No freeze frames or black screens between videos
- ✅ **Instant transitions** - Next video is preloaded and ready to play
- ✅ **No fade effects** - Clean cuts between videos without mixing content

### How It Works:
1. Two video elements are layered on top of each other
2. While video 1 plays, video 2 loads the next file in the background
3. When video 1 ends, video 2 instantly becomes visible and starts playing
4. Video 1 (now hidden) loads the next file in the background
5. The cycle repeats for seamless continuous playback

## Configuration

You can customize the following settings in `index.js` before deploying:

- **`rootStoragePath`** - The root storage path on the BrightSign player (default: `/storage/sd`)
- **`assetsFolder`** - The folder name containing your video files (default: `assets`)
- **`MULTI_DECODER`** - Set to `true` on players with multiple hardware decode pipelines to enable near-zero-gap transitions (default: `false`). See [Multi-decoder mode](#multi-decoder-mode) below.

Example:
```javascript
const rootStoragePath = '/storage/sd';
const assetsFolder = 'assets'; // Change this to use a different folder name
const MULTI_DECODER = false;   // Set to true on XT/4K series players
```

If you change `assetsFolder` to a different name (e.g., `videos`), make sure to create that folder on your SD card and place your video files there instead.

## Multi-decoder mode

On BrightSign players with multiple hardware decode pipelines (mid-to-high-end XT and 4K series), set `MULTI_DECODER = true` in `index.js` to enable two optimizations that further reduce the transition gap:

1. **Decoder pre-warming** — after the hidden player buffers (`canplay`), it plays briefly then pauses at frame 0. This initializes the hardware decode pipeline so `play()` at switch time starts near-instantly.
2. **Early start** — the hidden player begins playing (muted, hidden) 0.5s before the visible video ends. By the time `ended` fires, the hidden player is already producing frames and the swap is immediate.

If the early start does not complete in time, the swap falls back to awaiting the `playing` event, preventing a swap onto an unrendered frame.

**Do not enable `MULTI_DECODER = true` on single-decoder hardware** — pre-warming and early start will compete with the active player's decoder and may cause stuttering. Leave `MULTI_DECODER = false` for the default single-decoder behavior. Refer to the [BrightSign model and series reference](https://docs.brightsign.biz/hardware/model-and-series-reference) to check your player's capabilities.

| | `MULTI_DECODER = false` (default) | `MULTI_DECODER = true` |
|---|---|---|
| Hardware | Any BrightSign player | Multi-decoder required (XT, 4K) |
| Gap at transition | Small gap (decoder handoff) | Near-zero |
| Simultaneous decoding | No | Yes |

## Deployment to BrightSign Player

### SD Card Structure

Your BrightSign player's SD card should have the following structure:

```
SD/
├── autorun.brs    (launches index.html)
├── index.html     (loads index.js)
├── index.js       (application logic)
└── assets/        (your video files)
    ├── video1.mp4
    ├── video2.mp4
    └── video3.ts
```

### Deployment Steps

1. Copy the following files to the root of your SD card:
   - `autorun.brs`
   - `index.html`
   - `index.js`
2. Create an `assets/` folder on the SD card
3. Copy your video files into the `assets/` folder
4. Insert the SD card into your BrightSign player and power it on

The application will automatically:
- Load video files from `/storage/sd/assets/`
- Sort them alphabetically
- Play them in sequence with seamless transitions
- Loop back to the first video after the last one finishes

## Notes

- **Supported video formats**: See [BrightSign video formats and codecs](https://docs.brightsign.biz/advanced/video-formats-and-codecs) for the list of containers, codecs, and profiles supported by each player series.
- **Performance**: Playback smoothness and switching behavior may vary depending on player model, OS version, video mode (resolution/framerate), and the encoding of your source files. Adjust the code (e.g., preload behavior, number of preloaded players) to fit your specific use-case.
- **Early start threshold (multi-decoder mode)**: The 0.5s window in `armEarlyStart()` can be adjusted to trade content budget against transition reliability on your specific hardware and content type.
