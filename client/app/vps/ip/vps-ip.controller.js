angular.module("managerApp")
.controller("VpsTabIpsCtrl",
['$scope', 'Module.vps.services.Vps',

function ($scope,Vps){
    'use strict';

    $scope.ipsLoading = true;
    $scope.ips = null;

    $scope.loadPage = function () {
        Vps.getTabIps().then(function (ips) {
            $scope.ipsLoading = false;
            $scope.ips = ips;
        }, this.onError);
    };

    $scope.loadPage();

}

]);
