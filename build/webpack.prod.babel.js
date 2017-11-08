import ExtractTextPlugin from "extract-text-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";

import loaders from "./loaders";
import { resolve } from "./utils";
import baseConfig from "./webpack.base.babel";

let prodConfig = Object.assign({}, baseConfig, {
  module: {
    rules: loaders.rules("production")
  }
});

prodConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  },
  comments: false
}));
prodConfig.plugins.push(new HtmlWebpackPlugin({
  inject: false,
  template: resolve("client/index.tpl.html"),
  filename: "index.html",
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
  }
}));
prodConfig.plugins.push(new ExtractTextPlugin("style.css"));

export default prodConfig;
