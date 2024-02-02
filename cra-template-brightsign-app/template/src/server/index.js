const express = require("express");

const path = __dirname + '../public';
const app = express();

app.use(express.json());
app.use(express.static(path));

let latestText = "";

// POST endpoint to receive updates
app.post('/text', (req, res) => {
    if (req === undefined) {
      res.status(400).send("Bad request: no body provided.");
    }
    
    latestText = req.body.text;

    res.status(200).send("done");
});

app.get('/text', (req, res) => {
    res.status(200).send(latestText); 
});

const PORT = 8020;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));