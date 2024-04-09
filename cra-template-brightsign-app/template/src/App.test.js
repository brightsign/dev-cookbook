import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
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

test("renders expected body text", () => {
    render(<App />);
    const linkElement = screen.getByText(/MockOSVersion/i);
    expect(linkElement).toBeInTheDocument();
});
