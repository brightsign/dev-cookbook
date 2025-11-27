' BrightSign Provisioning Script
' This script downloads content from the provisioning server and sets up the player

function main()
    print "=== BrightSign Provisioning Script ==="
    
    ' Get server URL from environment or use default
    ' In production, you would set this via registry before provisioning
    serverUrl$ = GetServerUrl()
    print "Server URL: "; serverUrl$
    
    ' Download the actual application content
    success = DownloadContent(serverUrl$)
    
    if success then
        print "✓ Provisioning successful!"
        print "Rebooting to start application..."
        ' Give time for message to be seen
        sleep(3000)
        RebootSystem()
    else
        print "✗ Provisioning failed!"
        print "Will retry on next boot..."
        sleep(10000)
    end if
end function

function GetServerUrl() as string
    ' Try to get server URL from registry
    registry = CreateObject("roRegistry")
    networkingSection = CreateObject("roRegistrySection", "networking")
    
    baseUrl$ = networkingSection.Read("ub")
    if baseUrl$ = "" then
        ' Fallback to environment variable or default
        ' You should set this in the player registry before first boot
        baseUrl$ = "http://192.168.1.100:3000"
    end if
    
    return baseUrl$
end function

function DownloadContent(serverUrl$ as string) as boolean
    print "Downloading content from server..."
    
    ' Create URL transfer object
    urlTransfer = CreateObject("roUrlTransfer")
    urlTransfer.SetUrl(serverUrl$ + "/content/index.html")
    
    ' Download index.html
    print "Downloading index.html..."
    if not DownloadFile(urlTransfer, serverUrl$ + "/content/index.html", "SD:/index.html") then
        return false
    end if
    
    ' Download autorun.brs (the application autorun, not this provisioning script)
    print "Downloading autorun.brs..."
    if not DownloadFile(urlTransfer, serverUrl$ + "/content/autorun.brs", "SD:/autorun.brs") then
        return false
    end if
    
    ' Create static directory
    CreateDirectory("SD:/static")
    
    ' Download static assets
    print "Downloading static assets..."
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
