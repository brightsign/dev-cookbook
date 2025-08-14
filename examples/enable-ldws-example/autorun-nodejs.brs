' Autorun file for Node.js LDWS configuration example
' This file launches the Node.js application that configures LDWS

Sub Main()
	print "Starting Node.js LDWS configuration application..."
	
	' Create and run Node.js application
	nodeApp = CreateObject("roNodeApp")
	if nodeApp <> invalid then
		nodeApp.Run("index.js")
	else
		print "Error: Could not create Node.js application object"
	end if
End Sub
