angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("dbaas.cloud-db", {
            url: "/cloud-db",
            templateUrl: "app/dbaas/cloud-db/cloud-db.html",
            translations: ["common", "dbaas/cloud-db"]
        })
        .state("dbaas.cloud-db.detail", {
            url: "/{serviceName}",
            redirectTo: "dbaas.cloud-db.detail.home",
            views: {
                cloudDbContainer: {
                    templateUrl: "app/dbaas/cloud-db/cloud-db-detail.html",
                    controller: "CloudDbDetailCtrl",
                    controllerAs: "$ctrl"
                }
            },
            translations: ["common", "cloud", "dbaas/cloud-db"]
        });
});
