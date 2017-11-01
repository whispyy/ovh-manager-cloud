angular.module("managerApp").controller("VpsResetPasswordCtrl", [
    "$scope",
    "Module.vps.services.Vps",
    "CloudMessage",
    "$translate",

    function ($scope,Vps,CloudMessage,$translate) {
        "use strict";

        $scope.loader = {
            loading: false
        };
        $scope.tr = function (string) {
            return $translate.instant(string)
        };

        $scope.loadCheck = function () {
            $scope.loader.loading = true;
            Vps.getTaskInError().then(function (tasks){
                if (tasks.length){
                    $scope.resetAction();
                    CloudMessage.error($scope.tr("vps_configuration_polling_fail"), "ERROR", $scope.alertId);
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
                    CloudMessage.success($scope.tr("vps_configuration_reboot_rescue_success", $scope.vps.name), true, $scope.alertId);
                }).catch(function (data) {
                    CloudMessage.error($scope.tr("vps_configuration_reboot_rescue_fail"), data, $scope.alertId);
                }).finally(function() {
                    $scope.resetAction();
                    $scope.loader.loading = false;
                });
        };

    }

]);
