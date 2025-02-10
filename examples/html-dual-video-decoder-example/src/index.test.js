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
        expect(title.textContent).toBe("html-dual-video-decoder-example");

        // Check meta tags
        const metaTags = document.querySelectorAll("meta");
        expect(metaTags.length).toBeGreaterThanOrEqual(3);
        expect(document.querySelector('meta[charset="UTF-8"]')).not.toBeNull();
        expect(document.querySelector('meta[name="viewport"]')).not.toBeNull();
    });

    it("should have proper dual video container setup", () => {
        // Check both containers exist
        const container1 = document.querySelector(".container1");
        const container2 = document.querySelector(".container2");
        expect(container1).not.toBeNull();
        expect(container2).not.toBeNull();

        // Check inner video containers
        expect(container1.querySelector(".vid1")).not.toBeNull();
        expect(container2.querySelector(".vid2")).not.toBeNull();

        // Verify exactly two containers exist
        const containers = document.querySelectorAll(".container1, .container2");
        expect(containers.length).toBe(2);
    });

    it("should have properly configured video elements", () => {
        const videos = document.querySelectorAll("video");
        expect(videos.length).toBe(2);

        // Check first video
        const video1 = document.querySelector(".container1 video");
        expect(video1).not.toBeNull();
        expect(video1.hasAttribute("src")).toBe(true);
        expect(video1.getAttribute("src")).toBe("../assets/Text_1_small.mov");
        expect(video1.hasAttribute("preload")).toBe(true);
        expect(video1.getAttribute("preload")).toBe("auto");
        expect(video1.hasAttribute("muted")).toBe(true);

        // Check second video
        const video2 = document.querySelector(".container2 video");
        expect(video2).not.toBeNull();
        expect(video2.hasAttribute("src")).toBe(true);
        expect(video2.getAttribute("src")).toBe("../assets/Text_2_small.mov");
        expect(video2.hasAttribute("preload")).toBe(true);
        expect(video2.getAttribute("preload")).toBe("auto");
        expect(video2.hasAttribute("muted")).toBe(true);
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
        // Check container nesting
        const container1 = document.querySelector(".container1");
        const container2 = document.querySelector(".container2");
        
        // Verify containers are siblings
        expect(container1.parentNode).toBe(container2.parentNode);
        
        // Verify video elements are properly nested
        expect(container1.querySelector(".vid1 video")).not.toBeNull();
        expect(container2.querySelector(".vid2 video")).not.toBeNull();
    });
});