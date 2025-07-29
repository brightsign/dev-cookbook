# IndexedDB Video Caching Example

This example demonstrates how to use IndexedDB for caching video content in a BrightSign HTML5 application. The application creates a video playlist that intelligently caches videos in the background for smooth playback.

## File Structure

- `index.html`: Main HTML application with video player and caching logic
- `autorun.brs`: BrightSign autorun script which loads the HTML application

## Usage

1. Copy the `autorun.brs` and `index.html` files to the root of an SD card
2. Insert the SD card in the BrightSign player and power it on
3. The `autorun.brs` script will automatically launch the HTML application

## How It Works

1. **Database Setup**: Creates an IndexedDB database (`videos_db`) with an object store (`videos_os`) to store video blobs
2. **Playlist Loading**: Loads a predefined playlist of sample videos from Google's test video collection
3. **Smart Caching Strategy**:
   - First video: Downloads and plays immediately, then starts background caching
   - Subsequent videos: Plays from cache if available, otherwise downloads from network
   - Background caching: Downloads remaining videos with 1-second delays between requests
4. **Automatic Playback**: Videos play continuously with automatic progression to the next video

## Configuration Options

### BrightSign Configuration (autorun.brs)
- `url`: Path to the HTML file. This can be modified to point to a remote server URL that serves the HTML file.
- `mouse_enabled`: Enable/disable mouse interaction (default: false)
- `javascript_enabled`: Enable/disable JavaScript (default: true)
- `nodejs_enabled`: Enable/disable Node.js (default: false)
- `storage_path`: Directory for local storage cache
- `storage_quota`: Maximum cache size

See the [roHtmlWidget](https://docs.brightsign.biz/developers/rohtmlwidget#23vJS) page for more details on configuration options.

### Video Configuration (index.html)
- Modify the `fetchPlaylist()` function to add your own video URLs
- Adjust the background caching delay by changing the `TIMEOUT_DELAY` value
- Customize video display properties in the `displayVideo()` function

## Error Handling

The application includes comprehensive error handling for:
- Network connectivity issues
- IndexedDB operation failures
- Duplicate cache entries (ConstraintError)
- Video loading and playback errors

## Performance Considerations

- **Storage**: Videos are stored as blobs in IndexedDB, which uses available disk space
- **Network**: Background caching uses staggered requests (1-second delays) to avoid overwhelming the network
- **Memory**: Video blobs are created using `URL.createObjectURL()` for efficient memory usage

## Troubleshooting

1. **Videos not caching**: Check console for IndexedDB errors
2. **Network errors**: Verify internet connectivity and video URLs
3. **Storage full**: Check available disk space and storage quota settings
4. **Playback issues**: Ensure video formats are supported by the player
