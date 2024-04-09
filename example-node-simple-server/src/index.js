import app from "./app";

app().catch((err) => {
    console.error("Error running server" + err);
});
