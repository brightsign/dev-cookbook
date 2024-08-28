// Import the 'http' module, which provides the ability to create an HTTP server in Node.js
const http = require('http');
// Define the port the server will listen on
const port = 3000;
// Define the hostname as '0.0.0.0', which means the server will bind to all available network interfaces
const hostname = '0.0.0.0';

// Create the HTTP server
// The callback function handles incoming HTTP requests
const server = http.createServer((req, res) => {
  // Check if the request method is 'GET' and the requested URL is '/'
  if (req.method === 'GET' && req.url === '/') {
    // Set the response status code to 200, which means the request was successful
    res.statusCode = 200;
    // Set the response header to indicate that the content is plain text
    res.setHeader('Content-Type', 'text/plain');
    // Send the response body with a congratulatory message
    res.end('Congratulations on interacting with your BrightSign running a simple node http application!');
  
  } else {
    // If the request is not a GET to '/', send a 404 Not Found response
    res.statusCode = 404;
    // Set the response header to indicate that the content is plain text
    res.setHeader('Content-Type', 'text/plain');
    // Send a '404 Not Found' message as the response body
    res.end('404 Not Found');
  }
});

// Start the server and listen on the specified port and hostname
// The callback function logs a message to the console when the server starts successfully
server.listen(port, hostname, () => {
  // Log a message to indicate that the server setup was successful
  console.log('Congratulations on setting up a simple node http application with your BrightSign!');
  // Log the URL where the server is accessible
  console.log(`Server is running at http://${hostname}:${port}`);
});
