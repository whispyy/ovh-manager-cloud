import ModuleACtrl from "./module-a.controller.js";

angular.module("managerApp")
    .config($stateProvider => {
        $stateProvider.state("modulea", {
            url: "/a",
            template: `<div>
                    <span>{{ModuleACtrl.name}}</span>
                </div>`,
            controller: ModuleACtrl,
            controllerAs: "ModuleACtrl"
        });
    })
