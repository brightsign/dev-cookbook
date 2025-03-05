const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

describe("index.html", () => {
    let dom;
    let document;

    beforeEach(() => {
        const html = fs.readFileSync(
            path.resolve(__dirname, "./index.html"),
            "utf8"
        );
        dom = new JSDOM(html);
        document = dom.window.document;
    });

    it("should have correct document structure", () => {
        // Check title
        const title = document.querySelector("title");
        expect(title.textContent).toBe("html-single-video-decoder-example");

        // Check meta tags
        const metaTags = document.querySelectorAll("meta");
        expect(metaTags.length).toBeGreaterThanOrEqual(3);
        expect(document.querySelector('meta[charset="UTF-8"]')).not.toBeNull();
        expect(document.querySelector('meta[name="viewport"]')).not.toBeNull();
        expect(document.querySelector('meta[http-equiv="X-UA-Compatible"]')).not.toBeNull();
    });

    it("should have proper video container setup", () => {
        // Check container structure
        const container = document.querySelector(".container1");
        expect(container).not.toBeNull();
        expect(container.querySelector(".vid1")).not.toBeNull();

        // Verify exactly one container exists (single video decoder)
        const containers = document.querySelectorAll(".container1");
        expect(containers.length).toBe(1);
    });

    it("should have properly configured video element", () => {
        const video = document.querySelector("#video-player");
        expect(video).not.toBeNull();
        expect(video.hasAttribute("src")).toBe(true);
        expect(video.hasAttribute("preload")).toBe(true);
        expect(video.getAttribute("preload")).toBe("auto");
        expect(video.hasAttribute("muted")).toBe(true);
    });

    it("should have correct script and style references", () => {
        const styleLink = document.querySelector('link[rel="stylesheet"]');
        expect(styleLink).not.toBeNull();
        expect(styleLink.getAttribute("href")).toBe("styles.css");

        const script = document.querySelector('script[type="text/javascript"]');
        expect(script).not.toBeNull();
        expect(script.getAttribute("src")).toBe("./dist/bundle.js");
    });

    it("should maintain correct container hierarchy", () => {
        const container = document.querySelector(".container1");
        const videoContainer = container.querySelector(".vid1");
        
        // Verify video element is properly nested
        expect(videoContainer.querySelector("#video-player")).not.toBeNull();
    });
});
