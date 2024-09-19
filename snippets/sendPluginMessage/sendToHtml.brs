Function sendToHtml_Initialize(msgPort As Object, userVariables As Object, bsp as Object)
'no spaces in names
 
    print "=== sendToHtml_Initialize() - entry"
    sendToHtml = newSendToHtml(msgPort, userVariables, bsp)
    print "=== sendToHtml_Initialize() - exit"
    
    return sendToHtml
End Function

Function newSendToHtml(msgPort As Object, userVariables As Object, bsp as Object)
    print "=== newSendToHtml() - entry"

    s = {}
    s.version = 0.1
    s.msgPort = msgPort
    s.userVariables = userVariables
    s.bsp = bsp
    s.ProcessEvent = sendToHtml_ProcessEvent
    s.objectName = "sendToHtml_object"
    s.debug  = true
    s.systemLog = CreateObject("roSystemLog")

    print "=== newSendToHtml() - exit"
    return s
End Function


Function sendToHtml_ProcessEvent(event As Object) as boolean
  
  retval = false
  if type(event) = "roAssociativeArray" then ' Receive a message from BA
    if type(event["EventType"]) = "roString"
      if event["EventType"] = "SEND_PLUGIN_MESSAGE" then
        if event["PluginName"] = "sendToHtml" then
          pluginMessage$ = event["PluginMessage"]
          retval = ParseSendToHtml(pluginMessage$, m)
        end if
      end if
    end if
  end if

  return retval
End Function


Function ParseSendToHtml(origMsg as String, h as Object) as boolean
  
  retval = false
  msg = lcase(origMsg)
  h.systemLog.SendLine("=== Received Plugin message: " + msg)
  r = CreateObject("roRegex", "^plugin", "i")
  match = r.IsMatch(msg)
  if match then
    retval = true
    ' split the string, ! is the field seperator
    
    ' Commands:
    ' Advanced Command, Send Plugin Message
    ' plugin!!sendtojs!!<command>
    r2 = CreateObject("roRegex", "!!", "i")
    fields = r2.split(msg)
    command = fields[1]
    h.systemLog.SendLine("=== command: " + command)

    if command = "sendtojs" then

      if h.html = invalid then
        h.html = FindHTMLWidget(h.bsp)
        if h.html = invalid then
          return true
        end if
      end if

      message = fields[2]
      value = fields[3]
      h.systemLog.SendLine("=== message: " + message)
      h.systemLog.SendLine("=== value: " + value)
      h.html.PostJsMessage({ htmlcommand: "sendToJs", command: message, commandvalue: value})
    end if
  end if  

  return retval
End Function


Function FindHTMLWidget(bsp)
  for each baZone in bsp.sign.zonesHSM
    print baZone.loadingHtmlWidget
    if baZone.loadingHtmlWidget <> invalid then
      print "Found HTML!"
      return baZone.loadingHtmlWidget
    end if
  end for

  print "Couldn't find htmlwidget"
  return invalid
End Function