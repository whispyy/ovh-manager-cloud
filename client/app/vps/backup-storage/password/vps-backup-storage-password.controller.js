angular.module("managerApp").controller("Module.vps.ctrl.BackupStorage.passworld", [
    "$scope",
    "Module.vps.services.Vps",
    "Alerter",
    function ($scope, Vps, Alerter) {
        "use strict";

        var alert = "vps_tab_backup_storage_alert";

        $scope.ftpBackup = $scope.currentActionData;
        $scope.loading = false;

        $scope.requestFtpBackupPassword = function () {
            $scope.loading = true;

            Vps.requestFtpBackupPassword().then(function () {
                Alerter.success($scope.tr("vps_backup_storage_access_forgot_password_success"), alert);
            }, function (data) {

                Alerter.alertFromSWS($scope.tr("vps_backup_storage_access_forgot_password_failure"), data.data, alert);
            })["finally"](function () {

                $scope.resetAction();
                $scope.loading = false;
            });
        };
    }
]);
