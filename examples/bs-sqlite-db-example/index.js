// index.js - BrightSign JavaScript app to receive messages from BrightScript via MessagePort

var MESSAGE_PORT = require("@brightsign/messageport");
var bsMessage = new MESSAGE_PORT();

if (bsMessage) {
    bsMessage.addEventListener('bsmessage', function(msg) {
        if (msg && typeof msg === 'object') {
            switch(msg.action) {
                case 'dbCreated': {
                    console.log('Database created at:', msg.path);
                    bsMessage.PostBSMessage({
                        action: 'create',
                        command: "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER);"
                    });
                    break;
                }
                case 'create': {
                    console.log('Created table:', msg);
                    bsMessage.PostBSMessage({
                        action: 'insert',
                        command:  "INSERT INTO users (name, age) VALUES ('Alice', 25), ('Bob', 30), ('Charlie', 35);"
                    });
                    break;
                }
                case 'insert': {
                    console.log('Inserted record:', msg);
                    bsMessage.PostBSMessage({
                        action: 'select',
                        command: "SELECT id, name, age FROM users;"
                    });
                    break;
                }
                case 'select': {
                    console.log('Retrieved records:', msg);
                    if (typeof msg.result === 'string') {
                        msg.result = JSON.parse(msg.result);
                    }
                    if (Array.isArray(msg.result) && msg.result.length > 0) {
                        for (const record of msg.result) {
                            bsMessage.PostBSMessage({
                                action: 'delete',
                                command: `DELETE FROM users WHERE id = ${record.id};`
                            });
                        }
                    }
                    break;
                }
                case 'delete': {
                    console.log('Deleted record:', msg);
                    break;
                }
                default: {
                    console.log('Unknown message type:', msg);
                    break;
                }
            }
        } else {
            console.log('Received non-object message:', msg);
        }
    });

    // Send an initial message to indicate the JS app has started.
    // This will be received by the BrightScript side
    // which will then create the database.
    bsMessage.PostBSMessage({
        action: 'ready',
        message: 'SQLite DB Example app has started.'
    });

    // Uncomment the line below to keep the JS app running indefinitely.
    // setInterval(function(){}, 10000);

} else {
    console.log('@brightsign/messageport API not available.');
}
