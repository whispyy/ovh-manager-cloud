angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("dbaas.cloud-db.detail.network", {
            url: "/network",
            redirectTo: "dbaas.cloud-db.detail.network.home",
            views: {
                cloudDbHeader: {
                    templateUrl: "app/dbaas/cloud-db/header/cloud-db-dashboard-header.html",
                    controller: "CloudDbDashboardHeaderCtrl",
                    controllerAs: "$ctrl"
                },
                cloudDbContent: {
                    template: '<div ui-view="cloudDbNetwork"><div>'
                }
            },
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/network"]
        })
        .state("dbaas.cloud-db.detail.network.home", {
            url: "/",
            views: {
                cloudDbNetwork: {
                    templateUrl: "app/dbaas/cloud-db/network/cloud-db-network.html",
                    controller: "CloudDbNetworkCtrl",
                    controllerAs: "$ctrl"
                }
            },
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/network"]
        });
});
