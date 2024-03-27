const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    entry: "./src/index",
    target: "node",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    mode: isProduction ? "production" : "development",
    plugins: [],
    module: {
        rules: [
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    externals: ({ request }, callback) => {
        if (/^@brightsign\//.test(request)) {
            return callback(null, "commonjs " + request);
        }
        callback();
    },
    devtool: isProduction ? "source-map" : "eval-source-map",
};
