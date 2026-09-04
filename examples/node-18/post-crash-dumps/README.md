# JavaScript BrightSign Crash Dump Uploader

A test BrightSign Node.js application that uploads crash dump files from the player's `brightsign-dumps` folder to a custom server endpoint after boot. The app scans storage on boot, posts any dump files newer than the last successfully uploaded dump, and records that marker in a custom registry key.

## Features

-   Scans `brightsign-dumps` on each boot.
-   Uploads each new dump with a raw binary `POST /crashdump` request.
-   Adds BrightSign device information and dump file information as request headers.
-   Stores the last successfully uploaded dump and timestamp in a custom registry key so the same dump is not posted repeatedly.
-   Keeps local dump files by default.
-   Supports an optional delete-after-upload flag.
-   Includes a local test server with one endpoint: `POST /crashdump`.

## Player App Configuration

The player app reads the upload endpoint from a custom BrightSign registry section. Before deploying, edit the top of `autorun.brs` and replace the placeholder server URL:

```brightscript
CRASH_DUMP_UPLOAD_URL = "http://YOUR_SERVER_IP:8080/crashdump"
```

On boot, `autorun.brs` writes that URL to:

```text
[crash_dump_example]
upload_url=http://YOUR_SERVER_IP:8080/crashdump
```

Then `index.js` reads it with BrightSign's JavaScript registry API:

```javascript
const RegistryClass = require("@brightsign/registry");
const registry = new RegistryClass();
const uploadUrl = await registry.read("crash_dump_example", "upload_url");
```

The default storage path is detected with BrightSign's JavaScript storage API when available:

```javascript
const StorageClass = require("@brightsign/storage");
const priorityOrder = new StorageClass().priorityOrder;
```

The app checks storage devices in priority order and uses the first mounted device under `/storage`. It then scans `<storagePath>/brightsign-dumps` and writes the last successfully uploaded dump marker to the custom registry key `[crash_dump_example] last_uploaded_dump`.

Edit these constants at the top of `index.js` if needed:

```javascript
const DELETE_AFTER_UPLOAD = false;
const REQUEST_TIMEOUT_MS = 30000;
```

## Upload State

BrightSign OS names crash dump files like `000000.dump`, `000001.dump`, and keeps a rotating set of 10 dump files by default, removing the oldest files first. If `DELETE_AFTER_UPLOAD` is enabled, the same filename can be reused, for example `000000.dump`, so the app stores the last successfully uploaded dump timestamp instead of relying on the filename alone.

Every boot scans `brightsign-dumps`, sorts dump files from oldest to newest, and uploads files newer than this custom registry value:

```text
[crash_dump_example]
last_uploaded_dump={"relativePath":"000000.dump","size":12345,"modifiedTime":"2026-09-04T...","uploadedAt":"2026-09-04T..."}
```

After each successful 2xx response, the app updates `last_uploaded_dump`. If an upload fails, the app stops processing later dump files for that boot so the marker never skips past a failed older dump.

## Deploy to Player

Copy these files to the root of the player's SD card or other configured primary storage:

-   `autorun.brs`
-   `index.js`

On boot, `autorun.brs` creates `SD:/brightsign-dumps` if needed and launches the Node.js uploader. Creation of `brightsign-dumps` is required for BrightSign OS to post dump files to it.

## Test Server

The bundled test server accepts raw crash dump uploads on `POST /crashdump` and saves them to `test-server/received-dumps`.

```sh
cd examples/node-18/post-crash-dumps/test-server
npm install
npm start
```

The server listens on port `8080` by default. Override with `PORT`:

```sh
PORT=3000 npm start
```

## Player Test

Run the client on a BrightSign player running OS 9.x. Wait for a crash to occur OR force a crash by using the `DWS > Control > Reboot with Crash Report` feature. This will post a dump file under `brightsign-dumps` and reboot the player, after which you can confirm the server receives it. Boot the same storage again and confirm `[crash_dump_example] last_uploaded_dump` prevents a duplicate upload.

_Note_: The Local DWS is disabled by default since OS 9.0.218+ and 9.1.75+. See [this docs page](https://docs.brightsign.biz/manage/dws-local-access) for details on how to enable it in your application.

## Request Headers

The app sends the raw dump file as the request body with `Content-Type: application/octet-stream`. It also sends these headers when available:

-   `DeviceId`
-   `DeviceModel`
-   `DeviceFwVersion`
-   `DeviceUpTime`
-   `CrashDump: yes`
-   `DumpFileName`
-   `DumpRelativePath`
-   `DumpSize`
-   `DumpModifiedTime`
-   `Uploader: post-crash-dumps-js-app`

Device values come from `@brightsign/deviceinfo` on the player.
