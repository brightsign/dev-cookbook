# BrightSign Dual Video Player — Seamless Playback (Multi-Decoder)

> An enhanced seamless video player for BrightSign players with multiple hardware decode pipelines. Provides near-zero-gap transitions using decoder pre-warming and early start.

## Hardware Requirements

This example requires a BrightSign player capable of running two hardware decode pipelines simultaneously — suited for mid-to-high-end series (XT, 4K). On single-decoder hardware, the pre-warming and early start will compete with the active player's decoder and may cause stuttering. Use the [seamless-video-switching](../seamless-video-switching/) example instead.

## How It Works

Builds on the same dual video element technique as the base example, with two additions:

1. **Decoder pre-warming** — after the hidden player buffers (`canplay`), it plays briefly then pauses at frame 0. This initializes the hardware decode pipeline so `play()` at switch time starts near-instantly.
2. **Early start** — the hidden player begins playing (muted, hidden) 0.5s before the visible video ends. By the time `ended` fires, the hidden player is already producing frames and the swap is immediate with no gap.

If the early start did not complete in time, the switch falls back to awaiting the `playing` event before swapping visibility, preventing a swap onto an unrendered frame.

## Trade-offs vs. Base Example

| | This example | seamless-video-switching |
|---|---|---|
| Hardware | Multi-decoder required | Any |
| Gap at transition | Near-zero | Small gap (decoder handoff) |
| Simultaneous decoding | Yes | No |

## Configuration

- **`rootStoragePath`** — storage path on the player (default: `/storage/sd`)
- **`assetsFolder`** — folder containing your video files (default: `assets`)

## SD Card Structure

```
SD/
├── autorun.brs
├── index.html
├── index.js
└── assets/
    ├── video1.mp4
    └── video2.mp4
```

## Deployment Steps

1. Copy `autorun.brs`, `index.html`, and `index.js` to the root of your SD card
2. Create an `assets/` folder and copy your video files into it
3. Insert the SD card and power on the player

## Notes

- **Supported video formats**: See [BrightSign video formats and codecs](https://docs.brightsign.biz/advanced/video-formats-and-codecs) for supported containers, codecs, and profiles by player series.
- **Early start threshold**: The 0.5s window in `armEarlyStart()` can be adjusted to trade content budget against transition reliability on your specific hardware and content type.
- **Performance**: Switching smoothness may vary by player model, OS version, video resolution, and source encoding.
