# HTML Widget Iframes Example

To enhance security, the BrightSign OS has disabled the access to JavaScript APIs, BS-JS objects, and Node.js within iframes in BOS v9.1. However, a security parameter `trusted_iframes_enabled` has been added to the `roHtmlWidget` configuration, which will enable iframes to have access to that functionality. We DO NOT recommend this configuration as the content in these iframes can gain access to core player APIs, and this content is not always under the application's control.

See the following pages for details:

- `trusted_iframes_enabled` in the [roHtmlWidget documentation](https://docs.brightsign.biz/developers/rohtmlwidget#23vJS)
- `trustedIframesEnabled` in the [JavaScript htmlwidget documentation](https://docs.brightsign.biz/developers/htmlwidget)

## Introduction

This example demonstrates how to use the `roHtmlWidget` component on a BrightSign player to display a fullscreen web page with support for trusted iframes and enhanced security options (available in OS `v9.1.75.3` and later).

## How to Run on a Player

1. Copy the `autorun.brs` file to the root of an SD card.
2. Insert the SD card into your BrightSign player.
3. Power on the player. The player will automatically run the `autorun.brs` file and display the configured web page.

## File Structure

- `autorun.brs`: BrightScript file that initializes the HTML widget with iframe and security options.
