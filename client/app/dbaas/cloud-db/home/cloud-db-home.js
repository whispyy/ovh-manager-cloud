angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("dbaas.cloud-db.detail.home", {
            url: "/home",
            views: {
                cloudDbHeader: {
                    templateUrl: "app/dbaas/cloud-db/header/cloud-db-dashboard-header.html",
                    controller: "CloudDbDashboardHeaderCtrl",
                    controllerAs: "$ctrl"
                },
                cloudDbContent: {
                    templateUrl: "app/dbaas/cloud-db/home/cloud-db-home.html",
                    controller: "CloudDbHomeCtrl",
                    controllerAs: "$ctrl"
                }
            },
            translations: ["common", "cloud-db", "dbaas/cloud-db/home"]
        });
});
