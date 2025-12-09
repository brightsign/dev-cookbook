# BrightSign autorun.zip Package Example

A complete, version-controlled example of creating and deploying an `autorun.zip` package for BrightSign players. This example demonstrates the recommended structure and best practices for deploying applications to BrightSign devices using the autorun.zip method.

## Overview

The `autorun.zip` package is a powerful deployment mechanism for BrightSign players (OS 7.0.60+) that allows you to deliver multiple files and directories as a single payload. This is particularly useful for:

-   **Partner Gallery Integration**: Provision players directly from BSN.Cloud
-   **Fleet Deployment**: Deploy applications to multiple players efficiently
-   **Automated Setup**: Streamline player configuration and app installation
-   **Version Control**: Maintain and track your deployment packages

## What is autorun.zip?

When a BrightSign player boots with an `autorun.zip` file on its storage:

1. The player detects the `autorun.zip` file
2. The `autozip.brs` script (inside the zip) executes
3. All contents are extracted to the root of the storage device
4. The zip file is renamed to `autorun.zip.done`
5. The player reboots and runs the extracted `autorun.brs` application

## Package Structure

```
autorun.zip
├── autozip.brs              # Extraction script (required)
├── autorun.brs              # Main application script
├── index.html               # HTML UI
├── config/
│   └── app-config.json      # Application configuration
├── cache/                   # Cache directory (empty initially)
├── logs/                    # Logs directory (empty initially)
└── brightsign-dumps/        # Crash dumps directory (recommended)
```

### Critical Requirements

✅ **DO:**

-   Include `autozip.brs` at the root of the zip file
-   Structure zip so contents extract directly to root (no parent folder)
-   Create empty directories with `.gitkeep` files for version control
-   Test the package thoroughly before production use
-   Use HTTPS for hosting (required for Partner Gallery)

❌ **DON'T:**

-   Put `autorun.brs` at the root level alongside `autorun.zip` on the player
-   Nest contents in a subdirectory within the zip

## Quick Start

### 1. Build the autorun.zip Package

```bash
cd examples/autorun-zip-package

# Install dependencies (first time only)
npm install
# or
yarn install

# Build the package
npm run build
# or
yarn build
```

This creates `autorun.zip` with all necessary files and directories.

The build script is cross-platform and works on Windows, macOS, and Linux.

### 2. Test on a BrightSign Player

1. Copy `autorun.zip` to the root of a microSD card
2. Insert the card into a BrightSign player
3. Power on the player
4. The player will:
    - Extract all files
    - Rename `autorun.zip` to `autorun.zip.done`
    - Reboot and run the application

### 3. Verify Installation

After the player reboots, you should see:

-   A gradient purple background with success message
-   Status indicator showing "Application Running"
-   All directories (cache, config, logs, brightsign-dumps) created
-   `autorun.zip.done` on the storage (original zip renamed)

## Customizing the Package

### Modify the Application

Edit files in the `setup-files/` directory:

-   **`autorun.brs`**: Main application logic
-   **`index.html`**: UI and display content
-   **`config/app-config.json`**: Application settings

After making changes, rebuild:

```bash
npm run build
```

### Add Your Own Content

You can add additional files and directories:

```bash
cd setup-files
# Add your content
mkdir -p assets/videos
cp /path/to/your/video.mp4 assets/videos/
# Rebuild
cd ..
npm run build
```

### Customize for Your CMS

For CMS providers, modify the application to:

-   Connect to your pairing/registration endpoint
-   Display QR codes or pairing codes
-   Handle device authentication
-   Download and cache content

## Partner Gallery Integration

To add your autorun.zip package to the BrightSign Partner Gallery:

### Requirements

1. **Company Information**

    - Company name (as you want it displayed)
    - Company logo
    - Contact email for error notifications

2. **Hosted autorun.zip**

    - Persistent HTTPS URL
    - Must remain accessible and up-to-date
    - Example: `https://yourcompany.com/partners/brightsign/autorun.zip`

3. **Test Screenshot**
    - Screenshot of the display after successful installation
    - Shows what customers should expect to see

### Testing for Partner Gallery

1. **Build Your Package**

    ```bash
    npm run build
    ```

2. **Test Locally on Player**

    - Copy `autorun.zip` to microSD card
    - Insert into BrightSign player and power on
    - Verify the application loads correctly
    - Document what appears on screen (take screenshot)

3. **Host on HTTPS**

    - Upload `autorun.zip` to your web server/CDN
    - Ensure HTTPS is enabled (required for Partner Gallery)
    - Verify the URL is accessible: `https://yourserver.com/autorun.zip`

4. **Submit to BrightSign**
    - Provide all required information above
    - Include your tested HTTPS URL
    - Include screenshot from testing
    - BrightSign will validate and add to gallery

### Partner Gallery Benefits

-   **Zero-touch Provisioning**: Customers can provision players directly from BSN.Cloud
-   **Brand Visibility**: Your CMS appears in the BrightSign partner selector
-   **Faster Onboarding**: Minimal steps from unboxing to pairing screen
-   **Qualified Partner Status**: Join the BrightSign partner ecosystem

## Hosting autorun.zip

## Hosting autorun.zip

