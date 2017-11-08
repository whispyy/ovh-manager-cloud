import CopyWebpackPlugin from "copy-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import RemcalcPlugin from "less-plugin-remcalc";
import path from "path";
import webpack from "webpack";

import { resolve } from "./utils";

const dist = "dist/webpack";

export default {
  entry: {
    // vendor: [
    //   "./client/vendor.js"
    // ],
    app: [
      "./client/index.js",
      "./client/app/app.less",
      "./client/app/app.scss"
    ],
    vendor: [
      // ProvidePlugin
      // "jquery",
      "angular",
      "ovh-ui-angular",
      "angular-animate",
      "angular-ui-bootstrap",
      "angular-cookies",
      "angular-dynamic-locale",
      // "angular-i18n",
      "angular-messages",
      "angular-moment",
      "angular-resource",
      "angular-sanitize",
      "angular-strap",
      "angular-translate",
      "angular-translate-loader-partial",
      "angular-ui-router",
      "angular-ui-sortable",
      "angular-ui-validate",
      // "animate.css";
      // "bootstrap";
      // "bootstrap-additions";
      // "bs4",
      "d3",
      "es5-shim",
      // "flag-icon-css";
      // "font-awesome",
      "jquery.cookie",
      "jquery.scrollto",
      "json3",
      "lodash",
      "matchmedia-ng",

      // ProvidePlugin
      // "moment";,
      "ng-slide-down",
      "urijs",

      // ProvidePlugin
      // "validator";

      // "ovh-ui-kit",
      "ovh-angular-a-disabled",
      "ng-at-internet",
      "at-internet-ui-router-plugin",
      "ovh-angular-toggleclass",
      "ovh-jquery-ui-draggable-ng",

      // FIXME: bad main entr,
      "ovh-angular-sidebar-menu/dist/ovh-angular-sidebar-menu.js",
      "ovh-angular-jquery-ui-droppable",
      "ovh-angular-manager-navbar",
      "ovh-angular-actions-menu",
      "ovh-angular-responsive-popover",
      "ovh-angular-jsplumb",
      "ovh-angular-checkbox-table",
      "ovh-common-style",
      // "ovh-manager-webfont",
      "ovh-angular-form-flat/dist/ovh-angular-form-flat.js",
      "ovh-angular-q-allsettled",
      "ovh-angular-slider",
      "ovh-angular-stop-event",
      "ovh-angular-user-pref",
      "ovh-angular-toaster",
      "ovh-angular-browser-alert",
      "ovh-angular-pagination-front",
      "ovh-angular-responsive-page-switcher",
      "ovh-angular-responsive-tabs",
      "ovh-angular-sso-auth",
      "ovh-angular-sso-auth-modal-plugin",
      "ovh-angular-swimming-poll",
      "ovh-angular-doc-url",
      "ovh-angular-module-status",
      "ovh-angular-otrs",
      "ovh-api-services",
      "angular-chart.js",
      "ovh-angular-list-view",
      "jsurl",
      "moment-duration-format",

      // Dependencies
      "messenger/build/js/messenger.js",
      "ovh-angular-proxy-request"
    ]
  },
  output: {
    path: resolve(dist),
    filename: "[name].[hash].js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".less"],
    modules: [
      resolve("client"),
      resolve("node_modules")
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    }),
    new webpack.ProvidePlugin({
      moment: "moment",
      validator: "validator",
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
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
    ])
  ]
}
