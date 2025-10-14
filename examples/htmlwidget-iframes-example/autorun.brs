Sub main()
    x = 0
    y = 0
    width = 1920
    height = 1080
    url = "http://www.brightsign.biz"

    rect = CreateObject("roRectangle", x, y, width, height)
    
    securityParams = {
        trusted_iframes_enabled: true    ' This option is available after OS 9.1.75.3
    }
    config = {
        url: url,
        nodejs_enabled: true,
        brightsign_js_objects_enabled: true,
        security_params: securityParams,
        storage_path: "/local/",
    }
    html = CreateObject("roHtmlWidget", rect, config)

    ' Fallback in case the above fails due to unsupported security parameter
    if html = invalid then
        config = {
            url: url,
            nodejs_enabled: true,
            brightsign_js_objects_enabled: true,
            storage_path: "/local/",
        }
        html = CreateObject("roHtmlWidget", rect, config)
    end if
    
    html.Show()

    m.msgPort = CreateObject("roMessagePort")
    syslog = CreateObject("roSystemLog")
    while true
        event = wait(0, m.msgPort)
        syslog.sendline("@@ type(event)="+ type(event))
    end while
End Sub