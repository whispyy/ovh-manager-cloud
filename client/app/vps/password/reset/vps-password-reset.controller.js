angular.module("managerApp").controller("VpsResetPasswordCtrl", [
    "$scope",
    "Module.vps.services.Vps",
    "Alerter",

    function ($scope,Vps,Alerter) {
        "use strict";

        $scope.loader = {
            loading: false
        };

        $scope.loadCheck = function () {
            $scope.loader.loading = true;
            Vps.getTaskInError().then(function (tasks){
                if (tasks.length){
                    $scope.resetAction();
                    Alerter.alertFromSWS($scope.tr("vps_configuration_polling_fail"), "ERROR", $scope.alertId);
                }
                $scope.loader.loading = false;
            }, function(){
                $scope.loader.loading = false;
            });
        };

        $scope.resetVpsPassword = function () {
            $scope.loader.loading = true;
            Vps.reboot(true)
                .then(function () {
                    Alerter.alertFromSWS($scope.tr("vps_configuration_reboot_rescue_success", $scope.vps.name), true, $scope.alertId);
                })["catch"](function (data) {
                    Alerter.alertFromSWS($scope.tr("vps_configuration_reboot_rescue_fail"), data, $scope.alertId);
                })["finally"](function() {
                    $scope.resetAction();
                    $scope.loader.loading = false;
                });
        };

    }

]);
