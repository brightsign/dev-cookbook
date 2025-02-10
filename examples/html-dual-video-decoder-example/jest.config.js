const config = {
    verbose: true,
    testRegex: "(test|spec)\\.[jt]sx?$",
    transform: {
        "^.+\\.[jt]sx?$": "babel-jest"
    },
    transformIgnorePatterns: [
        "/node_modules/(?!(jsdom)/)"
    ]
};

module.exports = config;