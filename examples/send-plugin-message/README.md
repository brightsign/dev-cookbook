# How to send a plugin message to your html application
This example demonstrates how to set up a presentation that sends plugin messages to your HTML application. Once received, these messages can be forwarded to your backend for processing.

The setup consists of three components:

1. **Presentation File (`plugin-message-transfer.bpfx`)**: This file supports sending plugin messages from the included widgets.
2. **Script File (`pluginMessageTransfer.brs`)**: Sends and receives the plugin messages between the BrightAuthor:connected Presentation.
3. **HTML Application (`pluginMessageApp.html`)**: Receives the messages and handles further processing.

The plugin message format enforced in the `pluginMessageTransfer.brs` file is: `pluginMessage!!<serialNumber>!!<filename>`. You can modify this format to suit the information you need to communicate from your presentations to your backend. In this case, the plugin messages are triggered by the TimeoutEvents attached to each example video in the presentation. The messages include the variable serial number of the player and the text that indicates if the 1stVideo or 2ndVideo executed. 

## How to run and edit the example
The `bpfx` presentation file can be opened in BrightAuthor:connected by clicking the dropdown next to "Presentations" and then selecting "Open..."
Choose this `bpfx` file and if it asks for the location of the `html` and `brs` files, point it to the folder in which they are contained.

Once open, the widgets can individually be selected and the "advanced" tab on the right side can be opened to view related plugin messages.

Widgets and plugin messages can be altered in the presentation. Once complete, the presentation should be saved and published to your player.