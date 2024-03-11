' This is a simple script to initialize an application to be executed by the BrightSign OS

function main()
  ' Initialize an event loop to receive all events
  mp = createobject("roMessagePort")

  node = createobject("roNodeJs", "bundle.js", {message_port:mp})
  
  'Event Loop
  while true
    msg = wait(0, mp)
    if type(msg) = "roMessagePortEvent"
      print "msg: ";msg
    end if
  end while

end function