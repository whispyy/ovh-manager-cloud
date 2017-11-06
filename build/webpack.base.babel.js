import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import RemcalcPlugin from "less-plugin-remcalc";
import path from "path"

import { resolve } from "./utils";

const dist = "dist/webpack";

export default {
  entry: {
    app: [
      "./client/index.js",
      "./client/app/app.less",
      "./client/app/app.scss"
    ],
    vendor: [
      "./client/vendor.js"
    ]
  },
  output: {
    path: resolve(dist),
    filename: "[name].js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".less"],
    modules: [
      resolve("client"),
      resolve("node_modules")
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [
          resolve("client")
        ]
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader",
            "resolve-url-loader",
            "sass-loader"
          ]
        })
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader",
            "resolve-url-loader",
            {
              loader: "less-loader",
              options: {
                plugins: [ RemcalcPlugin ]
              }
            }
          ]
        })
      }, {
        test: /\.(woff2?|ttf|eot|otf|svg|png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              outputPath: "assets/",
              publicPath: "assets/",
              name: '[sha512:hash:base64:8].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        context: resolve("client"),
        from: `*.{ico,png,txt}`,
        to: resolve(dist)
      }, {
        context: resolve("client"),
        from: `{app,components}/**/*.{html,json}`,
        to: resolve(dist)
      }, {
        context: resolve("client"),
        from: `assets/images/{,*/}*.{webp}`,
        to: resolve(dist)
      }, {
        context: resolve("client"),
        from: `assets/fonts/**/*`,
        to: resolve(dist)
      }, {
        context: resolve("node_modules"),
        from: `**/*.{ttf,woff,woff2,svg,eot}`,
        to: path.join(resolve(dist), "assets")
      }, {
        context: resolve("node_modules"),
        from: `**/translations/*.json`,
        to: path.join(resolve(dist), "i18n")
      }, {
        context: resolve("node_modules"),
        from: `angular-i18n/angular-locale_*-*.js`,
        to: path.join(resolve(dist), "i18n")
      }
    ]),
    new HtmlWebpackPlugin()
  ]
}
