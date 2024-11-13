Function main()
  while not finished
      ev = mp.WaitMessage(30000)
      if type(ev) <> "roHtmlWidgetEvent" then
          print type(ev)
          stop
      end if
      payload = ev.GetData()
      print payload
      print "Reason: "; payload.reason
      if payload.reason = "message" then
          print "Message: "; payload.message
          if payload.message.complete = invalid then
              stop
          else if payload.message.complete = "true" then
              finished = true
              if payload.message.result = "PASS" then
                  print "Test passed"
              else
                  print "Test failed: "; payload.message.err
                  stop
              end if
          end if
      end if
  end while
End Function