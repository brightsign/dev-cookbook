const express = require('express');
const app = express();
const port = 3000;

// Define a simple route
app.get('/', (req, res) => {
  res.send('Congratulations on setting up a simple node express application with your BrightSign!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
