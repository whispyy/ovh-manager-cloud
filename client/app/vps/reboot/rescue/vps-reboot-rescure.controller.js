angular.module("managerApp").controller("VpsRebootRescueCtrl", [
    "$scope",
    "Module.vps.services.Vps",
    "Alerter",

    function ($scope,Vps,Alerter){
        "use strict";

        $scope.loader = {
            loading: false,
            task : false
        };

        $scope.loadCheck = function () {
            $scope.loader.task = true;
            Vps.getTaskInError().then(function (tasks){
                if (tasks.length){
                    $scope.resetAction();
                    Alerter.alertFromSWS($scope.tr("vps_configuration_polling_fail"), "ERROR", $scope.alertId);
                }
                $scope.loader.task = false;
            }, function(){
                $scope.loader.task = false;
            });
        };

        $scope.rebootVps = function () {
            $scope.loader.loading = true;
            Vps.reboot(true).then(function () {
                $scope.resetAction();
                $scope.loader.loading = false;
                Alerter.alertFromSWS($scope.tr("vps_configuration_reboot_rescue_success", $scope.vps.name), true, $scope.alertId);
            }, function (data) {
                $scope.resetAction();
                $scope.loader.loading = false;
                Alerter.alertFromSWS($scope.tr("vps_configuration_reboot_rescue_fail"), data, $scope.alertId);
            });
        };

    }

]);
