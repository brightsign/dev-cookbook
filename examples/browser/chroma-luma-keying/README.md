# Chroma/Luma Keying Example

## Introduction

BrightSign players render `<video>` content on a dedicated hardware video layer, separate from the graphics (HTML/CSS) layer. The `hwz` attribute lets you control how that video layer is composited — including making parts of the video transparent so the graphics layer (or another video) shows through.

This is useful for things like animated lower-thirds, transparent motion graphics, or video overlays composited over a dynamic HTML background, without needing alpha-channel video formats.

This example shows:
- How to enable and configure `hwz` on a `<video>` element, in both luma-key and chroma-key (`cb-key`/`cr-key`) modes
- How each mode actually encodes its key values and how to prepare source video for each

> **This only works on BrightSign hardware.** `hwz` is a BrightSign-specific attribute supported with the default native media player (`use-brightsign-media-player = '1'`). Desktop or any Chromium-based browsers will simply ignore this attribute. To see the transparency effect, test on BrightSign hardware with the native player enabled.

## How `hwz` works

`hwz` takes a semicolon-separated list of `key:value` parameters (with a trailing semicolon on the last one):

```html
<video src="example_movie.mp4" hwz="z-index:1; luma-key:#FF2000;">
```

| Parameter | Description |
|---|---|
| `z-index` | Stacking position of the video layer relative to the graphics layer. `-1`/`-2` place video behind graphics (needed if you have subtitles/captions, since those render on the graphics layer). Positive values place video in front. |
| `luma-key:[VALUE]` | Pixel luma (brightness) values in this range become transparent. |
| `cb-key:[VALUE]` | Pixel chroma-blue (Cb) values in this range become transparent. |
| `cr-key:[VALUE]` | Pixel chroma-red (Cr) values in this range become transparent. |

`z-index` must be set for any transparency key to take effect.

### How key values are encoded

Each key value is a **packed 3-byte range** behind a  `#`:

```
#[8 bits mask][8 bits high-end of range][8 bits low-end of range]
```

- **`#`** — always required.
- **Mask** — `FF` to enable the key (the one exception being the chroma-keying companion value described below, which uses `00`).
- **High/low** — the inclusive 0–255 range of pixel values to key transparent, e.g. `luma-key:#FF2000` = mask `FF`, high `0x20` (32), low `0x00` (0) → **"make luma 0–32 transparent."**

`index.js` builds this automatically via `packKeyRange([low, high], mask)` — you configure plain decimal ranges and never hand-craft the hex yourself.

### Keying is a hard cutoff, not alpha blending

Every pixel is compared against the min/max range described above: pixels inside the range become fully transparent, everything else stays fully opaque. There's no soft edge or partial transparency — so edges around your keyed subject will be hard, not feathered.

## Choosing a mode: luma vs. chroma

**`luma-key` (`keyingMode: 'luma'`)** only discriminates on *brightness*. If your foreground content has any pixels as dark as your background — shadows, dark outlines, anti-aliased edges fading toward black, or content rendered premultiplied-over-black — those pixels are indistinguishable from the background and will be keyed out too, punching holes in your subject. Raising the key threshold to fully catch the background only makes this worse, since it catches more of the foreground's dark tones along the way. Use this mode when you're certain no foreground pixel is as dark as your key range — e.g. a bright, high-contrast graphic on a clean black background.

**`cb-key`/`cr-key` (`keyingMode: 'chroma'`)** discriminate on *color* instead, so they work even when the foreground contains dark or black content — as long as the background is a **saturated color that doesn't appear anywhere in the foreground** (the classic green/blue-screen approach). A neutral gray or black background has no chroma signal at all (its Cb/Cr values sit at the neutral midpoint, identical to any other neutral/dark foreground pixel), so chroma-keying **cannot help** a black-background video — the background itself has to be authored in a saturated color.

In short:
- Foreground has no dark/black content → `'luma'` mode on a black background works fine.
- Foreground has dark/black content → you need a saturated (non-black, non-gray) background and `'chroma'` mode. A video already delivered with a black or transparent background can't be salvaged by switching modes alone; it needs to be re-rendered against a proper key color.

### Using chroma-keying (`cb-key`/`cr-key`)

`cb-key`/`cr-key` need a companion `luma-key` parameter present in the same `hwz` string to activate. `index.js`'s `'chroma'` mode includes this automatically (`luma-key:#000100`, mask `00` so it performs no keying of its own) — you don't need to add anything yourself. If you're hand-writing `hwz` outside this example, include that same companion `luma-key` value alongside `cb-key`/`cr-key`.

