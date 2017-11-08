import ModuleBCtrl from "./module-b.controller.js";

angular.module("managerApp")
    .config($stateProvider => {
        $stateProvider.state("moduleb", {
            url: "/b",
            template: `<div>
                    <span>{{ModuleBCtrl.name}}</span>
                </div>`,
            controller: ModuleBCtrl,
            controllerAs: "ModuleBCtrl"
        });
    })
