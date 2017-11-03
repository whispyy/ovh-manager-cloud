const appContext = require.context('./app', true, /\.js$/);
appContext.keys().forEach(appContext);

const componentsContext = require.context('./components', true, /\.js$/);
componentsContext.keys().forEach(componentsContext);

import "./constants";

import "./styles";
