angular.module("managerApp").controller("VpsSecondaryDnsDomainAddCtrl", [
    "$scope",
    "Module.vps.services.Vps",

    function ($scope,Vps){
        "use strict";

        $scope.secondaryDnsAvailable = null;
        $scope.domainToAdd = {
            value:null
        };

        $scope.loadSecondaryDnsAvailable = function () {
            Vps.getSecondaryDNSAvailable().then(function (data) {
                $scope.secondaryDnsAvailable = data;
            }, function (data) {
                $scope.setMessage($scope.tr("vps_configuration_secondarydns_add_fail"), data);
            });
        };

        $scope.addSecondaryDnsDomain = function () {
            $scope.resetAction();
            Vps.addSecondaryDnsDomain($scope.domainToAdd.value).then(function (data) {
                $scope.setMessage($scope.tr("vps_configuration_secondarydns_add_success", [$scope.domainToAdd.value]), data);
            }, function (data) {
                $scope.setMessage($scope.tr("vps_configuration_secondarydns_add_fail"), data);
            });
        };

    }

]);

