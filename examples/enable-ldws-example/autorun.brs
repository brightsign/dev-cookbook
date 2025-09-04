Sub Main()
	' Create network configuration object (0 = eth0, 1 = wlan0, 2 = ppp0, usb0 and usb1 can be input as well)
	nc = CreateObject("roNetworkConfiguration", 0)

	' Configure LDWS: enable on port 80 with password
	dwsConfig = { port: 80, open: "your_password_here" }
	
	print "Enabling LDWS..."
	rebootRequired = nc.SetupDWS(dwsConfig)
	ok = nc.Apply();

	' Get device IP address to show user where to connect
	currentConfig = nc.GetCurrentConfig()
	if type(currentConfig) = "roAssociativeArray" then  
		ipAddress$ = currentConfig.ip4_address  
	else
		ipAddress$ = "<device-ip>"
	endif  

	' Some configurations require restart to take effect
	if rebootRequired then
		print "Restarting device to apply changes..."
		RebootSystem()
	else
		print "LDWS enabled! Access at: http://"; ipAddress$; "/"
		print "Password: your_password_here"
	end if
End Sub
