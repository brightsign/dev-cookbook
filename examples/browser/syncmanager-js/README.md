# Sync Manager Application

![Runtime: Browser](https://img.shields.io/badge/runtime-browser-blue)
![BrightSign OS: 8.x | 9.x](https://img.shields.io/badge/BrightSign_OS-8.x_%7C_9.x-purple)

## Summary

This application demonstrates synchronized video playback across multiple BrightSign players using the `@brightsign/syncmanager` JavaScript API. One player acts as the **leader** that initiates synchronization events, while other players act as **followers** that respond to those events. All players play the same video in sync using PTP (Precision Time Protocol) and multicast communication.

The leader restarts synchronization every 30 seconds to keep all players aligned.

## Configuration

Edit as needed for your environment:

- **Domain**: `BrightSignDomain`
- **Multicast Address**: `224.0.126.10`
- **Port**: `1539`
- **PTP Domain**: `0` (configured by autorun.brs on first boot)

## Deployment Steps

### Leader Player

1. Upload the following files to the SD card of the leader player:
   - `autorun.brs`
   - `index-leader.html`
   - `test.mp4` (your video file)

2. **Rename** `index-leader.html` to `index.html`

3. Reboot the player

### Follower Player(s)

1. Upload the following files to the SD card of each follower player:
   - `autorun.brs` (same file as leader)
   - `index-follower.html`
   - `test.mp4` (same video file as leader)

2. **Rename** `index-follower.html` to `index.html`

3. Reboot the player

## How It Works

1. The `autorun.brs` script configures the PTP domain and launches the HTML widget with Node.js enabled
2. The leader player broadcasts sync events every 30 seconds via multicast
3. Follower players listen for sync events and synchronize their video playback
4. The video element uses `setSyncParams()` to align playback across all players using PTP timestamps

## Troubleshooting

- Ensure all players are connected to the same network
- Verify multicast traffic is allowed on your network
- Check that PTP domain is set to 0 (automatically configured)
- Confirm all players are using the same video file
- Use the inspector server (port 2999) to view console logs for debugging
