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

    await waitFor(() => {
        expect(screen.getByText(/mockMonitor/i)).toBeInTheDocument();
        expect(screen.getByText(/1080x1920@60hz/i)).toBeInTheDocument();
        expect(screen.getByText(/1000b/i)).toBeInTheDocument();
    });
});
