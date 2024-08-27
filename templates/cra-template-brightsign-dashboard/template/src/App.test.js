import React from "react";
import "@testing-library/jest-dom";
import { render, screen, act, waitFor } from "@testing-library/react";
import App from "./App";

const DeviceInfo = require("@brightsign/deviceinfo");

describe("Device Info Mock", () => {
    it("should return mocked device info", () => {
        const deviceInfo = new DeviceInfo();

        expect(deviceInfo.model).toBe("MockModel");
        expect(deviceInfo.osVersion).toBe("MockOSVersion");
        expect(deviceInfo.serialNumber).toBe("MockSerialNumber");
    });
});

test("renders expected dashboard properties text", async () => {
    await act(async () => {
        render(<App />);
    });

    const linkElement = screen.getByText(/MockOSVersion/i);
    expect(linkElement).toBeInTheDocument();

   const mockMonitorElement = await screen.findByText((content, element) => content.includes('mockMonitor'));
   const resolutionElement = await screen.findByText((content, element) => content.includes('1080x1920@60hz'));
   const sizeElement = await screen.findByText((content, element) => content.includes('1000b'));

   expect(mockMonitorElement).toBeInTheDocument();
   expect(resolutionElement).toBeInTheDocument();
   expect(sizeElement).toBeInTheDocument();
});
