angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("network.iplb.detail.graph", {
            url: "/graph",
            views: {
                iplbContent: {
                    templateUrl: "app/iplb/graph/iplb-graph.html",
                    controller: "IpLoadBalancerGraphCtrl",
                    controllerAs: "ctrl"
                }
            },
            translations: ["common", "iplb", "iplb/graph"]
        });
});
