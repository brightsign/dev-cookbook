# BrightSign SQLite Database Example

This example demonstrates how to use SQLite database functionality in a BrightSign application, showing the communication between BrightScript and JavaScript for database operations.

## Overview

The example showcases:
- Creating a SQLite database
- Creating tables with SQL commands
- Inserting records into the database
- Querying records from the database
- Deleting records from the database
- Proper database cleanup and connection management

## Files

- `autorun.brs` - BrightScript application that handles database operations
- `index.js` - JavaScript application that sends SQL commands via MessagePort

## How It Works

1. **Initialization**: The BrightScript application (`autorun.brs`) starts and creates a Node.js instance running `index.js`
2. **Database Creation**: When the JavaScript app signals it's ready, BrightScript creates a SQLite database at `SD:/example.db`
3. **Table Creation**: JavaScript sends a command to create a `users` table with columns for ID, name, and age
4. **Data Insertion**: Sample user records are inserted into the database
5. **Data Retrieval**: All records are queried from the database
6. **Data Deletion**: Each retrieved record is deleted from the database
7. **Cleanup**: The database connection is properly closed when the application exits

## Database Schema

The example creates a simple `users` table:

```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER
);
```

## Sample Data

The example inserts the following sample records:
- Alice, age 25
- Bob, age 30
- Charlie, age 35

## Key Features

### BrightScript Side (`autorun.brs`)
- **Database Management**: Creates and manages SQLite database connection
- **SQL Statement Execution**: Handles CREATE, INSERT, SELECT, and DELETE operations
- **Result Processing**: Processes query results and formats them for JavaScript consumption
- **Error Handling**: Includes error checking for database operations
- **Resource Cleanup**: Properly closes database connections on exit

### JavaScript Side (`index.js`)
- **MessagePort Communication**: Uses `@brightsign/messageport` for BrightScript communication
- **Command Orchestration**: Sends SQL commands in logical sequence
- **Data Processing**: Parses and processes database results
- **Event-Driven Architecture**: Responds to database operation completion events

## Running the Example

1. Copy the `autorun.brs` and `index.js` files to the root of your BrightSign player's SD card
2. Power on or restart your BrightSign player
3. The application will automatically start and demonstrate the database operations
4. Check the device logs to see the SQL operations being performed

## Expected Output

The application will log information about each database operation:
- Database creation confirmation
- Table creation success
- Record insertion confirmations
- Retrieved records display
- Record deletion confirmations

## Notes

- The database file is created at `SD:/example.db`
- The application demonstrates a complete CRUD (Create, Read, Update, Delete) cycle
- Error handling is included for robust database operations
- The database connection is automatically closed when the Nodejs application exits
- Results from SELECT queries are formatted as JSON strings for JavaScript processing

This example serves as a foundation for building more complex database-driven BrightSign applications.