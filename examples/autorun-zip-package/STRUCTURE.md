# autorun.zip Package Structure Guide

## Good Example Structure ✅

When you unzip the `autorun.zip` file, it should expand **directly** to show files and directories at the root level:

```
autorun.zip (when extracted) →
├── autozip.brs
├── autorun.brs
├── index.html
├── brightsign-dumps/
├── cache/
├── config/
│   └── app-config.json
└── logs/
```

This is the **CORRECT** structure. Files are at the root level of the zip.

## Bad Example Structure ❌

**DO NOT** structure your zip file like this:

```
autorun.zip (when extracted) →
└── my-app-folder/          ← WRONG! No parent folder
    ├── autozip.brs
    ├── autorun.brs
    ├── index.html
    └── ...
```

This is **INCORRECT**. The files are nested in a parent directory.

## Why This Matters

When the BrightSign player extracts `autorun.zip`:

1. It extracts **all contents** to the root of the storage device (e.g., `SD:/`)
2. Files must be at the root level to work correctly
3. If wrapped in a folder, files will be at `SD:/my-app-folder/` instead of `SD:/`
4. The player looks for `SD:/autorun.brs`, not `SD:/my-app-folder/autorun.brs`

## How to Create the Correct Structure

### Using the Build Script (Recommended)

The included Node.js build script automatically creates the correct structure:

```bash
npm run build
```

### Manual Creation on macOS

1. Navigate to the `setup-files/` directory (not its parent)
2. Select all files and folders **inside** `setup-files/`
3. Right-click → Compress
4. Rename to `autorun.zip`

### Manual Creation on Windows

1. Navigate to the `setup-files/` directory (not its parent)
2. Select all files and folders **inside** `setup-files/`
3. Right-click → Send to → Compressed (zipped) folder
4. Rename to `autorun.zip`

**Important:** Do NOT select the `setup-files` folder itself, only its contents.

### Verification

To verify your zip structure:

**macOS/Linux:**

```bash
unzip -l autorun.zip | head -20
```

You should see files starting immediately, not inside a folder:

```
Archive:  autorun.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
     2134  12-09-2024 10:00   autozip.brs
     4567  12-09-2024 10:00   autorun.brs
     3456  12-09-2024 10:00   index.html
        0  12-09-2024 10:00   brightsign-dumps/
        0  12-09-2024 10:00   cache/
```

**Windows PowerShell:**

```powershell
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("autorun.zip")
$zip.Entries | Select-Object -First 10 FullName
$zip.Dispose()
```

**Or use Node.js (cross-platform):**

```bash
node -e "require('fs').createReadStream('autorun.zip').pipe(require('unzipper').Parse()).on('entry', e => console.log(e.path))"
```

## Common Mistakes

### Mistake 1: Zipping the parent folder

**Wrong:** Creating a zip that includes the `setup-files` folder itself, resulting in nested structure.

**Correct:** The Node.js build script (`npm run build`) automatically zips only the contents of `setup-files/`, not the folder itself.

### Mistake 2: Including hidden system files

**Wrong:** Including `.DS_Store`, `__MACOSX`, `Thumbs.db` and other system files.

**Correct:** The Node.js build script automatically excludes these files.

### Mistake 3: Not preserving empty directories

**Problem:** Some zip utilities don't preserve empty directories.

**Solution:**

-   Use the provided Node.js build script (`npm run build`)
-   `.gitkeep` files are included in empty directories to ensure they're preserved

## Testing Your Package

After creating `autorun.zip`, test it:

### Test 1: Extract Locally

```bash
# Create test directory
mkdir test-extract
cd test-extract

# Extract your zip
unzip ../autorun.zip

# Verify structure
ls -la
```

You should see all files at the root level of `test-extract/`.

### Test 2: On BrightSign Player

1. Copy `autorun.zip` to SD card root
2. Boot the player
3. After extraction and reboot, check storage via SSH:

```bash
cd /storage/sd
ls -la
```

You should see:

-   `autorun.zip.done` (renamed)
-   `autorun.brs`, `autozip.brs`, `index.html`
-   All directories (`cache/`, `config/`, etc.)

## Troubleshooting

### Player doesn't extract the zip

-   Check BrightSignOS version (must be 7.0.60+)
-   Verify `autozip.brs` is inside the zip at root level
-   Ensure no `autorun.brs` exists on player storage alongside `autorun.zip`

### Application doesn't run after extraction

-   Verify `autorun.brs` exists in the zip
-   Check that files extracted to root level (not nested in folder)
-   Review logs in `brightsign-dumps/` directory

### Empty directories missing after extraction

-   Ensure `.gitkeep` files are in empty directories
-   Or use a zip utility that preserves empty folders

## References

-   [BrightSign Official Documentation](https://docs.brightsign.biz/how-tos/create-install-an-autorunzip)
-   [Provisioning and Recovery Guide](https://docs.brightsign.biz/partners/provisioning-and-recovery)
