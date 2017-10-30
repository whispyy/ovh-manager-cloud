angular.module("managerApp").controller("Module.vps.ctrl.BackupStorage.access.add", [
    "$scope",
    "Module.vps.services.Vps",
    "$rootScope",
    "Alerter",
    function ($scope, Vps, $rootScope, Alerter) {
        "use strict";

        var alert = "vps_tab_backup_storage_alert";

        $scope.access = {
            listIp: [],
            ip: null,
            ftp: false,
            cifs: false,
            nfs: false
        };
        $scope.loading = false;

        $scope.load = function () {
            $scope.loading = true;

            Vps.getBackupStorageAuthorizableBlocks().then(function (list) {
                $scope.access.listIp = list;
            }, function (data) {

                $scope.resetAction();
                Alerter.alertFromSWS($scope.tr("vps_backup_storage_access_add_ip_failure"), data.data, alert);
            })["finally"](function () {

                $scope.loading = false;
            });
        };

        $scope.addBackupStorageAccess = function () {
            var resultMessages = {
                OK: $scope.tr("vps_backup_storage_access_add_success"),
                PARTIAL: $scope.tr("vps_backup_storage_access_add_partial"),
                ERROR: $scope.tr("vps_backup_storage_access_add_failure")
            };

            $scope.loading = true;

            Vps.postBackupStorageAccess($scope.access.ip, $scope.access.ftp, $scope.access.nfs, $scope.access.cifs).then(function (data) {
                Alerter.alertFromSWSBatchResult(resultMessages, data, alert);
            }, function (data) {

                Alerter.alertFromSWSBatchResult(resultMessages, data, alert);
            })["finally"](function () {

                $rootScope.$broadcast("Vps.events.tabBackupStorageChanged", true);
                $scope.resetAction();
                $scope.loading = false;
            });
        };
    }
]);
