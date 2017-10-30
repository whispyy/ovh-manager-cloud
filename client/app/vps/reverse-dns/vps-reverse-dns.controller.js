angular.module("managerApp")
.controller("VpsReverseDnsCtrl",
['$scope', 'Module.vps.services.Vps',

function ($scope,Vps){
    'use strict';

    $scope.selectedIp = {
        value : null
    };

    $scope.loadIps = function () {
        if (!$scope.ips) {
            $scope.ips = null;
            $scope.loadingIps = true;
            Vps.getIps().then(function (data) {
                $scope.ips = data.results;
                $scope.loadingIps = false;
            }, function () {
                $scope.loadingIps = false;
            });
        }
    };

    $scope.prepareDnsIpsStruct = function () {
        if (!$scope.reverseDnsIpsStruct) {
            $scope.reverseDnsIpsStruct = {
                results: []
            };
            $scope.reverseDnsIpsStruct.results.push(angular.copy($scope.selectedIp.value));
            $scope.reverseDnsIpsStruct.results[0].reverse = '';
        }
    };

    $scope.modifyReverse = function () {
        $scope.resetAction();
        Vps.setReversesDns($scope.reverseDnsIpsStruct).then(function (data) {
            if (data && data.state) {
                switch (data.state) {
                case "ERROR" :
                    $scope.setMessage($scope.tr('vps_configuration_reversedns_fail'), data);
                    break;
                case "PARTIAL" :
                    break;
                case "OK" :
                    $scope.setMessage($scope.tr('vps_configuration_reversedns_success', [$scope.vps.name]), data);
                    break;
                }
            }
        }, function (data) {
            $scope.setMessage($scope.tr('vps_configuration_reversedns_fail'), data);
        });
    };

}

]);
