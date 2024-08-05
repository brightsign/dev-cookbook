function main()

    mp = createobject("roMessagePort")

    node = createobject("roNodeJs", "bundle.js", {message_port:mp})

    while true
        msg = wait(0, mp)
        if type(msg) = "roMessagePortEvent"
            ? "Message received: ";msg
        end if
    end while

end function