### Production

For production Partner Gallery integration:

1. **Use a CDN or Web Server**

    - Amazon S3 + CloudFront
    - Azure Blob Storage + CDN
    - Google Cloud Storage + CDN
    - Your own web server with nginx/Apache

2. **Ensure HTTPS**

    - Required for Partner Gallery
    - Use Let's Encrypt for free SSL certificates
    - Or use certificates from your hosting provider

3. **Make it Persistent**

    - URL should not change
    - Keep the autorun.zip updated with latest version
    - Monitor availability (uptime monitoring)

4. **Version Management**
    ```
    # Good structure
    https://yourcompany.com/brightsign/autorun.zip          # Always latest
    https://yourcompany.com/brightsign/v1.2.3/autorun.zip   # Specific version
    ```

## Troubleshooting

### Extraction Doesn't Happen

**Check:**

-   `autozip.brs` is inside the zip at root level
-   No `autorun.brs` exists at player root alongside `autorun.zip`
-   Player is running OS 7.0.60 or later
-   Zip file is not corrupted (re-download if from network)

### Application Doesn't Start After Extraction

**Check:**

-   `autorun.brs` exists in the extracted files
-   Check logs in `brightsign-dumps/` directory
-   Connect via SSH to view console output
-   Verify all file paths in `autorun.brs` are correct

### Empty Directories Not Included in Zip

The Node.js build script (`build-autorun-zip.js`) automatically preserves empty directories across all platforms. Empty directories include `.gitkeep` files to ensure they're tracked in version control.

### Player Keeps Re-extracting

**Issue:** `autorun.zip` is not being renamed to `autorun.zip.done`

**Solutions:**

-   Check storage is not write-protected
-   Verify sufficient storage space
-   Check `autozip.brs` rename logic is executing

## Advanced Topics

### Registry Configuration

Before provisioning, you can pre-configure the player registry:

```brightscript
registry = CreateObject("roRegistry")
networkingSection = CreateObject("roRegistrySection", "networking")

' Set provisioning server
networkingSection.Write("ub", "https://yourserver.com")
networkingSection.Write("ru", "/provision")
networkingSection.Flush()

' Other useful settings
systemSection = CreateObject("roRegistrySection", "system")
systemSection.Write("deviceName", "MyPlayer-001")
systemSection.Flush()
```

### Self-Updating Applications

You can combine this with the `bs-self-updater` example to create self-updating applications:

```javascript
// Check for updates periodically
const updateUrl = "https://yourserver.com/autorun.zip";
const updater = new BrightSignUpdater(updateUrl);
updater.checkForUpdates();
```

See `examples/bs-self-updater` for details.

### Content Delivery

For large content deployments:

-   Keep `autorun.zip` small (< 100MB)
-   Download large assets after provisioning
-   Use the `cache/` directory for downloaded content
-   Implement progressive downloading in your application

## File Descriptions

### `setup-files/autozip.brs`

The extraction script that unpacks `autorun.zip`. This script:

-   Checks for `autorun.zip` existence
-   Extracts all contents to storage root
-   Renames zip to prevent re-extraction
-   Reboots the player

**Do not modify unless you understand the extraction process.**

### `setup-files/autorun.brs`

The main application script. Customize this for your needs:

-   Initialize your application
-   Set up HTML widgets
-   Handle events
-   Connect to your services

### `setup-files/index.html`

The HTML UI. Customize to show:

-   Pairing screens
-   QR codes
-   Status information
-   Your branding

### `setup-files/config/app-config.json`

Application configuration file. Use for:

-   Feature flags
-   Server URLs
-   Display settings
-   Partner information

### `build-autorun-zip.js`

Node.js build script that:

-   Works cross-platform (Windows, macOS, Linux)
-   Validates required files exist
-   Creates properly structured zip
-   Preserves empty directories
-   Excludes system files (.DS_Store, Thumbs.db, etc.)
-   Provides detailed build output
-   Shows package contents and file counts

Run with: `npm run build`

## Related Documentation

-   [BrightSign autorun.zip Official Docs](https://docs.brightsign.biz/how-tos/create-install-an-autorunzip)
-   [Provisioning and Recovery](https://docs.brightsign.biz/partners/provisioning-and-recovery)
-   [Partner Gallery Information](https://docs.brightsign.biz/partners)
-   [BrightScript API Reference](https://brightsign.atlassian.net/wiki/spaces/DOC/overview)

## Related Examples

-   **`bs-self-updater`**: Self-updating application framework that can download new autorun.zip packages
-   **`html-starter`**: Basic HTML application structure
-   **`node-starter`**: Node.js application for more complex apps
-   **`provisioning-server`**: Advanced example for automated deployment across multiple players

## Support and Contributions

For issues, questions, or contributions:

-   Open an issue in the dev-cookbook repository
-   Review existing examples for patterns
-   Check BrightSign documentation
-   Contact BrightSign partner support for Partner Gallery questions

## License

See the [LICENSE.txt](../../LICENSE.txt) file in the root of the dev-cookbook repository.

---

**Note**: This example is maintained as part of the BrightSign dev-cookbook. All documentation and Zendesk macros should reference this version-controlled implementation.
