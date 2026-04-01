sub main()
	' Create directory to store crash-dumps (optional)
	dir = CreateDirectory("SD:/brightsign-dumps")
	if not dir then
		print "Could not create directory"
	end if

	' Required for sync manager to work properly
	' See https://docs.brightsign.biz/developers/rosyncmanager description for details
	WritePtpDomain()

	mp = CreateObject("roMessagePort")
	widget = CreateHTMLWidget(mp)
	widget.Show()

	' Event Loop
	while true
		msg = wait(0,mp)
		print "msg received - type=";type(msg)
		if type(msg) = "roHtmlWidgetEvent" then
			print "msg: ";msg
		end if
	end while
end sub

function CreateHTMLWidget(mp as object) as object
	vidmode = CreateObject("roVideoMode")
	width = vidmode.GetResX()
	height = vidmode.GetResY()
	r = CreateObject("roRectangle", 0, 0, width, height)
	config = {
		hwz_default: "on"
		nodejs_enabled: true
		brightsign_js_objects_enabled: true
		inspector_server: {
			port: 2999
		}
		url: "file:///sd:/index.html"
		port: mp
	}
	h = CreateObject("roHtmlWidget", r, config)
	return h
end function

sub WritePtpDomain()
    regSec = CreateObject("roRegistrySection", "networking")
    if regSec.Read("ptp_domain") = "0" then
        print "Ptp domain already set to 0"
    else
        regSec.Write("ptp_domain", "0")
        regSec.Flush()
        RebootSystem()
    end if
end sub