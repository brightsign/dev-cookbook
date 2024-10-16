const express = require("express");

// Path: `__dirname` on player == /storage/sd/dist
const path = __dirname;
const app = express();

app.use(express.json());
app.use(express.static(path));
app.use(function (req, res, next) {
    console.log("Testing", req.url);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

let text = "This is example text.";

// POST endpoint to receive updates
app.post("/text", (req, res) => {
    if (req === undefined) {
        res.status(400).send("Bad request: no body provided.");
    }

    text = req.body.text;

    res.status(200).send("done");
});

app.get("/text", (req, res) => {
    res.status(200).json({ text });
});

const PORT = 8020;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
