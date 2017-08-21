angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("dbaas.cloud-db.detail.log", {
            url: "/log",
            views: {
                cloudDbHeader: {
                    templateUrl: "app/dbaas/cloud-db/header/cloud-db-dashboard-header.html",
                    controller: "CloudDbDashboardHeaderCtrl",
                    controllerAs: "$ctrl"
                },
                cloudDbContent: {
                    templateUrl: "app/dbaas/cloud-db/log/cloud-db-log.html",
                    controller: "CloudDbLogCtrl",
                    controllerAs: "$ctrl"
                }
            },
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/log"]
        });
});
