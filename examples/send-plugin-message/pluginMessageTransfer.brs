Function pluginMessage_Initialize(msgPort As Object, userVariables As Object, bsp as Object)
'no spaces in names
 
    print "=== pluginMessage_Initialize() - entry"
    pluginMessage = newPluginMessage(msgPort, userVariables, bsp)
    print "=== pluginMessage_Initialize() - exit"
    
    return pluginMessage
End Function

Function newPluginMessage(msgPort As Object, userVariables As Object, bsp as Object)
    print "=== newPluginMessage() - entry"

    s = {}
    s.version = 0.1
    s.msgPort = msgPort
    s.userVariables = userVariables
    s.bsp = bsp
    s.ProcessEvent = pluginMessage_ProcessEvent
    s.objectName = "pluginMessage_object"
    s.systemLog = CreateObject("roSystemLog")

    print "=== newPluginMessage() - exit"
    return s
End Function


Function pluginMessage_ProcessEvent(event As Object) as boolean
    
    retval = false
    if type(event) = "roAssociativeArray" then ' Receive a message from BA
      if type(event["EventType"]) = "roString"
        if event["EventType"] = "SEND_PLUGIN_MESSAGE" then
          if event["PluginName"] = "pluginMessage" then
            pluginMessage$ = event["PluginMessage"]
            retval = ParsePluginMessage(pluginMessage$, m)
          end if
        end if
      end if
    end if
    return retval
End Function


Function ParsePluginMessage(origMsg as String, h as Object) as boolean
  
  retval = false
  msg = lcase(origMsg)
  h.systemLog.SendLine("=== Received Plugin message: " + msg)
  r = CreateObject("roRegex", "^plugin", "i")
  match = r.IsMatch(msg)
  if match then
    retval = true
    ' split the string, !! is the field seperator
    ' pluginMessage!!<serialNumber>!!<timestamp>!!<filename>
    r2 = CreateObject("roRegex", "!!", "i")
    fields = r2.split(msg)
    command = fields[0]
    
    if h.html = invalid then
      h.html = FindHTMLWidget(h.bsp)
      if h.html = invalid then
        return true
      end if
    end if
    
    if command = "pluginMessage" then 
      serialNumber = fields[1]
      timestamp = fields[2]
      filename = fields[3]
      h.systemLog.SendLine("=== File " + filename + " showing ended and reported at " + timestamp + " from player " + serialNumber)
      h.html.PostJsMessage({ serialNumber: serialNumber, timestamp: timestamp, filename: filename })
    end if
  end if

  return retval
End Function

' Find the HTML widget in the bsp to ensure there is an app to receive messages
Function FindHTMLWidget(bsp)
  for each baZone in bsp.sign.zonesHSM
    print baZone.loadingHtmlWidget
    if baZone.loadingHtmlWidget <> invalid then
      print "=== Found HTML!"
      return baZone.loadingHtmlWidget
    end if
  end for

  print "=== Couldn't find htmlwidget"
  return invalid
End Function