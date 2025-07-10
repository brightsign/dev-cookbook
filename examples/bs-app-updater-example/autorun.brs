function main()

	mp = CreateObject("roMessagePort")
	'Enable lDWS
	EnableLDWS()
	' Create Node JS Server
	node = createobject("roNodeJs", "SD:/index.js", { message_port:mp })

	'Event Loop
	while true
		msg = wait(0,mp)
		print "msg received - type=";type(msg)

		if type(msg) = "roNodeJsEvent" then
			print "msg: ";msg
		end if
	end while

end function

function EnableLDWS()
	registrySection = CreateObject("roRegistrySection", "networking")
	if type(registrySection) = "roRegistrySection" then 
		registrySection.Write("http_server", "80")
	end if
	registrySection.Flush()
end function
