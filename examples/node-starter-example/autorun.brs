function main()
    ' Create directory to store crash-dumps (optional)
	dir = CreateDirectory("SD:/brightsign-dumps")
	if not dir then
		print "Could not create directory"
	end if

    mp = createobject("roMessagePort")

    node = createobject("roNodeJs", "index.js", {message_port:mp})

    while true
        msg = wait(0, mp)
        if type(msg) = "roMessagePortEvent"
            ? "Message received: ";msg
        end if
    end while

end function