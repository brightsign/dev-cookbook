import http, { IncomingMessage, ServerResponse } from "http";
import diClass from "@brightsign/deviceinfo";

function main() {
    const di = new diClass();

    const server = http.createServer(
        (req: IncomingMessage, res: ServerResponse) => {
            // Set the response header with the appropriate content type for JSON
            res.setHeader("Content-Type", "application/json");

            // Convert the object to a JSON-formatted string
            const jsonResponse: string = JSON.stringify(di);

            // Send the JSON response
            res.end(jsonResponse);
        }
    );

    const port = 13131;
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

main();
