function main()

	mp = CreateObject("roMessagePort") 
	'Enable lDWS
	EnableLDWS()
	' Enable SSH
	EnableSSH()
	' Create HTML Widget
	widget = CreateHTMLWidget(mp)
	widget.Show()

	'Event Loop
	while true
		msg = wait(0,mp)
		print "msg received - type=";type(msg)

		if type(msg) = "roHtmlWidgetEvent" then
			print "msg: ";msg
		end if
	end while

end function

function CreateHTMLWidget(mp as object) as object
	' Enable Web Inspector
	reg = CreateObject("roRegistrySection","html")
	reg.Write("enable_web_inspector","1")
	reg.Flush()

	' Get Screen Resolution
	vidmode = CreateObject("roVideoMode")
	width = vidmode.GetResX()
	height = vidmode.GetResY()

	r = CreateObject("roRectangle",0,0,width,height)

	' Create HTML Widget config
	config = {
		nodejs_enabled: true
		inspector_server: {
			port: 3000
		}
		url: "file:///sd:/dist/index.html"
		port: mp
	}

	' Create HTML Widget
	h = CreateObject("roHtmlWidget",r,config)
	return h

end function

function EnableLDWS()

	registrySection = CreateObject("roRegistrySection", "networking")

	if type(registrySection) = "roRegistrySection" then 

		registrySection.Write("http_server", "80")

	end if

	registrySection.Flush()

end function

function EnableSSH()

	regSSH = CreateObject("roRegistrySection", "networking")

	if type(regSSH) = "roRegistrySection" then

		regSSH.Write("ssh","22")

	endif

	n = CreateObject("roNetworkConfiguration", 0)
	n.SetLoginPassword("password")
	n.Apply()

	regSSH.Flush()

end function