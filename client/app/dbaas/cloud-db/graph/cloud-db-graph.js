angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("dbaas.cloud-db.detail.graph", {
            url: "/graph",
            views: {
                cloudDbHeader: {
                    templateUrl: "app/dbaas/cloud-db/header/cloud-db-dashboard-header.html",
                    controller: "CloudDbDashboardHeaderCtrl",
                    controllerAs: "$ctrl"
                },
                cloudDbContent: {
                    templateUrl: "app/dbaas/cloud-db/graph/cloud-db-graph.html",
                    controller: "CloudDbGraphCtrl",
                    controllerAs: "$ctrl"
                }
            },
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/graph"]
        });
});
