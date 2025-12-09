' autorun.brs
' Main application script that runs after autorun.zip extraction
' This is a sample application that demonstrates a typical BrightSign setup

function main()
    print "=== BrightSign Application Starting ==="
    
    ' Initialize the application
    InitializeDirectories()
    LoadConfiguration()
    
    ' Create message port for HTML widget events
    mp = CreateObject("roMessagePort")
    
    ' Create and display HTML widget
    widget = CreateHTMLWidget(mp)
    widget.Show()
    
    print "Application initialized successfully"
    print "HTML widget displayed, entering event loop..."
    
    ' Main event loop
    while true
        msg = wait(0, mp)
        if type(msg) = "roHtmlWidgetEvent" then
            HandleHtmlEvent(msg)
        end if
    end while
end function

' Initialize required directories
function InitializeDirectories() as void
    print "Initializing directories..."
    
    ' Create brightsign-dumps directory for crash information
    ' This is optional but highly recommended for troubleshooting
    dir = CreateDirectory("SD:/brightsign-dumps")
    if not dir then
        print "WARNING: Could not create brightsign-dumps directory"
    else
        print "Created brightsign-dumps directory"
    end if
    
    ' Verify other directories exist
    if not DoesPathExist("SD:/cache") then
        print "WARNING: cache directory not found"
    end if
    
    if not DoesPathExist("SD:/config") then
        print "WARNING: config directory not found"
    end if
    
    if not DoesPathExist("SD:/logs") then
        print "WARNING: logs directory not found"
    end if
end function

' Load application configuration
function LoadConfiguration() as void
    print "Loading configuration..."
    
    ' Try to load config from config directory
    configPath$ = "SD:/config/app-config.json"
    
    if DoesFileExist(configPath$) then
        print "Configuration file found at: "; configPath$
        ' In a real application, you would parse the JSON config here
    else
        print "No configuration file found, using defaults"
    end if
end function

' Create HTML widget for displaying the application UI
function CreateHTMLWidget(mp as object) as object
    print "Creating HTML widget..."
    
    ' Get screen resolution
    vidmode = CreateObject("roVideoMode")
    width = vidmode.GetResX()
    height = vidmode.GetResY()
    print "Screen resolution: "; width; "x"; height
    
    ' Create rectangle for full-screen widget
    r = CreateObject("roRectangle", 0, 0, width, height)
    
    ' Configure HTML widget
    config = {
        nodejs_enabled: false
        url: "file:///sd:/index.html"
        port: mp
    }
    
    ' Create HTML widget
    h = CreateObject("roHtmlWidget", r, config)
    
    if h = invalid then
        print "ERROR: Failed to create HTML widget"
    else
        print "HTML widget created successfully"
    end if
    
    return h
end function

' Handle HTML widget events
function HandleHtmlEvent(msg as object) as void
    eventData = msg.GetData()
    
    if type(eventData) = "roAssociativeArray" then
        if eventData.reason <> invalid then
            print "HTML Event - Reason: "; eventData.reason
        end if
        
        if eventData.message <> invalid then
            print "HTML Event - Message: "; eventData.message
        end if
    end if
end function

' Check if a file exists
function DoesFileExist(filePath$ as string) as boolean
    fileInfo = MatchFiles(filePath$, filePath$)
    return fileInfo.Count() > 0
end function

' Check if a path (directory) exists
function DoesPathExist(path$ as string) as boolean
    ' Add wildcard to check for any file in directory
    testPath$ = path$ + "/*"
    fileInfo = MatchFiles(path$, testPath$)
    return fileInfo.Count() >= 0  ' Directory exists even if empty
end function
