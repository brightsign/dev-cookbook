' Example: Enable LDWS using registry settings
' This method uses direct registry manipulation to configure LDWS
' Note: This method requires manual device restart for changes to take effect

function Main()
	print "Configuring LDWS via registry settings..."
	
	' Create registry section for networking configuration
	registrySection = CreateObject("roRegistrySection", "networking")

	if type(registrySection) = "roRegistrySection" then 
		' Set HTTP server port for LDWS
		' Port 80 is the default HTTP port
		registrySection.Write("http_server", "80")
		
		print "Registry setting applied: http_server = 80"
		print "Manual device restart required for changes to take effect"
		print "After restart, access web interface at http://<device-ip>:80/"
	else
		print "Error: Could not create registry section"
	end if

	' Flush changes to persistent storage
	registrySection.Flush()
	
	return 0
end function