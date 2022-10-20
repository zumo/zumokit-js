const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const envFileName = `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''
  }`;
require('dotenv').config({ path: path.resolve(process.cwd(), envFileName) });

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.TRANSACTION_SERVICE_URL': JSON.stringify(process.env.TRANSACTION_SERVICE_URL),
      'process.env.CARD_SERVICE_URL': JSON.stringify(process.env.CARD_SERVICE_URL),
      'process.env.NOTIFICATION_SERVICE_URL': JSON.stringify(process.env.NOTIFICATION_SERVICE_URL),
      'process.env.EXCHANGE_SERVICE_URL': JSON.stringify(process.env.EXCHANGE_SERVICE_URL),
      'process.env.USER_TOKEN': JSON.stringify(process.env.USER_TOKEN),
      'process.env.USER_WALLET_PASSWORD': JSON.stringify(
        process.env.USER_WALLET_PASSWORD
      ),
    }),
  ],
};
