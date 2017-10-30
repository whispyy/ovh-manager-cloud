angular.module("managerApp").controller("VpsRebootCtrl", [
    "$scope",
    "Module.vps.services.Vps",
    "Alerter",

    function ($scope,Vps,Alerter){
        "use strict";

        $scope.model = null;
        $scope.loader = {
            loading: false,
            task : false
        };
        $scope.selected = {
            rescue: false
        };

        $scope.loadCheck = function () {
            $scope.loader.task = true;
            Vps.getTaskInError().then(function (tasks){
                loadVpsRescueMode(tasks);
            }, function (tasks){
                loadVpsRescueMode(tasks);
            });
        };

        function loadVpsRescueMode(tasks) {
            if (!tasks || !tasks.length){
                Vps.getSelected().then(function (data) {
                    $scope.model = data;
                    $scope.loader.task = false;
                }, function () {
                    $scope.resetAction();
                    $scope.loader.task = false;
                    Alerter.alertFromSWS($scope.tr("vps_configuration_reboot_fail"), "ERROR", $scope.alertId);
                });
            } else {
                $scope.resetAction();
                $scope.loader.task = false;
                Alerter.alertFromSWS($scope.tr("vps_configuration_polling_fail"), "ERROR", $scope.alertId);
            }
        }


        $scope.rebootVps = function () {
            $scope.loader.loading = true;
            Vps.reboot($scope.selected.rescue).then(function () {
                $scope.resetAction();
                $scope.loader.loading = false;
                Alerter.alertFromSWS($scope.tr("vps_configuration_reboot_success", $scope.vps.name), true, $scope.alertId);
            }, function (data) {
                $scope.resetAction();
                $scope.loader.loading = false;
                Alerter.alertFromSWS($scope.tr("vps_configuration_reboot_fail"), data, $scope.alertId);
            });
        };

    }

]);
