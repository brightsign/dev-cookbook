' This is a simple script to initialize an application to be executed by the BrightSign OS

function main()
  ' Initialize an event loop to receive all events
  mp = CreateObject("roMessagePort")

  ' Enable the Local Diagnostic Web Server for local development
  enableLDWS()

  ' Enable SSH for logs and debugging without a serial connection
  ' enableSSH()
  
  widget = createHTMLWidget(mp)
  widget.Show()
  
  ' Initialize roNodeJs with path or correct filename, whether webpack is used or not.
  node_js = CreateObject("roNodeJs", "sd:/dist/backend.js", {message_port: mp, node_arguments: ["--inspect=0.0.0.0:2999"], arguments: []})

  'Event Loop
  while true
    msg = wait(0,mp)
    print "msg received - type=";type(msg)

    if type(msg) = "roHtmlWidgetEvent" then
      print "msg: ";msg
    end if
  end while
end function


function createHTMLWidget(mp as object) as object
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
    url: "http://localhost:8020"
    port: mp
  }
  
  ' Create HTML Widget
  h = CreateObject("roHtmlWidget",r,config)
  return h

end function


function enableLDWS()
  registrySection = CreateObject("roRegistrySection", "networking")
  
  if type(registrySection) = "roRegistrySection" then 
    registrySection.Write("http_server", "80")
  end if

  registrySection.Flush()
end function


function enableSSH()
  registrySection = CreateObject("roRegistrySection", "networking")

  if type(registrySection) = "roRegistrySection" then
    registrySection.Write("ssh", "22")
  end if

  n = CreateObject("roNetworkConfiguration", 0)
  n.SetLoginPassword("password")
  n.Apply()

  registrySection.Flush()
end function