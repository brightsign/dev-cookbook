' Example: Enable LDWS and set password using BrightScript
' This method uses roNetworkConfiguration to configure Local Diagnostic Web Server
Sub Main()
	' Create network configuration object
    ' 0 corresponds to eth0, 1 for wlan0, 2 for ppp0, usb0 and usb1 can be input as well
	nc = CreateObject("roNetworkConfiguration", 0)

	' Primary method: Enable LDWS and set the password using the API
	' This is the recommended approach for most use cases
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
