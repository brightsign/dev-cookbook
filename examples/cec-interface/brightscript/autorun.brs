sub Main()
    print "BrightScript CEC Example: Display On/Off"

    mp = createobject("roMessagePort")
    cec = CreateObject("roCecInterface", "HDMI-1") ' Modify this to be 'HDMI-1', 'HDMI-2', 'HDMI-3', or 'HDMI-4' as needed
    if cec = invalid then
        print "Failed to create roCecInterface object."
        return
    end if

    ' Create a HTML widget to display something on the screen
    r = CreateObject("roRectangle", 0, 0, 1920, 1080)
    config = {
        url: "file:///sd:/index.html",
        inspector_server: {
            port: 2999
        }
    }
    htmlWidget = CreateObject("roHtmlWidget", r, config)
    htmlWidget.SetPort(mp)
    htmlWidget.Show()

    cec.SetPort(mp)

    ' Optionally enable debugging for CEC messages
    ' cec.EnableCecDebug("SD:/cec_debug.log")

    ' Send Image View On (4f0d)
    bufferImageViewOn = CreateObject("roByteArray")
    bufferImageViewOn.FromHexString("4f0d")
    cec.SendRawMessage(bufferImageViewOn)
    print "Sent Image View On: " + bufferImageViewOn.ToHexString()

    ' Wait 15 seconds, then send Standby
    sleep(15000)
    bufferStandby = CreateObject("roByteArray")
    bufferStandby.FromHexString("4f36")
    cec.SendRawMessage(bufferStandby)
    print "Sent Standby: " + bufferStandby.ToHexString()

    ' Optionally, uncomment the block below to repeat the cycle every 15 seconds
    ' while true
    '     sleep(15000)
    '     cec.SendRawMessage(bufferImageViewOn)
    '     print "Sent Image View On: " + bufferImageViewOn.ToHexString()

    '     sleep(15000)
    '     cec.SendRawMessage(bufferStandby)
    '     print "Sent Standby: " + bufferStandby.ToHexString()
    ' end while

    ' Message loop to handle any incoming messages (if needed)
    while true
        msg = wait(0, mp)
        if type(msg) = "roMessagePortEvent"
            ? "Message received: ";msg
        end if
    end while
end sub
