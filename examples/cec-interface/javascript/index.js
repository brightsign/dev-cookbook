const CecClass = require('@brightsign/cec');
const cec1 = new CecClass('HDMI-1'); // Modify this to be 'HDMI-1', 'HDMI-2', 'HDMI-3', or 'HDMI-4' as needed

cec1.addEventListener("receive", function(packet) {
  const frame = packet.data;
  console.log("frame from HDMI-1: " + toHexString(frame));
});

const toHexString = (cecBytes) => {
  return Array.from(cecBytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join(' ');
};

async function sendCecCommand(buffer) {
  try {
    console.log("Sending CEC command ..." + toHexString(buffer));
    await cec1.send(buffer);
  } catch (error) {
    console.log("Error while sending CEC command: " + JSON.stringify(error));
  }
}

function main() {
  // * Developer Note: Varying display manufacturers require direct addressing. 
  // * There may be settings to configure direct address or not. 

  // Turn display "on" - image's view to on
  const bufferImageViewOn = new Uint8Array(2);
  bufferImageViewOn[0] = 0x4f;
  bufferImageViewOn[1] = 0x0D;

  // Turn display "off". Some displays will go to standby mode.
  const bufferStandby = new Uint8Array(2);
  bufferStandby[0] = 0x4f;
  bufferStandby[1] = 0x36;

  sendCecCommand(Array.from(bufferImageViewOn));
  
  // Wait 15 seconds, then turn display off
  setTimeout(() => {
    sendCecCommand(Array.from(bufferStandby));

    // Uncomment below to repeat the cycle every 15 seconds
    // setTimeout(main, 15000);
  }, 15000);
}

window.main = main;