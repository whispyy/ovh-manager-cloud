import MainCtrl from "./main.controller.js";

angular.module("managerApp")
    .config($stateProvider => {
        $stateProvider.state("main", {
            url: "/",
            template: `<div>
                    <span>{{MainCtrl.name}}</span>
                    <ul>
                        <li><a ui-sref="modulea">a</li>
                        <li><a ui-sref="moduleb">b</li>
                    </ul>
                </div>`,
            controller: MainCtrl,
            controllerAs: "MainCtrl"
        });
    });
