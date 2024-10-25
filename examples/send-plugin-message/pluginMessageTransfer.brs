' Note: The plugin's filename can be anything, as long as the presentation the plugin is added to has the 
' appropriate filename (e.g. 'pluginMessageTransfer.brs') assigned.

' Note: the name of the plugin must be defined by the suffix '_Initialize', for example, pluginMessage
' is the name of the plugin defined by the function, pluginMessage_Initialize
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

' Note: the suffix '_ProcessEvent', for example, pluginMessage
' is the name of the plugin defined by the function, pluginMessage_ProcessEvent
Function pluginMessage_ProcessEvent(event As Object) as boolean
    
    ' retval should be false if the autorun should handle the event, even if the plugin also handled the event
    ' retval should be true if the autorun should NOT handle the event, the plugin instead handled the event
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
    ' pluginMessage!!<serialNumber>!!<filename>
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
      filename = fields[2]
      h.systemLog.SendLine("=== File " + filename + " showing ended and reported from player " + serialNumber)
      h.html.PostJsMessage({ serialNumber: serialNumber, filename: filename })
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
