const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true, // Enable caching for faster rebuilds
                        presets: ['@babel/preset-env'],
                    },
                }
            },
        ],
    },
    externals: {
        '@brightsign/deviceinfo': 'commonjs @brightsign/deviceinfo',
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'sh/bsext_init', to: '.' }
            ]
        })
    ]
};