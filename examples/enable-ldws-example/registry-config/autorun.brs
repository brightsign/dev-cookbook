function Main()
	print "Enabling LDWS via registry..."
	
	' Access the networking section of device registry
	registrySection = CreateObject("roRegistrySection", "networking")

	if type(registrySection) = "roRegistrySection" then
		' Enable Local DWS on the default port 80
		registrySection.write("dwse", "yes")
		' Set HTTP server to enable LDWS on the specified port
		' registrySection.write("http_server", "80")
		print "Registry updated - restart device"
		print "After restart: http://<device-ip>/"
		RebootSystem()
	else
		print "Error: Could not access registry"
	end if
end function