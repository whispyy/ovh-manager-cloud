angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("dbaas.cloud-db.detail.offer", {
            url: "/offer",
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
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/offer"]
        })
        .state("dbaas.cloud-db.detail.offer.update", {
            url: "/update",
            views: {
                cloudDbAdvancedParameter: {
                    templateUrl: "app/dbaas/cloud-db/offer/cloud-db-offer-edit.html",
                    controller: "CloudDbOfferEditCtrl",
                    controllerAs: "$ctrl"
                }
            },
            onEnter: CloudMessage => CloudMessage.flushMessages(),
            translations: ["common", "dbaas/cloud-db", "dbaas/cloud-db/offer"]
        });
});
