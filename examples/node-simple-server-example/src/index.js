import app from "./app.js";

app().catch((err) => {
    console.error(`Error running server: ${err}`);
});
