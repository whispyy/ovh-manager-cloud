(() => {
    angular.module("managerApp").config($stateProvider => {
        $stateProvider
            .state("network.iplb.detail.frontends", {
                url: "/frontends",
                redirectTo: "network.iplb.detail.frontends.home",
                views: {
                    iplbContent: {
                        template: '<div ui-view="iplbFrontend"><div>'
                    }
                },
                translations: ["common", "iplb", "iplb/frontends"]
            })
            .state("network.iplb.detail.frontends.home", {
                url: "/",
                views: {
                    iplbFrontend: {
                        templateUrl: "app/iplb/frontends/iplb-frontends.html",
                        controller: "IpLoadBalancerFrontendsCtrl",
                        controllerAs: "ctrl"
                    }
                },
                translations: ["common", "iplb", "iplb/frontends"]
            })
            .state("network.iplb.detail.frontends.add", {
                url: "/add",
                views: {
                    iplbFrontend: {
                        templateUrl: "app/iplb/frontends/iplb-frontends-edit.html",
                        controller: "IpLoadBalancerFrontendsEditCtrl",
                        controllerAs: "ctrl"
                    }
                },
                onEnter: CloudMessage => CloudMessage.flushMessages(),
                translations: ["common", "iplb", "iplb/frontends"]
            })
            .state("network.iplb.detail.frontends.update", {
                url: "/:frontendId",
                views: {
                    iplbFrontend: {
                        templateUrl: "app/iplb/frontends/iplb-frontends-edit.html",
                        controller: "IpLoadBalancerFrontendsEditCtrl",
                        controllerAs: "ctrl"
                    }
                },
                onEnter: CloudMessage => CloudMessage.flushMessages(),
                translations: ["common", "iplb", "iplb/frontends"]
            });
    });
})();