### Preparing source video for clean keying

- **Avoid anti-aliasing on the key color.** Anti-aliased edges blend the key color with adjacent pixels, and those blended pixels won't key out cleanly.
- **Account for 4:2:0 chroma subsampling** in compressed video — it smears chroma/luma values across edges, which can leave a fringe around the keyed area.
- **Note on YCbCr value ranges**: The keying parameters accept full-range 8-bit values (0–255), but most video content uses limited-range YCbCr (luma 16–235, chroma 16–240). In limited-range video, black is at luma 16 and white is at 235 — if your measurements show a black background at luma 16 rather than 0, adjust your range accordingly.
- **For `'luma'` mode**, use a solid black background, with a range like `[0, 32]` to absorb compression noise around true black — and keep every foreground pixel's luma clearly above that range. This is a real constraint on art direction, not just an export setting: the whole design needs to avoid dark tones, not just the background.
- **For `'chroma'` mode**, use a solid, fully saturated background color that doesn't appear anywhere in your foreground (classic green/blue-screen). Foreground darkness doesn't matter in this mode.
- **Avoid alpha-channel exports for either mode.** `hwz` never reads a video's own alpha channel — it only keys the decoded color data. A source file authored with real per-pixel alpha (e.g. from a compositing tool like Nuke) needs to be re-exported hard-composited over your key color (no anti-aliasing, no premultiplication) for `hwz` to use — the alpha channel itself is irrelevant to this mechanism, whether or not it survived transcoding intact.

## Configuration

Edit the constants at the top of `index.js` before deploying:

```javascript
const videoPath = 'assets/chroma-key-test.webm';
const keyingMode = 'chroma'; // 'luma' or 'chroma'
const lumaRange = [0, 32];   // used in 'luma' mode
const cbRange = [40, 70];    // used in 'chroma' mode
const crRange = [20, 50];    // used in 'chroma' mode
const zIndex = 1;
```

