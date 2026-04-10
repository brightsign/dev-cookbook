Sub Main()
    htmlConfig = {
        mouse_enabled: True,
        nodejs_enabled: True,
        brightsign_js_objects_enabled: True,
        security_params: {
            websecurity: False,
        },
        url: "file:///index.html"
    }
    h = createobject("rohtmlwidget", createobject("rorectangle", 0, 0, 1920, 1080), htmlConfig)
    h.show()
    while true
       sleep(1000)
    end while
End Sub

