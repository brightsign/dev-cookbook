' BrightSign Provisioning Script
' This script downloads content from the provisioning server and sets up the player

function main()
    print "=== BrightSign Provisioning Script ==="
    
    ' Initialize notification display
    InitNotify()
    Notify("Provisioning player...")
    
    ' Get server URL from environment or use default
    ' In production, you would set this via registry before provisioning
    serverUrl$ = GetServerUrl()
    print "Server URL: "; serverUrl$
    Notify("Connecting to server...")
    
    ' Download the actual application content
    success = DownloadContent(serverUrl$)
    
    if success then
        print "✓ Provisioning successful!"
        Notify("Provisioning complete! Rebooting...")
        sleep(3000)
        RebootSystem()
    else
        print "✗ Provisioning failed!"
        Notify("Provisioning failed. Retrying on next boot...")
        sleep(10000)
    end if
end function

function GetServerUrl() as string
    ' Try to get server URL from registry
    ' Returns the base server URL for downloading content (not the recovery path)
    registry = CreateObject("roRegistry")
    networkingSection = CreateObject("roRegistrySection", "networking")
    
    recoveryUrl$ = networkingSection.Read("ru")
    baseUrl$ = networkingSection.Read("ub")
    
    ' Priority 1: Check if ru is an absolute URL (B-deploy style)
    ' e.g., ru = "http://server.com:3000/provision"
    if recoveryUrl$ <> "" and Instr(1, recoveryUrl$, "://") > 0 then
        ' Extract base URL from absolute recovery URL
        slashPos = Instr(1, recoveryUrl$, "://")
        if slashPos > 0 then
            afterProtocol$ = Mid(recoveryUrl$, slashPos + 3)
            nextSlash = Instr(1, afterProtocol$, "/")
            if nextSlash > 0 then
                ' Return base: http://server.com:3000
                return Left(recoveryUrl$, slashPos + 2 + nextSlash - 1)
            else
                ' No path, return as-is
                return recoveryUrl$
            end if
        end if
    end if
    
    ' Priority 2: Use ub (BSN.cloud style or manual configuration)
    ' e.g., ub = "http://server.com:3000", ru = "/provision"
    if baseUrl$ <> "" then
        return baseUrl$
    end if
    
    ' Fallback: Use default local server
    return "http://192.168.1.100:3000"
end function

function DownloadContent(serverUrl$ as string) as boolean
    print "Downloading content from server..."
    Notify("Downloading content...")
    
    ' Create URL transfer object
    urlTransfer = CreateObject("roUrlTransfer")
    urlTransfer.SetUrl(serverUrl$ + "/content/index.html")
    
    ' Download index.html
    print "Downloading index.html..."
    Notify("Downloading HTML files...")
    if not DownloadFile(urlTransfer, serverUrl$ + "/content/index.html", "SD:/index.html") then
        Notify("Error: Failed to download HTML files")
        return false
    end if
    
    ' Download autorun.brs (the application autorun, not this provisioning script)
    print "Downloading autorun.brs..."
    Notify("Downloading application script...")
    if not DownloadFile(urlTransfer, serverUrl$ + "/content/autorun.brs", "SD:/autorun.brs") then
        Notify("Error: Failed to download application script")
        return false
    end if
    
    ' Create static directory
    CreateDirectory("SD:/static")
    
    ' Download static assets
    print "Downloading static assets..."
    Notify("Downloading assets...")
    if not DownloadFile(urlTransfer, serverUrl$ + "/content/static/logo192.png", "SD:/static/logo192.png") then
        print "Warning: Could not download logo192.png"
    end if
    
    if not DownloadFile(urlTransfer, serverUrl$ + "/content/static/XD-1035.png", "SD:/static/XD-1035.png") then
        print "Warning: Could not download XD-1035.png"
    end if
    
    print "✓ All content downloaded successfully"
    return true
end function

function DownloadFile(urlTransfer as object, url$ as string, destPath$ as string) as boolean
    urlTransfer.SetUrl(url$)
    
    ' Attempt download with retries
    maxRetries = 3
    retryCount = 0
    
    while retryCount < maxRetries
        result = urlTransfer.GetToFile(destPath$)
        
        if result = 200 then
            print "  ✓ Downloaded: "; destPath$
            return true
        else
            retryCount = retryCount + 1
            print "  ✗ Download failed ("; result; "), retry "; retryCount; "/"; maxRetries
            sleep(2000)
        end if
    end while
    
    print "  ✗ Failed to download: "; url$
    return false
end function

' Initialize notification display widgets
sub InitNotify()
    m.global = GetGlobalAA()
    videoMode = CreateObject("roVideoMode")
    
    ' Check if video mode is supported
    if type(videoMode) <> "roVideoMode" then
        print "Video mode not supported, notifications disabled"
        return
    end if
    
    ' Get screen resolution
    resX = videoMode.GetResX()
    resY = videoMode.GetResY()
    
    ' Create background widget (covers entire screen)
    m.global.bgRectangle = CreateObject("roRectangle", 0, 0, resX, resY)
    m.global.bgParams = CreateObject("roAssociativeArray")
    m.global.bgParams.LineCount = 1
    m.global.bgParams.TextMode = 2
    m.global.bgParams.Rotation = 0
    m.global.bgParams.Alignment = 1
    m.global.bgWidget = CreateObject("roTextWidget", m.global.bgRectangle, 1, 2, m.global.bgParams)
    m.global.bgWidget.PushString("")
    m.global.bgWidget.Show()
    
    ' Create message widget (centered text)
    m.global.msgRectangle = CreateObject("roRectangle", 0, resY/2-resY/64, resX, resY/32)
    m.global.msgParams = CreateObject("roAssociativeArray")
    m.global.msgParams.LineCount = 1
    m.global.msgParams.TextMode = 2
    m.global.msgParams.Rotation = 0
    m.global.msgParams.Alignment = 1
    m.global.msgWidget = CreateObject("roTextWidget", m.global.msgRectangle, 1, 2, m.global.msgParams)
    m.global.msgWidget.Show()
end sub

' Display notification message on screen
sub Notify(message as string)
    print message
    
    ' Check if widgets are initialized
    if m.global = invalid or m.global.msgWidget = invalid then
        return
    end if
    
    ' Update and display message
    m.global.msgWidget.PushString(message)
    m.global.msgWidget.Raise()
    m.global.msgWidget.Show()
    
    ' Ensure background is visible
    if m.global.bgWidget <> invalid then
        m.global.bgWidget.Raise()
        m.global.bgWidget.Show()
    end if
end sub
