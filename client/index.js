const appContext = require.context('./app', true, /(?!spec)\.js$/);
appContext.keys().forEach(appContext);

const componentsContext = require.context('./components', true, /(?!spec)\.js$/);
componentsContext.keys().forEach(componentsContext);

// import "./styles";
