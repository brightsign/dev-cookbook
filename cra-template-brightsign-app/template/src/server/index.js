const express = require("express");

const path = __dirname + '../public';
const app = express();

app.use(express.static(path));

let latestText = "";

// POST endpoint to receive updates
app.post('/text', (req, res) => {
    latestText = req.body.text;

    res.status(200).send("done");
});

app.get('/text', (req, res) => {
    res.status(200).send(latestText); 
});

const PORT = 80;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));