function Main()
	print "Enabling LDWS via registry..."
	
	' Access the networking section of device registry
	registrySection = CreateObject("roRegistrySection", "networking")

	if type(registrySection) = "roRegistrySection" then 
		' Set HTTP server to enable LDWS on port 80
		registrySection.write("dwse", "yes")
		registrySection.write("http_server", 80)
		registrySection.Flush()

		print "Registry updated - restart device manually"
		print "After restart: http://<device-ip>/"
	else
		print "Error: Could not access registry"
	end if
end function