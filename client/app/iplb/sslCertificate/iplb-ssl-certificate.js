(() => {
    angular.module("managerApp").config($stateProvider => {
        $stateProvider
            .state("network.iplb.detail.ssl-certificate", {
                url: "/sslCertificate",
                redirectTo: "network.iplb.detail.ssl-certificate.home",
                views: {
                    iplbContent: {
                        template: '<div ui-view="iplbSslCertificate"><div>'
                    }
                },
                translations: ["common", "iplb", "iplb/sslCertificate"]
            })
            .state("network.iplb.detail.ssl-certificate.home", {
                url: "/",
                views: {
                    iplbSslCertificate: {
                        templateUrl: "app/iplb/sslCertificate/iplb-ssl-certificate.html",
                        controller: "IpLoadBalancerSslCertificateCtrl",
                        controllerAs: "ctrl"
                    }
                },
                translations: ["common", "iplb", "iplb/sslCertificate"]
            })
            .state("network.iplb.detail.ssl-certificate.add", {
                url: "/sslCertificate/add",
                views: {
                    iplbSslCertificate: {
                        templateUrl: "app/iplb/sslCertificate/iplb-ssl-certificate-edit.html",
                        controller: "IpLoadBalancerSslCertificateEditCtrl",
                        controllerAs: "ctrl"
                    }
                },
                onEnter: CloudMessage => CloudMessage.flushMessages(),
                translations: ["common", "iplb", "iplb/sslCertificate"]
            });
    });
})();
