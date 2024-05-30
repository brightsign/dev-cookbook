const version = "1.0.0";
let config;

const getFromEnv = () => {
    return {
        version,
        isDesktop: process.env.IS_DESKTOP == "true",
        nodeEnv: process.env.NODE_ENV || "development",
        dwsBaseRoute: process.env.DWS_BASE_ROUTE || "http://localhost",
        dwsPassword: process.env.DWS_PASSWORD || "",
    };
};

const parseInteger = (value, theDefault) => {
    try {
        const result = parseInt(value, 10);
        if (!isNaN(result)) return result;
    } catch (error) {
        console.error(`Error parsing integer: ${error}`);
    }
    return theDefault;
};

const getConfig = () => {
    if (!config) config = getFromEnv();
    return config;
};

export { getConfig };
