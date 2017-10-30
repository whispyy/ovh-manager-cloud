angular.module("managerApp").controller("Module.vps.ctrl.BackupStorage", [
    "$scope",
    "Module.vps.services.Vps",
    "Alerter",
    "User",
    function ($scope, Vps, Alerter, User) {
        "use strict";

        var forceRefresh = true,
            scroll = false,
            alert = "vps_tab_backup_storage_alert";

        $scope.loading = {
            information: false,
            tab: false,
            edit: false
        };
        $scope.backup = {
            information: null,
            use: 0,
            tab: null,
            edit: null,
            editBack: null
        };

        function load () {
            $scope.loading.information = true;
            User.getUrlOf("vpsCloud").then((link) => {
                $scope.vpsCloudUrl = link;
            });

            Vps.getBackupStorageInformation().then((backupInfo) => {
                $scope.backup.information = backupInfo;
                if (backupInfo.activated === true && backupInfo.quota) {
                    if (backupInfo.usage === 0) {
                        backupInfo.usage = {
                            unit: "%",
                            value: 0
                        };
                    }

                    $scope.backup.use = backupInfo.usage.value * backupInfo.quota.value / 100;
                }
            }).catch(() => { }).finally(() => {
                $scope.loading.information = false;
            });
        }

        $scope.loadTab = (count, offset) => {
            $scope.loading.tab = true;
            Vps.getBackupStorageTab(count, offset, forceRefresh).then((tab) => {
                forceRefresh = false;
                $scope.backup.tab = tab;
            }).catch(() => { }).finally(() => {
                $scope.loading.tab = false;
                if (scroll) {
                    $("html, body").animate({ scrollTop: $("#vpsTabBackupStorage").offset().top }, 500);
                    scroll = false;
                }
            });
        };

        $scope.$on("Vps.events.tabBackupStorage.reload", (event, forceRef) =>  {
            forceRefresh = forceRef;
            scroll = true;
            $scope.$broadcast("paginationServerSide.reload", "backupStorageTable");
        });

        $scope.$on("Vps.events.tabBackupStorageChanged", (event, forceRef) =>  {
            forceRefresh = forceRef;
            scroll = true;
            $scope.$broadcast("paginationServerSide.loadPage", "1", "backupStorageTable");
        });

        $scope.refreshTab = () => {
            $scope.$broadcast("Vps.events.tabBackupStorage.reload", true);
        };

        load();

        //--------------EDIT ACCESS------------------

        $scope.setBackupCurrentEdit = (backupStorage, inputToRevert) => {
            $scope.backup.edit = angular.copy(backupStorage);
            $scope.backup.edit[inputToRevert] = !$scope.backup.edit[inputToRevert];
            $scope.backup.editBack = backupStorage;
            inputToRevert = !inputToRevert;
        };

        $scope.saveBackupCurrentEdit = () => {
            if ($scope.backup.edit.cifs || $scope.backup.edit.ftp || $scope.backup.edit.nfs) {
                $scope.loading.edit = true;
                Vps.putBackupStorageAccess($scope.backup.edit.ipBlock, $scope.backup.edit.ftp, $scope.backup.edit.nfs, $scope.backup.edit.cifs).then(() => {
                    Alerter.success($scope.tr("vps_tab_backup_storage_set_success", $scope.backup.edit.ipBlock), alert);
                }, (data) => {

                    Alerter.alertFromSWS($scope.tr("vps_tab_backup_storage_set_fail", $scope.backup.edit.ipBlock), data.data, alert);
                }).finally(() => {
                    $scope.backup.editBack = null;
                    $scope.backup.edit = null;
                    $scope.loading.edit = false;
                    $scope.refreshTab();
                });
            }
        };

        $scope.cancelBackupCurrentEdit = () => {
            $scope.backup.edit = null;
            $scope.backup.editBack = null;
        };
    }
]);
