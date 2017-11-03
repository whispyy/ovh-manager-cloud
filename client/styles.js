import "./app/app.less";
import "./app/app.scss";

const lessAppContext = require.context('./app', true, /\.less$/);
lessAppContext.keys().forEach(lessAppContext);
