const version = "1.0.0";
let config: Config;

interface Config {
    version: string;
    isDesktop: boolean;
    nodeEnv: string;
    dwsBaseRoute: string;
    dwsPassword: string;
}

const getFromEnv = (): Config => {
    return {
        version,
        isDesktop: process.env.IS_DESKTOP == "true",
        nodeEnv: process.env.NODE_ENV || "development",
        dwsBaseRoute: process.env.DWS_BASE_ROUTE || "http://localhost",
        dwsPassword: process.env.DWS_PASSWORD || "",
    };
};

const parseInteger = (value: any, theDefault: number): number => {
    try {
        const result = parseInt(value, 10);
        if (!isNaN(result)) return result;
    } catch (error) {
        console.error(`Error parsing integer: ${error}`);
    }
    return theDefault;
};

const getConfig = (): Config => {
    if (!config) config = getFromEnv();
    return config;
};

export { getConfig };
