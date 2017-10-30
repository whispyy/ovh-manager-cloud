angular.module("managerApp").controller("VpsSecondaryDnsDomainDeleteCtrl", [
    "$scope",
    "Module.vps.services.Vps",

    function ($scope,Vps){
        "use strict";

        $scope.entryToDelete = $scope.currentActionData;

        $scope.deleteSecondaryDnsDomain = function () {
            $scope.resetAction();
            Vps.deleteSecondaryDnsDomain($scope.entryToDelete).then(function (data) {
                $scope.setMessage($scope.tr("vps_configuration_secondarydns_delete_success"), data);
            }, function (data) {
                $scope.setMessage($scope.tr("vps_configuration_secondarydns_delete_fail", [$scope.entryToDelete]), data);
            });
        };

    }

]);
