angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("network.iplb.detail.task", {
            url: "/task",
            views: {
                iplbContent: {
                    templateUrl: "app/iplb/task/iplb-task.html",
                    controller: "IpLoadBalancerTaskCtrl",
                    controllerAs: "ctrl"
                }
            },
            translations: ["common", "iplb", "iplb/task"]
        });
});
