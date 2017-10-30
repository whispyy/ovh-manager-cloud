angular.module("managerApp").controller("VpsVeeamUmountCtrl", [
    "$scope",
    "Module.vps.services.Vps",

    function ($scope,Vps){
        "use strict";

        $scope.choosenRestorePoint = $scope.currentActionData;

        $scope.umount = function () {
            $scope.resetAction();
            Vps.veeamRestorePointUmount($scope.choosenRestorePoint).then(function (data) {
                $scope.setMessage($scope.tr("vps_configuration_veeam_umount_success"), data);
            }, function (data) {
                $scope.setMessage($scope.tr("vps_configuration_veeam_umount_fail"), data.data);
            });
        };
    }
]);
