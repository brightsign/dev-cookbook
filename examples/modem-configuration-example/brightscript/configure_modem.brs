' =============================================================================
' Cellular Modem Configuration Script for BrightSign
' =============================================================================
' This script configures a cellular modem interface and optionally sets up
' DHCP sharing to provide internet connectivity to other devices.
'
' Usage: script configure_modem.brs [APN="carrier.apn"] [DNS="8.8.8.8"] 
'                                  [MODEM="ppp0"] [DHCP="eth0"]
'
' Features:
' - Configures PPP dial-up connection with cellular modem
' - Sets up DHCP server for internet sharing
' - Configures routing metrics for proper interface priority
' - Supports command line argument parsing
' =============================================================================

Sub ConfigureModem(pars as Object)
  Print "Configuring modem: "; pars.iface; " APN = "; pars.apn
  q = chr(34) ' chr(34) is the double-quote character

  nc = CreateObject ("roNetworkConfiguration", pars.iface)
  
  If nc <> invalid Then
    ' Reset any existing settings on this interface
    nc.ResetInterfaceSettings()

    ' Build AT command to configure PDP context with APN
    init = "AT+CGDCONT=1," + q + "IP" + q + "," + q + pars.apn + q
    nc.SetDialupNumber("*99#")
    nc.SetDialupUser("")
    nc.SetDialupPassword("")
    nc.SetDialupInitString(init)
    
    ' Set routing metric; lower values have higher priority
    nc.SetRoutingMetric(100)
    
    ok = nc.Apply()
    If not ok Then
      print "Failure calling roNetworkConfiguration.Apply() in ConfigureModem"
    End If

  Else
    print "Failure creating roNetworkConfiguration in ConfigureModem"
  End If
End Sub

Sub ConfigureDHCP(pars as Object)
  print "Configuring DHCP on: "; pars.iface; " DNS = "; pars.dns
  
  nc = CreateObject("roNetworkConfiguration", pars.iface)

  If nc <> invalid Then
    ' Reset any existing settings on this interface
    nc.ResetInterfaceSettings()

    ' Configure static IP for this interface (acts as gateway)
    nc.SetIp4Address("192.168.10.1")
    nc.SetIp4Netmask("255.255.255.0")
    nc.SetIp4Broadcast("192.168.10.255")
    ' Configure DHCP pool and routing
    nc.ConfigureDHCPServer({
      ip4_start: "192.168.10.10",
      ip4_end: "192.168.10.127",
      ip4_gateway: "192.168.10.1",
      name_servers: [pars.dns]
    })
    ' Enable NAT for internet sharing
    nc.SetForwardingPolicy({
      forwarding_enabled: true,
      nat_enabled: true
    })
    
    ' Set routing metric; lower values have higher priority
    nc.SetRoutingMetric(110)
    
    ok = nc.Apply()
    If not ok Then
      print "Failure calling roNetworkConfiguration.Apply() in ConfigureDHCP"
    End If
  Else
    print "Failure creating roNetworkConfiguration in ConfigureDHCP"
  End If
End Sub

' Displays usage information for the script
Sub PrintUsage()
  q = chr(34) ' chr(34) is the double-quote character
  print "script configure_modem.brs [APN="+q+"giffgaff.com"+q+"] [DNS="+q+"8.8.8.8"+q+"] [MODEM="+q+"ppp0"+q+"] [DHCP="+q+"eth0"+q+"]"
End Sub

' Main entry point - parses command line arguments and configures modem/DHCP
' @param args (Array) - Command line arguments in KEY=VALUE format
Sub Main(args as Object)

  ' Enable LDWS
  nc = CreateObject("roNetworkConfiguration", 0)
	dwsConfig = { port: 80, open: "Password@123" }
	print "Enabling LDWS..."
	rebootRequired = nc.SetupDWS(dwsConfig)
	nc.Apply()

  ' Default configuration values
  modem_iface = "ppp0"
  apn = "broadband" ' "m2m.com.attz" ' "giffgaff.com"
  dhcp_iface = "eth0"
  dns = "8.8.8.8"
  
  ' Parse command line arguments (case-insensitive)
  For Each arg In args
    If arg = "help" Then
      PrintUsage()
      Return
    End If
    If arg.Left(6) = "MODEM=" or arg.Left(6) = "modem="
      modem_iface = arg.Right(arg.Len()-6)
    End If
    If arg.Left(5) = "DHCP=" or arg.Left(5) = "dhcp="
      dhcp_iface = arg.Right(arg.Len()-5)
    End If
    If arg.Left(4) = "APN=" or arg.Left(4) = "apn="
      apn = arg.Right(arg.Len()-4)
    End If
    If arg.Left(4) = "DNS=" or arg.Left(4) = "dns="
      dns = arg.Right(arg.Len()-4)
    End If
  End For

  ' Configure the modem with the specified APN on the specified interface
  ConfigureModem({ apn: apn, iface: modem_iface })

  ' Configure DHCP server on the specified interface with the specified DNS
  ' ConfigureDHCP({ dns: dns, iface: dhcp_iface })

  port = CreateObject("roMessagePort")

  Sleep(5000)

  mfg = CreateObject("roMfgTest")
  serialPortName$ = mfg.GetModemStatusPort()
  serial = CreateObject("roSerialPort", serialPortName$, 115200)
  
  if serial = invalid then
    print " === Failed to create roSerialPort ==="
  else
    print " === roSerialPort created successfully with port: "; serialPortName$; " ==="
    serial.SetLineEventPort(port)

    ' Send AT commands to get SIM and IMSI information
    print "Sending AT commands to modem..."
    serial.SendLine("AT+QCCID")

    Sleep(5000)
    ' serial.SendLine("AT+CGDCONT=?")

    ' Sleep(5000)
    ' serial.SendLine("AT+QCFG=" + chr(34) + "usbnet" + chr(34) + ",1")
    serial.SendLine("AT+QCFG?")
  end if

  nh = CreateObject("roNetworkHotplug")
  nh.SetPort(port)

  ' Event loop to handle incoming messages
  while true
    event = wait(0, port)
    ' print "event received - type=" + type(event)

    if type(event) = "roControlDown" and stri(event.GetSourceIdentity()) = stri(m.svcPort.GetIdentity()) then
      if event.GetInt() = 12 then
        stop
      end if
    end if

    if type(event) = "roStreamLineEvent"
      msg = event.GetString().Trim()
      print "Modem Response: "; msg

      if msg.Left(7) = "+QCCID:" then
        ' print "SIM card is present. Now sending AT+CIMI command:"
        ' serial.SendLine("AT+CIMI" + chr(13))
        serial.SendLine("AT+CREG?")

      else if msg.Left(5) = "ERROR" then
        print "Error received from modem: "; msg
      end if
    
    else if type(event) = "roNetworkAttached" then
      networkInterface$ = event.GetString()
      print " ==== Network attached: "; networkInterface$; " ===="
      
      nc = CreateObject("roNetworkConfiguration", networkInterface$)
      if type(nc) = "roNetworkConfiguration" then
        currentConfig = nc.GetCurrentConfig()
        if type(currentConfig) = "roAssociativeArray" then
            print " === Current IP address: "; currentConfig.ip4_address
        end if
      end if
      nc = invalid

      if networkInterface$ = modem_iface then
        if serial <> invalid then
          ' Send AT+CIMI command to get IMSI
          print "Sending AT+CIMI commands to modem..."
          serial.SendLine("AT+CIMI" + chr(13))
        end if
      end if
    end if

  end while
End Sub
