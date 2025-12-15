' BrightSign Example Autorun Script
' The main content autorun script, this is the script which runs on BrightSign startup after provisioning is complete.
function main()
	' Create directory to store crash-dumps (optional)
	dir = CreateDirectory("SD:/brightsign-dumps")
	if not dir then
		print "Could not create directory"
	end if

	' This interface is the preferred way for JavaScript content to communicate with its parent application.
	' https://docs.brightsign.biz/developers/romessageport
	mp = CreateObject("roMessagePort")

	' Create HTML Widget which is defined below in its own function
	widget = CreateHTMLWidget(mp)
	widget.Show()

	' Event Loop to view the events that are being sent from the HTML content.
	' The roHtmlWidgetEvent object is sent to the message port when an event occurs in the HTML content.
	while true
		msg = wait(0,mp)
		print "msg received - type=";type(msg)
		if type(msg) = "roHtmlWidgetEvent" then
			print "msg: ";msg
		end if
	end while
end function

function CreateHTMLWidget(mp as object) as object
	' Get Screen Resolution
	' https://docs.brightsign.biz/developers/rovideomode
	vidmode = CreateObject("roVideoMode")
	width = vidmode.GetResX()
	height = vidmode.GetResY()
	' https://docs.brightsign.biz/developers/rorectangle
	r = CreateObject("roRectangle",0,0,width,height)

	config = {
		nodejs_enabled: true
		url: "file:///sd:/index.html"
		port: mp
	}

	' Create HTML Widget
	' https://docs.brightsign.biz/developers/rohtmlwidget
	h = CreateObject("roHtmlWidget",r,config)
	return h
end function
