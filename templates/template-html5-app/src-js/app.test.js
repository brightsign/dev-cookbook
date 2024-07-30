const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

describe("index.html", () => {
    it("should display", () => {
        const html = fs.readFileSync(
            path.resolve(__dirname, "./index.html"),
            "utf8"
        );
        const dom = new JSDOM(html);
        const { document } = dom.window;

        // Check that the document has a <title> element
        const title = document.querySelector("title");
        expect(title).not.toBeNull();
    });
});
