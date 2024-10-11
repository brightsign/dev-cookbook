# How to send a plugin message to your html application
This example demonstrates how to set up a presentation that sends plugin messages to your HTML application. Once received, these messages can be forwarded to your backend for processing.

The setup consists of three components:

1. **Presentation File (`bpfx`)**: This file supports sending plugin messages from the included widgets.
2. **Script File (`pluginMessageTransfer.brs`)**: Captures the plugin messages and passes them to the HTML application.
3. **HTML Application (`pluginMessageApp.html`)**: Receives the messages and handles further processing.

The plugin message format enforced in the `pluginMessageTransfer.brs` file is: `pluginMessage!!<serialNumber>!!<timestamp>!!<filename>`. You can modify this format to suit the information you need to communicate from your presentations to your backend.

## Open the presentation in BA:connected
The `bpfx` presentation file can be opened in BrightAuthor:connected by clicking the dropdown by "Presentations" and then selecting "Open..."
Choose this `bpfx` file and if it asks for the location of the `html` and `brs` files, point it to the folder in which they are contained.

Once open, the widgets can individually be selected and the "advanced" tab on the right side can be opened to view related plugin messages.

Widgets and plugin messages can be altered in the presentation. Once complete, the presentation should be saved and published to your player.