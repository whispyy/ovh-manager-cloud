angular.module("managerApp").controller("Module.vps.ctrl.BackupStorage.activate", [
    "$scope",
    "Module.vps.services.Vps",
    function ($scope, Vps) {
        "use strict";

        $scope.optionDetails = null;
        $scope.url = null;

        $scope.loadOptionDetails = function () {
            if (!$scope.optionDetails) {
                Vps.getOptionDetails("ftpbackup").then(function (data) {
                    $scope.optionDetails = data.results[0];
                }, function (data) {
                    $scope.resetAction();
                    $scope.setMessage($scope.tr("vps_configuration_activate_ftpbackup_fail"), data);
                });
            }
        };

        $scope.activateFtpBackup = function () {
            if (!$scope.url) {
                Vps.orderOption("ftpbackup", $scope.optionDetails.duration.duration).then(function (order) {
                    $scope.url = order.url;
                }, function (data) {
                    $scope.resetAction();
                    $scope.setMessage($scope.tr("vps_configuration_activate_ftpbackup_fail"), data);
                });
            }
        };

        $scope.displayBC = function () {
            $scope.resetAction();
            window.open(
                $scope.url,
                "_blank"
            );
        };
    }
]);

