Sub Main()
	print "Starting LDWS configuration..."

	' Create message port to communicate with Node.js
	mp = CreateObject("roMessagePort")
	nodeApp = CreateObject("roNodeJs", "index.js", { message_port: mp })

	' Event loop to handle Node.js messages
	while true
		msg = wait(0, mp)
		if type(msg) = "roNodeJsEvent" then
			print "Node.js: "; msg
		end if
	end while
End Sub
