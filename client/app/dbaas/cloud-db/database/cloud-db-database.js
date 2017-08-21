angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("dbaas.cloud-db.detail.database", {
            url: "/database",
            redirectTo: "dbaas.cloud-db.detail.database.home",
            views: {
                cloudDbHeader: {
                    templateUrl: "app/dbaas/cloud-db/header/cloud-db-dashboard-header.html",
                    controller: "CloudDbDashboardHeaderCtrl",
                    controllerAs: "$ctrl"
                },
                cloudDbContent: {
                    template: '<div ui-view="cloudDbDatabase"><div>'
                }
            },
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/database"]
        })
        .state("dbaas.cloud-db.detail.database.home", {
            url: "/",
            views: {
                cloudDbDatabase: {
                    templateUrl: "app/dbaas/cloud-db/database/cloud-db-database.html",
                    controller: "CloudDbDatabaseCtrl",
                    controllerAs: "$ctrl"
                }
            },
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/database"]
        })
        .state("dbaas.cloud-db.detail.database.add", {
            url: "/add",
            views: {
                cloudDbDatabase: {
                    templateUrl: "app/dbaas/cloud-db/database/cloud-db-database-edit.html",
                    controller: "CloudDbDatabaseEditCtrl",
                    controllerAs: "$ctrl"
                }
            },
            onEnter: CloudMessage => CloudMessage.flushMessages(),
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/database"]
        })
        .state("dbaas.cloud-db.detail.database.update", {
            url: "/{databaseId}",
            views: {
                cloudDbDatabase: {
                    templateUrl: "app/dbaas/cloud-db/database/cloud-db-database-edit.html",
                    controller: "CloudDbDatabaseEditCtrl",
                    controllerAs: "$ctrl"
                }
            },
            onEnter: CloudMessage => CloudMessage.flushMessages(),
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/database"]
        });
});
