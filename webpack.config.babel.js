import CopyWebpackPlugin from "copy-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path"

const dist = "dist/webpack";

function resolve (dir) {
  return path.join(__dirname, dir)
}

export default {
  entry: {
    app: [
      "./client/index.js"
    ],
    vendor: [
      "./client/vendor.js"
    ]
  },
  output: {
    path: resolve(dist),
    filename: "app/[name].js",
    publicPath: "/"
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
            // "resolve-url-loader",
            "sass-loader"
          ]
        })
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader",
            // "resolve-url-loader",
            "less-loader"
          ]
        })
      }
    ]
  },
  resolve: {
    extensions: [".js"],
    modules: [
      resolve("src"),
      resolve("node_modules")
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
    new HtmlWebpackPlugin(),
    new ExtractTextPlugin("style.css")
  ]
}
