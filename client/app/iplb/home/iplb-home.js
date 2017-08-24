angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("network.iplb.detail.home", {
            url: "/home",
            views: {
                iplbContent: {
                    templateUrl: "app/iplb/home/iplb-home.html",
                    controller: "IpLoadBalancerHomeCtrl",
                    controllerAs: "ctrl"
                }
            },
            translations: ["common", "iplb", "iplb/home"]
        });
});
