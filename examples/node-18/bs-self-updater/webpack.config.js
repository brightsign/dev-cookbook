const path = require("path");

module.exports = {
    entry: "./index.ts",
    target: "node",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
    },
    mode: "development",
    devtool: false,
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
            },
        ],
    },
    externals: {
        "@brightsign/system": "commonjs @brightsign/system",
    },
};
