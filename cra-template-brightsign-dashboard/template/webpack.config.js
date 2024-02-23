const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    frontend: './src/index',
    backend: './src/server/index',
  },
  target: 'node',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: isProduction ? 'production' : 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
              presets: ["@babel/preset-react"],
          }
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: ({ request }, callback) => {
    if (/^@brightsign\//.test(request)) {
      return callback(null, 'commonjs ' + request);
    }
    callback();
  },
  devtool: isProduction ? 'source-map' : 'eval-source-map',
};
