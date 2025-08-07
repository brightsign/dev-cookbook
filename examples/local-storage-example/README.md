# Local Storage Image Slideshow Example

## Introduction

This example demonstrates how to create an image slideshow application that caches images in the browser's localStorage and displays them in sequence. The application downloads and stores images persistently for smooth playback and implements a looping slideshow that automatically advances to the next image after a specified duration.

## How it Works

1. **Initial Load**: The application checks localStorage for cached images and displays the first image (cached or streamed)
2. **Persistent Caching**: Images are downloaded, converted to base64, and stored in browser localStorage
3. **Background Caching**: While the first image is displayed, other images are downloaded and cached in the background
4. **Smooth Transitions**: When an image's display timer expires, the next cached image loads instantly from localStorage
5. **Session Persistence**: Cached images persist across browser sessions and page reloads
6. **Loop Behavior**: After the last image, the slideshow loops back to the first image

**Note**: Browser localStorage has a storage limit of approximately 5MB. For caching larger amounts of content, consider using IndexedDB which offers much larger storage capacity. Check out our [IndexedDB caching example](https://github.com/brightsign/dev-cookbook/tree/main/examples/indexeddb-caching-example) for an alternative approach.

## How to Run on a Player

1. Copy the `autorun.brs` and `index.html` files to the root of an SD card
2. Insert the SD card into your BrightSign player
3. Power on the player - it will automatically run the `autorun.brs` file which then loads the HTML/JS application

## Files Structure

- autorun.brs: BrightScript file that initializes the HTML widget
- index.html: Main HTML/JS application with localStorage image caching
