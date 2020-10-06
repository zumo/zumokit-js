const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

const envFileName = '.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '');
require('dotenv').config({ path: path.resolve(process.cwd(), envFileName) });

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html")
    }),
    new webpack.DefinePlugin({
      "process.env.API_KEY": JSON.stringify(process.env.API_KEY),
      "process.env.API_URL": JSON.stringify(process.env.API_URL),
      "process.env.TX_SERVICE_URL": JSON.stringify(process.env.TX_SERVICE_URL),
      "process.env.CLIENT_ZUMOKIT_AUTH_ENDPOINT": JSON.stringify(process.env.CLIENT_ZUMOKIT_AUTH_ENDPOINT),
      "process.env.CLIENT_HEADERS": process.env.CLIENT_HEADERS,
      "process.env.USER_WALLET_PASSWORD": JSON.stringify(process.env.USER_WALLET_PASSWORD)
    })
  ]
};