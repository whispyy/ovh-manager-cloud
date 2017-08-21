angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("dbaas.cloud-db.detail.advanced-parameter", {
            url: "/advanced-parameter",
            views: {
                cloudDbHeader: {
                    templateUrl: "app/dbaas/cloud-db/header/cloud-db-dashboard-header.html",
                    controller: "CloudDbDashboardHeaderCtrl",
                    controllerAs: "$ctrl"
                },
                cloudDbContent: {
                    template: '<div ui-view="cloudDbAdvancedParameter"><div>'
                }
            },
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/advanced-parameter"]
        })
        .state("dbaas.cloud-db.detail.advanced-parameter.update", {
            url: "/update",
            views: {
                cloudDbAdvancedParameter: {
                    templateUrl: "app/dbaas/cloud-db/advanced-parameter/cloud-db-advanced-parameter-edit.html",
                    controller: "CloudDbAdvancedParameterEditCtrl",
                    controllerAs: "$ctrl"
                }
            },
            onEnter: CloudMessage => CloudMessage.flushMessages(),
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/advanced-parameter"]
        });
});
