import ExtractTextPlugin from "extract-text-webpack-plugin";
import RemcalcPlugin from "less-plugin-remcalc";
import { resolve } from "./utils";

const lessPlugins = {
    plugins: [ RemcalcPlugin ]
};

export default {
  rules (env = "development") {
    let loaders = [
      this.js(env),
      this.less(env),
      this.scss(env)
    ];

    if (env === "development") {
      loaders.push(this.eslint(env));
    }

    return loaders;
  },

  eslint () {
    return {
      test: /\.js$/,
      loader: "eslint-loader",
      enforce: 'pre',
      include: [
        resolve('src'),
        resolve('test')
      ],
      options: {
        formatter: require('eslint-friendly-formatter')
      }
    }
  },

  js (env = "development") {
    return {
      test: /\.js$/,
      loader: "babel-loader",
      include: [
        resolve("client")
      ]
    };
  },

  less (env = "development") {
    if (env === "production") {
      return {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader",
            "resolve-url-loader",
            {
              loader: "less-loader",
              options: {
                plugins: lessPlugins
              }
            }
          ]
        })
      }
    } else {
      return {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }, {
            loader: "less-loader",
            options: {
              sourceMap: true,
              plugins: lessPlugins
            }
          }
        ]
      }
    }
  },

  scss (env = "development") {
    if (env === "production") {
      return {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader",
            "resolve-url-loader",
            "sass-loader"
          ]
        })
      }
    } else {
      return {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }, {
            loader: "less-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }
    }
  }
}
