angular.module("managerApp").controller("Module.vps.ctrl.BackupStorage.access.delete", [
    "$scope",
    "Module.vps.services.Vps",
    "$rootScope",
    "Alerter",
    function ($scope, Vps, $rootScope, Alerter) {
        "use strict";

        var alert = "vps_tab_backup_storage_alert";

        $scope.access = $scope.currentActionData.ipBlock;
        $scope.loading = false;

        $scope.deleteBackupStorageAccess = function () {
            $scope.loading = true;

            Vps.deleteBackupStorageAccess($scope.access).then(function () {
                $scope.resetAction();
                Alerter.success($scope.tr("vps_backup_storage_access_delete_success", $scope.access), alert);
            }, function (data) {

                Alerter.alertFromSWS($scope.tr("vps_backup_storage_access_delete_failure", $scope.access), data.data, alert);
            })["finally"](function () {

                $rootScope.$broadcast("Vps.events.tabBackupStorageChanged", true);
                $scope.resetAction();
                $scope.loading = false;
            });
        };
    }
]);
