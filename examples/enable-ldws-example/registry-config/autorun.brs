function Main()
	print "Enabling LDWS via registry..."
	
	' Access the networking section of device registry
	registrySection = CreateObject("roRegistrySection", "networking")

	if type(registrySection) = "roRegistrySection" then

		' Check if LDWS is already enabled
		if registrySection.read("http_server") <> "" and registrySection.read("http_server") <> "0" then
			print "HTTP server port already set. LDWS may already be enabled."
		else if registrySection.read("dwse") = "yes" then
			print "LDWS already enabled."
		else 
			' Set HTTP server to enable LDWS on the specified port
			registrySection.write("http_server", "80")
			' Enable Local DWS on the default port 80
			' registrySection.write("dwse", "yes")
			print "Registry updated - restart device"
			print "After restart: http://<device-ip>/"
			RebootSystem()
		end if
	else
		print "Error: Could not access registry"
	end if
end function