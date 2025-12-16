function main()
    ' Create directory to store crash-dumps (optional)
	dir = CreateDirectory("SD:/brightsign-dumps")
	if not dir then
		print "Could not create directory"
	end if

  mp = CreateObject("roMessagePort")
  r = CreateObject("roRectangle", 0, 0, 1920, 1080)

  config = {
    nodejs_enabled: true,
    security_params: {
      websecurity: false
    },
    url: "file:///sd:/index.html",
    brightsign_js_objects_enabled: true,
    javascript_enabled: true,
    inspector_server: {
      port: 2999
    }
  }

  htmlWidget = CreateObject("roHtmlWidget", r, config)
  htmlWidget.SetPort(mp)
  htmlWidget.Show()

  while true
    msg = wait(0, mp)
    if type(msg) = "roMessagePortEvent"
      ? "Message received: ";msg
    end if
  end while

end function