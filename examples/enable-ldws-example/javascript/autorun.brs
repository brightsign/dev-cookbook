' Autorun file for Node.js LDWS configuration example
' This file launches the Node.js application that configures LDWS

Sub Main()
	print "Starting Node.js LDWS configuration application..."

	mp = CreateObject("roMessagePort")
	
	' Create and run Node.js application
	nodeApp = CreateObject("roNodeJs", "index.js", { message_port: mp })

	'Event Loop
	while true
		msg = wait(0,mp)
		print "msg received - type=";type(msg)

		if type(msg) = "roNodeJsEvent" then
			print "msg: ";msg
		end if
	end while
End Sub
