const appContext = require.context("./app", true, /(?!spec)\.js$/);
appContext.keys()
    .filter(file => !file.endsWith(".spec.js"))
    .forEach(file => {
        appContext(file);
    });

const componentsContext = require.context("./components", true, /(?!spec)\.js$/);
componentsContext.keys()
    .filter(file => !file.endsWith(".spec.js"))
    .forEach(file => {
        componentsContext(file);
    });

// import "./styles";
