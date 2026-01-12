' autozip.brs
' This script is responsible for unpacking the autorun.zip file on a BrightSign player
' It should be included at the root level inside your autorun.zip package
' 
' When the player boots with an autorun.zip file, this script:
' 1. Extracts all contents from autorun.zip to the root of the storage device
' 2. Renames autorun.zip to prevent re-extraction on subsequent boots
' 3. Reboots the player to run the extracted autorun.brs
'
' Requirements:
' - BrightSignOS 7.0.60 or later
' - autorun.zip must contain this file (autozip.brs) at its root level
' - autorun.zip must NOT contain an autorun.brs at the root level (only inside the zip)
'
' For more information, see: https://docs.brightsign.biz/how-tos/create-install-an-autorunzip

function main()
    print "=== autozip.brs - BrightSign autorun.zip Unpacker ==="
    print "Starting autorun.zip extraction process..."
    
    ' Define paths
    zipPath$ = "SD:/autorun.zip"
    extractPath$ = "SD:/"
    renamedZipPath$ = "SD:/autorun.zip.done"
    
    ' Check if autorun.zip exists
    if not DoesFileExist(zipPath$) then
        print "ERROR: autorun.zip not found at: "; zipPath$
        print "This script should only run when autorun.zip is present."
        return
    end if
    
    ' Check if already extracted (safety check)
    if DoesFileExist(renamedZipPath$) then
        print "WARNING: autorun.zip.done already exists. Extraction may have already occurred."
        print "If you want to re-extract, delete autorun.zip.done first."
        return
    end if
    
    print "Found autorun.zip, beginning extraction..."
    
    ' Extract the zip file
    success = ExtractZipFile(zipPath$, extractPath$)
    
    if success then
        print "Successfully extracted autorun.zip contents to: "; extractPath$
        
        ' Rename the zip file to prevent re-extraction on next boot
        print "Renaming autorun.zip to autorun.zip.done..."
        renameSuccess = RenameFile(zipPath$, renamedZipPath$)
        
        if renameSuccess then
            print "Successfully renamed autorun.zip"
            print "Extraction complete! Rebooting player to run the extracted application..."
            sleep(2000)
            RebootSystem()
        else
            print "ERROR: Failed to rename autorun.zip. Manual intervention may be required."
        end if
    else
        print "ERROR: Failed to extract autorun.zip"
        print "Please verify the zip file is not corrupted and try again."
    end if
end function

' Check if a file exists at the specified path
function DoesFileExist(filePath$ as string) as boolean
    fileInfo = MatchFiles(filePath$, filePath$)
    if fileInfo.Count() > 0 then
        return true
    end if
    return false
end function

' Extract a zip file to the specified destination
function ExtractZipFile(zipPath$ as string, destPath$ as string) as boolean
    print "Extracting: "; zipPath$; " to: "; destPath$
    
    ' Create an roUnzip object
    unzip = CreateObject("roUnzip", zipPath$)
    if unzip = invalid then
        print "ERROR: Failed to create roUnzip object for: "; zipPath$
        return false
    end if
    
    ' Decompress the entire archive to the destination
    result = unzip.DecompressAllFiles(destPath$)
    
    if result <> 0 then
        print "ERROR: DecompressAllFiles failed with error code: "; result
        return false
    end if
    
    print "Extraction successful"
    return true
end function

' Rename a file from oldPath to newPath
function RenameFile(oldPath$ as string, newPath$ as string) as boolean
    print "Renaming: "; oldPath$; " to: "; newPath$
    
    ' Use roFileSystem to rename the file
    fs = CreateObject("roFileSystem")
    if fs = invalid then
        print "ERROR: Failed to create roFileSystem object"
        return false
    end if
    
    success = fs.Rename(oldPath$, newPath$)
    
    if not success then
        print "ERROR: Rename operation failed"
        return false
    end if
    
    return true
end function
