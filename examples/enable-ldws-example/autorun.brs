' Example: Enable LDWS and set password using BrightScript
' This method uses roNetworkConfiguration to configure Local Diagnostic Web Server
Sub Main()
	' Create network configuration object
	nc = CreateObject("roNetworkConfiguration", 0)

	' Enable LDWS and set the password
	' The "open" field sets the password for web interface access
	dwsConfig = { open: "brightsign_ldws_2024" }
	
	print "Configuring Local Diagnostic Web Server..."
	rebootRequired = nc.SetupDWS(dwsConfig)

	' Reboot if required for changes to take effect
	if rebootRequired then
		print "Reboot required. Restarting device..."
		RebootSystem()
	else
		print "LDWS configuration applied successfully!"
		print "Access web interface at http://<device-ip>/ with password: brightsign_ldws_2024"
	end if
End Sub
