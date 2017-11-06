import ExtractTextPlugin from "extract-text-webpack-plugin";
import webpack from "webpack";

import loaders from "./loaders";
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
}))
prodConfig.plugins.push(new ExtractTextPlugin('style.[hash:8].css'))
