function main()
  mp = CreateObject("roMessagePort")
  
  ' Create HTML Widget
  widget = CreateHTMLWidget(mp)
  widget.Show()

  'Event Loop
  while true
    msg = wait(0, mp)
    print "msg received - type=";type(msg)
    if type(msg) = "roHtmlWidgetEvent" then
      print "msg: ";msg
    end if
  end while

end function

function CreateHTMLWidget(mp as object) as object
  ' Get Screen Resolution
  vidmode = CreateObject("roVideoMode")
  width = vidmode.GetResX()
  height = vidmode.GetResY()

  r = CreateObject("roRectangle", 0, 0, width, height)

  ' Create HTML Widget config
  config = {
    nodejs_enabled: true,
    url: "file:///sd:/index.html",
    port: mp
  }

  ' Create HTML Widget
  h = CreateObject("roHtmlWidget", r, config)
  return h

end function
