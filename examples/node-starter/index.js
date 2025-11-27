const http = require('http');
const port = 3000;
// Define the hostname as '0.0.0.0', which means the server will bind to all available network interfaces
const hostname = '0.0.0.0';

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Check if the request method is 'GET' and the requested URL is '/'
  if (req.method === 'GET' && req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    // Send the response body with a congratulatory message
    res.end('Congratulations on interacting with your BrightSign running a simple node http application!');
  
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Route not found. Try a GET request to /');
  }
});

// The callback function logs a message to the console when the server starts successfully
server.listen(port, hostname, () => {
  // Log a message to indicate that the server setup was successful
  console.log('Congratulations on setting up a simple node http application with your BrightSign!');
  console.log(`Server is running at http://${hostname}:${port}`);
});
