
# Starter HTML Application on BrightSign Device

## Introduction

This example is the first stepping stone of the starter examples to get familiar with developing with a BrightSign. This guide walks you through setting up a simple HTML application on a BrightSign device. Once the application is running, the content will be displayed directly on a screen connected to the BrightSign device via HDMI.

Since this example is simplified, there are only two files and one directory which you will need to copy to the root of the player's sd card. Upon the player booting successfully, it will run the `autorun.brs` file. This file instantiates an html object which points the player to the `index.html` file to display the images in the `static` directory.

## Prerequisites

1. **Files** `index.html`, `autorun.brs`, and `static` directory with its contents.
4. **HDMI Cable** to connect the BrightSign device to a display.
5. **Display** (e.g., a monitor or TV) with an HDMI input.

## Steps to Set Up and Run the HTML Application

### 1. Prepare the SD Card

1. Insert the SD card into your computer.
2. Copy the `index.html`, `autorun.brs`, and the directory named `static` to the root of the SD card to store the image assets.
   - Ensure the image files `logo192.png` and `XD-1035.png` are inside the `static` folder.

### 2. Set Up the BrightSign Device

1. Eject the SD card from your computer and insert it into your BrightSign device.
2. **Connect the HDMI Cable**:
   - Connect one end of the HDMI cable to the BrightSign device and the other end to your display (monitor, TV, etc.).
3. Power on the BrightSign device and allow it to boot up.
4. The device will automatically start running the HTML application from the `index.html` file because the autorun directs it to.

### 3. Viewing the HTML Application on the Display

Once the BrightSign device has booted and the HTML application is running:

1. **Check the Display**:
   - The content of the `index.html` file should be visible on the connected display.
   - You should see a webpage with a background gradient, text, and images.
   - The text `Congratulations on setting up a simple HTML application with your BrightSign!` will dynamically change color every 2 seconds. This is to exemplify injected JavaScript in html.

### 4. Troubleshooting

- **No Output on the Display**: If nothing appears on the display, check the following:
  - Ensure that the HDMI cable is securely connected to both the BrightSign device and the display.
  - Verify that the display is set to the correct HDMI input.
  - Make sure the BrightSign device is powered on and the SD card is properly inserted.

- **Broken Images**: If the images do not appear on the display, ensure that:
  - The images are correctly placed in the `static` folder which should be on the root of the SD card.
  - The path to the `index.html` file in the `autorun.brs` file should match the actual file locations.
