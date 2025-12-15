' autorun.brs - BrightScript example for SQLite DB usage
' This script demonstrates creating a DB, inserting, reading, 
' deleting records, and closing the DB.

Sub Main()
    port = CreateObject("roMessagePort")
    m.nodejs = CreateObject("roNodeJs", "SD:/index.js", { message_port: port })

    dbPath$ = "SD:/example.db"

    ' Event Loop
    while true
        ev = wait(0, port)
        ' print "=== BS: Received event ";type(ev)
        if type(ev) = "roNodeJsEvent" then
            eventData = ev.GetData()
            if type(eventData) = "roAssociativeArray" and type(eventData.reason) = "roString" then
                if eventData.reason = "process_exit" then
                    print "=== BS: Node.js instance exited with code " ; eventData.exit_code
                    if m.db <> invalid then
                        m.db.Close()
                        print "Database closed."
                    end if
                    
                else if eventData.reason = "message" then
                    print "=== BS: Received message from JS app: "; eventData.message

                    if type(eventData.message) = "roAssociativeArray" then
                        if eventData.message.action = "ready" then
                            print "=== index.js loaded: "; eventData.message.message
                            
                            ' Create the SQLite database
                            m.db = CreateObject("roSqliteDatabase")
                            m.db.SetPort(port)
                            if m.db.Create(dbPath$) then
                                m.nodejs.PostJSMessage({ action: "dbCreated", path: dbPath$ })
                            else
                                print "Failed to create database. Exiting."
                                stop
                            end if
                        else if eventData.message.action = "create" then
                            createOk = CreateTable(eventData.message.command)
                            if not createOk then
                                print "Failed to create table: "; eventData.message.command
                                stop
                            end if
                        else if eventData.message.action = "insert" then
                            insertOk = InsertRecords(eventData.message.command)
                            if not insertOk then
                                print "Failed to insert record: "; eventData.message.command
                                stop
                            end if
                        else if eventData.message.action = "select" then
                            records = SelectRecords(eventData.message.command)
                            if records = invalid then
                                print "Failed to retrieve records: "; eventData.message.command
                                stop
                            end if
                        else if eventData.message.action = "delete" then
                            deleteOk = DeleteRecord(eventData.message.command)
                            if not deleteOk then
                                print "Failed to delete record: "; eventData.message.command
                                stop
                            end if
                        else
                            print "=== BS: Unknown action: "; eventData.message.action
                        end if
                    else
                        print "=== BS: Unknown message type: "; type(eventData.message)
                    end if
                else
                    print "======= UNHANDLED NODEJS EVENT ========="
                    print eventData.reason
                endif
            else
                print "=== BS: Unknown eventData: "; type(eventData)
            endif
        endif
    end while
end Sub

Function CreateTable(createSQL as string) as boolean
    stmt = m.db.CreateStatement(createSQL)
    if type(stmt) = "roSqliteStatement" then
        result = stmt.Run()
        if result <> 100 then
            print "Failed to create table."
            return false
        end if
        m.nodejs.PostJSMessage({ action: "create", command: createSQL })
        stmt.Finalise()
        return true
    else
        return false
    end if
end Function

Function InsertRecords(insertSQL as string) as boolean
    insertStmt = m.db.CreateStatement(insertSQL)
    if type(insertStmt) = "roSqliteStatement" then
        result = insertStmt.Run()
        if result <> 100 then
            print "Failed to insert record"
            return false
        end if
        m.nodejs.PostJSMessage({ action: "insert", command: insertSQL })
        insertStmt.Finalise()
        return true
    else
        return false
    end if
end Function

Function SelectRecords(selectSQL as string) as dynamic
    stmt = m.db.CreateStatement(selectSQL)
    if type(stmt) = "roSqliteStatement" then
        sqlResult = stmt.Run()
        records = []
        while sqlResult = 102
            resultsData = stmt.GetData()
            records.push(resultsData)
            sqlResult = stmt.Run()
        end while

        ' Stringify the records array since the roAssociativeArray sent
        ' as input to PostJSMessage() cannot contain an roArray type.
        resultAsString = FormatJson(records)
        m.nodejs.PostJSMessage({ action: "select", command: selectSQL, result: resultAsString })
        stmt.Finalise()
        return records
    else
        return invalid
    end if
end Function

Function DeleteRecord(deleteSQL as string) as boolean
    deleteStmt = m.db.CreateStatement(deleteSQL)
    if type(deleteStmt) = "roSqliteStatement" then
        result = deleteStmt.Run()
        m.nodejs.PostJSMessage({ action: "delete", command: deleteSQL })
        deleteStmt.Finalise()
        return true
    else
        return false
    end if
end Function