import webpack from 'webpack';
import webpackConfig from './webpack.dev.babel';

import app from '../server/index';

function injectWebpackMiddleware (app) {
  // default port where dev server listens for incoming traffic
  const port = process.env.PORT || 2000;
  // automatically open browser, if not set will be false
  let autoOpenBrowser = true;

  const compiler = webpack(webpackConfig);

  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
  });

  const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {}
  });

  // force page reload when html-webpack-plugin template changes
  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
      hotMiddleware.publish({ action: 'reload' });
      cb();
    });
  });

  // handle fallback for HTML5 history API
  // app.use(require('connect-history-api-fallback')())

  // serve webpack bundle output
  app.use(devMiddleware);

  // enable hot-reload and state-preserving
  // compilation error display
  app.use(hotMiddleware);

  devMiddleware.waitUntilValid(() => {
    console.log('> Listening at localhost:9000\n')
  });

  return app
}

module.exports = {
  injectWebpackMiddleware
};
