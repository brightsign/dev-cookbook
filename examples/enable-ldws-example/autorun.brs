' Example: Enable LDWS and set password using BrightScript
' This method uses roNetworkConfiguration to configure Local Diagnostic Web Server
Sub Main()

    ' Create registry section for networking configuration
	registrySection = CreateObject("roRegistrySection", "networking")

	if type(registrySection) = "roRegistrySection" then 
		' Set HTTP server port for LDWS
		' Port 80 is the default HTTP port
		registrySection.Write("dwse", "yes")

		print "Registry setting applied: bsne = yes"
	else
		print "Error: Could not create registry section"
	end if

	' Create network configuration object
    ' 0 corresponds to eth0, 1 for wlan0, 2 for ppp0, usb0 and usb1 can be input as well
	nc = CreateObject("roNetworkConfiguration", 0)

	' Enable LDWS and set the password
	' The "open" field sets the password for web interface access
	dwsConfig = { port: 80, open: "your_password_here" }
	
	print "Configuring Local Diagnostic Web Server..."
	rebootRequired = nc.SetupDWS(dwsConfig)

    currentConfig = nc.GetCurrentConfig()

	if type(currentConfig) = "roAssociativeArray" then  
		ipAddress$ = currentConfig.ip4_address  
	else
		ipAddress$ = "<device-ip>"
	endif  

	' Reboot if required for changes to take effect
	if rebootRequired then
		print "Reboot required. Restarting device..."
		RebootSystem()
	else
		print "LDWS configuration applied successfully!"
		print "Access web interface at http://"; ipAddress$; "/ with password: your_password_here"
	end if
End Sub
