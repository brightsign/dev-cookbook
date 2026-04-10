Sub Main()
    width = 1920
    height = 1080
    vidmode = CreateObject("roVideoMode")
    if type(vidmode) = "roVideoMode"
        width = vidmode.GetResX()
        height = vidmode.GetResY()
    end if

    htmlConfig = {
        mouse_enabled: True,
        nodejs_enabled: True,
        brightsign_js_objects_enabled: True,
        url: "file:///sd:/index.html"
    }
    rect = CreateObject("roRectangle", 0, 0, width, height)
    h = CreateObject("roHtmlWidget", rect, htmlConfig)
    h.show()
    while true
       sleep(1000)
    end while
End Sub