- **`videoPath`** — path to your video file, relative to `index.html`. Using an MP4/H.264 file instead of WebM? Just point this at it — the `hwz` mechanism itself doesn't care which container/codec you use.
- **`keyingMode`** — `'luma'` uses `luma-key` (keys by brightness); `'chroma'` uses `cb-key` + `cr-key` together (keys by color). See [Choosing a mode](#choosing-a-mode-luma-vs-chroma) above.
- **`lumaRange`** — `[low, high]` (0–255) of luma values to key transparent, used in `'luma'` mode.
- **`cbRange`/`crRange`** — `[low, high]` (0–255) of Cb/Cr values to key transparent, used in `'chroma'` mode.
- **`zIndex`** — `1` (or any positive value) places video in front of the graphics layer; `-1`/`-2` places it behind (needed if you have subtitles/captions, which render on the graphics layer).

The `'chroma'` branch of `buildHwzValue()` also hardcodes the companion `luma-key:#000100` value described above — it's not exposed as a config constant since it's a fixed activation value, not something to tune per-video.

`index.js`'s `packKeyRange()` encodes each `[low, high]` pair into the packed mask+high+low hex `hwz` actually expects (see [How key values are encoded](#how-key-values-are-encoded)) and applies it before playback starts, so no runtime input is required.

The graphics-layer stand-in in `index.html` uses a muted two-tone green striped background by default — pick colors that don't appear anywhere in your own video's content (and steer clear of hues adjacent to colors that do — e.g. yellow/orange sit next to brown) so keyed vs. non-keyed areas stay unambiguous at a glance.

## Running the example

1. Copy `autorun.brs`, `index.html`, `index.js`, and the `assets/` folder to the root of your player's SD card.
2. Insert the SD card into your BrightSign player and power it on.

With the default configuration (`keyingMode: 'chroma'`), you should see the green background disappear, revealing the striped graphics-layer background underneath, while the orange box and its inner black square stay fully opaque — proving dark content survives chroma-keying where it wouldn't under `'luma'` mode.

### Expected output per mode

Exactly what should become transparent for each `videoPath`/`keyingMode` combination, using the bundled test assets and their default ranges:

| `videoPath` | `keyingMode` | What becomes transparent | What stays opaque |
|---|---|---|---|
| `chroma-key-test.webm` | `'chroma'` (default) with `cbRange=[40,70]`, `crRange=[20,50]` | Green background — `cb-key:#FF4628` (`Cb=54`), `cr-key:#FF3214` (`Cr=34`), plus the required `luma-key:#000100` workaround | Orange box **and** the black square inside it |
| `chroma-key-test.webm` | `'chroma'` with `cbRange=[30,48]`, `crRange=[165,195]` | Orange box — `cb-key:#FF301E` (`Cb=42`), `cr-key:#FFC3A5` (`Cr=179`), plus the required `luma-key:#000100` workaround | Green background **and** the black square |
| `chroma-key-test.webm` | `'luma'` | Only the black square — `luma-key:#FF2000` (`Y=16`, inside `lumaRange=[0,32]`) | Green background and orange box (both far brighter than `[0, 32]`) |
| `luma-key-test.webm` | `'luma'` | Black background — `luma-key:#FF2000` (`Y=16`, inside `lumaRange=[0,32]`) | Orange box |
| `luma-key-test.webm` | `'chroma'` | Nothing — this clip's background is neutral black (`Cb=128, Cr=128`), which has no chroma signal to key against. Not a meaningful test; use `'luma'` for this asset. | Everything (video renders fully opaque) |

If you swap in your own video and the result doesn't match what you'd expect from this table, re-measure your clip's actual background values (see [Measuring the actual key value in a clip](#measuring-the-actual-key-value-in-a-clip)) rather than assuming these default ranges apply — they're tuned to the bundled test assets specifically.

### Container/codec compatibility

`hwz` operates on the video *after* hardware decode, so it's independent of container/codec — but decode support itself is model-specific:

- WebM is supported, but the **audio codec must match your player series**: XT4/XD4-series players require **Opus**, while HD224 requires **Vorbis** (they are not interchangeable). VP9 is supported for both 4K and 1080p.
- The `hwz` documentation itself only demonstrates MP4/H.264, so transparency support specifically hasn't been explicitly confirmed across every codec — verify on your actual target player model.
- If you run into playback or keying issues with WebM/VP9, converting to H.264 in an MP4 container (the combination BrightSign's own docs use) is the safest fallback. See [BrightSign video formats and codecs](https://docs.brightsign.biz/advanced/video-formats-and-codecs) for the full per-model compatibility matrix.

### Generating your own test footage

`assets/chroma-key-test.webm` (included) was generated with:

```bash
ffmpeg -f lavfi -i "color=c=0x00FF00:s=1280x720:d=10" \
  -vf "drawbox=x=(iw-300)/2:y=(ih-300)/2:w=300:h=300:color=orange:t=fill,drawbox=x=(iw-100)/2:y=(ih-100)/2:w=100:h=100:color=black:t=fill,format=yuv420p" \
  -c:v libvpx-vp9 -pix_fmt yuv420p assets/chroma-key-test.webm
```

A saturated green background, an orange box, and a solid black square inside it — the black square exists specifically to prove dark content survives chroma-keying.

For a plain luma-key test instead, drop the black inner square and use a black background:

```bash
ffmpeg -f lavfi -i color=c=black:s=1280x720:d=10 \
  -vf "drawbox=x=(iw-300)/2:y=(ih-300)/2:w=300:h=300:color=orange:t=fill,format=yuv420p" \
  -c:v libvpx-vp9 -pix_fmt yuv420p assets/luma-key-test.webm
```

### Measuring the actual key value in a clip

Don't guess a key value — measure it. Crop a corner/region you know is background-only and read its average luma/chroma:

```bash
ffmpeg -i your-video.webm -vf "crop=100:100:0:0,signalstats,metadata=print" \
  -frames:v 1 -f null - 2>&1 | grep -Eo "signalstats\.(YAVG|UAVG|VAVG)=[0-9.]+"
```

`YAVG` is luma, `UAVG` is Cb, `VAVG` is Cr (ffmpeg's internal naming). Set `lumaRange`/`cbRange`/`crRange` in `index.js` to a window around whichever measured average you need (e.g. `±15`) — `packKeyRange()` handles turning that into the actual `hwz` hex.

## Notes

- **Local/streamed sources only** — `hwz` transparency applies to local video files and streams, not HDMI input.
- **Supported video formats**: see [BrightSign video formats and codecs](https://docs.brightsign.biz/advanced/video-formats-and-codecs).
- Full reference: [HTML Video docs — HWZ Video Transparency Extensions](https://docs.brightsign.biz/develop/html-video#hwz-video-transparency-extensions).
