angular.module("managerApp").controller("VpsVeeamRestoreCtrl", [
    "$scope",
    "Module.vps.services.Vps",

    function ($scope,Vps){
        "use strict";

        $scope.choosenRestorePoint = $scope.currentActionData;
        $scope.model = {
            changePassword: false
        };

        $scope.restore = function () {
            $scope.resetAction();
            Vps.veeamRestorePointRestore($scope.choosenRestorePoint, $scope.model.changePassword).then(function (data) {
                $scope.setMessage($scope.tr("vps_configuration_veeam_restore_success"), data);
            }, function (data) {
                $scope.setMessage($scope.tr("vps_configuration_veeam_restore_fail"), data.data);
            });
        };

        $scope.attachedBackup = false;
        $scope.loadingAttachedBackup = true;
        Vps.getVeeamAttachedBackup().then(function (response) {
            $scope.loadingAttachedBackup = false;
            $scope.attachedBackup = response.length;
        }, function () {
            //If there is an error, we display warning message
            $scope.loadingAttachedBackup = false;
            $scope.attachedBackup = true;
        });

    }
]);
