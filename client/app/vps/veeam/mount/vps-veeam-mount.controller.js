angular.module("managerApp").controller("VpsVeeamMountCtrl", [
    "$scope",
    "Module.vps.services.Vps",

    function ($scope,Vps){
        "use strict";

        $scope.choosenRestorePoint = $scope.currentActionData;

        $scope.mount = function () {
            $scope.resetAction();
            Vps.veeamRestorePointMount($scope.choosenRestorePoint).then(function (data) {
                $scope.setMessage($scope.tr("vps_configuration_veeam_mount_success"), data);
            }, function (data) {
                $scope.setMessage($scope.tr("vps_configuration_veeam_mount_fail"), data.data);
            });
        };

        $scope.attachedBackup = false;
        $scope.loadingAttachedBackup = true;
        Vps.getVeeamAttachedBackup().then(function (response) {
            $scope.loadingAttachedBackup = false;
            $scope.attachedBackup = response.length;
        }, function () {
            $scope.loadingAttachedBackup = false;
        });

    }

]);
