import CloudMainController from "./cloud-main.controller";

angular.module("managerApp", [
        "ui.router"
    ])
    .config(($urlRouterProvider, $locationProvider) => {
        $urlRouterProvider.otherwise("/");
        $locationProvider.html5Mode(false);
    })
    .controller("CloudMainController", CloudMainController);

require("./main/main");
require("./module-a/a");
require("./module-b/b");
