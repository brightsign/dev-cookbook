Sub Main()
    width = 1920
    height = 1080

    vidmode = CreateObject("roVideoMode")
    if type(vidmode) = "roVideoMode"
        width = vidmode.GetResX()
        height = vidmode.GetResY()
    end if

    msgPort = CreateObject("roMessagePort")
    rect = CreateObject("roRectangle", 0, 0, width, height)

    'inspector disabled currently
    'inspectorServer = {
    '   port: 3010
    '}

    config = {
        url: "file:/SD:/index.html",               ' you can use a server or website URL here - "https://example.com/index.html"
        mouse_enabled: false,                      ' set to true to enable mouse/keyboard
        'inspector_server: inspectorServer         ' uncomment to enable inspector server
        security_params: { websecurity: true }
        javascript_enabled: true,                  ' Else set to false to disable JavaScript
        nodejs_enabled: true,                      ' Else set to false to disable Node.js
        storage_path: "/cache",                    ' Name of the directory for local storage cache
        storage_quota: "2147483648",	           ' 2GB
        port: msgPort,
    }

    html = CreateObject("roHtmlWidget", rect, config)
    html.Show()

    syslog = CreateObject("roSystemLog")

    while true
        event = wait(0, msgPort)
        syslog.sendline("@@ type(event)="+ type(event))
    end while
End Sub
