function main()
	mp = CreateObject("roMessagePort")

	' Create HTML Widget
	widget = CreateHTMLWidget(mp)
	widget.Show()
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
		url: "file:///sd:/index.html"
		port: mp
	}

	' Create HTML Widget
	h = CreateObject("roHtmlWidget",r,config)
	return h
end function