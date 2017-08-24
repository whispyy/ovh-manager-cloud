angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("network.iplb.detail.configuration", {
            url: "/configuration",
            views: {
                iplbContent: {
                    templateUrl: "app/iplb/configuration/iplb-configuration.html",
                    controller: "IpLoadBalancerConfigurationCtrl",
                    controllerAs: "ctrl"
                }
            },
            translations: ["common", "iplb", "iplb/configuration"]
        });
});
