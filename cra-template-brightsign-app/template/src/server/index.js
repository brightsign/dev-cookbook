const express = require("express");

const path = __dirname + '../public';
const app = express();

app.use(express.static(path));