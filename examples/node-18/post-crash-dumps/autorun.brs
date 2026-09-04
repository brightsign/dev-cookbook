function main()

    CRASH_DUMP_UPLOAD_URL = "http://YOUR_SERVER_IP:8080/crashdump"
    REGISTRY_SECTION_NAME = "crash_dump_example"
    UPLOAD_URL_REGISTRY_KEY = "upload_url"

    mp = CreateObject("roMessagePort")

    ' Create directory to store crash-dumps if it does not already exist.
    dir = CreateDirectory("SD:/brightsign-dumps")

    SetCrashDumpUploadUrl(REGISTRY_SECTION_NAME, UPLOAD_URL_REGISTRY_KEY, CRASH_DUMP_UPLOAD_URL)

    node = CreateObject("roNodeJs", "SD:/index.js", { message_port: mp })

    while true
        msg = wait(0, mp)
        print "msg received - type="; type(msg)

        if type(msg) = "roNodeJsEvent" then
            print "msg: "; msg
        end if
    end while

end function

function SetCrashDumpUploadUrl(sectionName as string, keyName as string, uploadUrl as string) as void
    syslog = CreateObject("roSystemLog")
    registrySection = CreateObject("roRegistrySection", sectionName)
    ok = registrySection.Write(keyName, uploadUrl)
    if not ok then
        syslog.SendLine("[post-crash-dumps] WARNING: failed to write upload URL registry key")
    end if
    registrySection.Flush()
    syslog.SendLine("[post-crash-dumps] registry [" + sectionName + "] " + keyName + " = " + uploadUrl)
end function