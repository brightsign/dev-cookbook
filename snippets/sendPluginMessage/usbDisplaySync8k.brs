Function assetInfoMarker_Initialize(msgPort As Object, userVariables As Object, bsp as Object)
'no spaces in names
 
    print "=== assetInfoMarker_Initialize() - entry"
    assetInfo = newAssetInfo(msgPort, userVariables, bsp)
    print "=== assetInfoMarker_Initialize() - exit"
    
    return assetInfo
End Function

Function newAssetInfo(msgPort As Object, userVariables As Object, bsp as Object)
    print "=== newAssetInfo() - entry"

    s = {}
    s.version = 0.1
    s.msgPort = msgPort
    s.userVariables = userVariables
    s.bsp = bsp
    s.ProcessEvent = AssetInfo_ProcessEvent
    s.objectName = "usbDisplaySync8k_object"
    s.debug  = true
    s.systemLog = CreateObject("roSystemLog")
    s.fileCount = 0
    s.sumSizeAllFiles = 0
    s.assetFiles = []
    s.usbHtml = FindHTMLWidget(m.bsp)

    print "=== newAssetInfo() - exit"
    return s
End Function


Function assetInfo_ProcessEvent(event As Object) as boolean
    retval = false
    if type(event) = "roAssociativeArray" then ' Receive a message from BA
      if type(event["EventType"]) = "roString"
        if event["EventType"] = "SEND_PLUGIN_MESSAGE" then
          if event["PluginName"] = "usbDisplaySync8k" then
            pluginMessage$ = event["PluginMessage"]
            ParseAssetInfo(pluginMessage$, m)
          end if
        end if
      end if
    end if
    return retval
End Function


Function ParseAssetInfo(origMsg as String, h as Object) as boolean
  retval = false
  msg = lcase(origMsg)
  h.systemLog.SendLine("=== Received Plugin message: " + msg)
  r = CreateObject("roRegex", "^plugin", "i")
  match = r.IsMatch(msg)
  if match then
    retval = true
    ' split the string, ! is the field seperator
    ' plugin!<serialNumber>!<timestamp>!<filename>

    r2 = CreateObject("roRegex", "!", "i")
    fields = r2.split(msg)
    serialNumber = fields[1]
    timestamp = fields[2]
    filename = fields[3]
    h.systemLog.SendLine("=== File " + filename + " showing ended and reported at " + timestamp + " from player " + serialNumber)
    h.usbHtml.PostJsMessage({ serialNumber, timestamp, filename })
  end if

  return retval
End Function

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