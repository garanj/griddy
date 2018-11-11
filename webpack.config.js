const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StringReplacePlugin = require("string-replace-webpack-plugin");

const devMode = process.env.NODE_ENV !== 'production';


module.exports = env => {
  checkEnvironment();
  return {
    entry: "./src/js/app.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js"
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            "babel-loader",
            "eslint-loader"
          ],
          include: __dirname + '/src/js',
          exclude: /(node_modules)/
        },{
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader"
          ]
        },{
          test: /\.js$/,
          loader: 'string-replace-loader',
          options: {
            multiple: [
               { 
                 search: 'GRIDDY_CLIENT_ID',
                 replace: process.env.GRIDDY_CLIENT_ID
               },
               { 
                 search: 'GRIDDY_API_KEY',
                 replace: process.env.GRIDDY_API_KEY
               }
            ]
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Griddy',
        template: 'index_template.html'
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ],
    mode : devMode ? 'development' : 'production'
  };
};

function checkEnvironment() {
  if (!process.env.GRIDDY_CLIENT_ID || !process.env.GRIDDY_API_KEY) {
    throw Error('Error: GRIDDY_CLIENT_ID and GRIDDY_API_KEY must be exported ' +
        'sas environment variables.');
  }
}