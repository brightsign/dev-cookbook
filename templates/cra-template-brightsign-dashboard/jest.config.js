const config = {
    verbose: true,
    preset: "../../node_modules/@babel/preset-react",
    testRegex: "(test|spec)\\.[jt]sx?$",
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
        ".+\\.(css|styl|less|sass|scss)$": "jest-transform-css",
    },
    testEnvironment: "jsdom",
};

module.exports = config;
