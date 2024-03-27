import React from "react";
import "@testing-library/jest-dom";
import { render, screen, act, waitFor } from "@testing-library/react";

import App from "./App";

describe("Device Info Mock", () => {
    it("should return mocked device info", () => {
        const DeviceInfo = require("@brightsign/deviceinfo");
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

    let linkElement = screen.getByText(/MockOSVersion/i);
    expect(linkElement).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByText(/jestMonitor/i)).toBeInTheDocument();
        expect(screen.getByText(/1080x1920@60hz/i)).toBeInTheDocument();
        expect(screen.getByText(/1000b/i)).toBeInTheDocument();
    });
});
