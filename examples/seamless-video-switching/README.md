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

Example:
```javascript
const rootStoragePath = '/storage/sd';
const assetsFolder = 'assets'; // Change this to use a different folder name
```

If you change `assetsFolder` to a different name (e.g., `videos`), make sure to create that folder on your SD card and place your video files there instead

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