angular.module("managerApp").controller("VpsVeeamOrderCtrl", [
    "$scope",
    "Module.vps.services.Vps",

    function ($scope,Vps){
        "use strict";

        $scope.model = {
            vps: null,
            optionDetails: null,
            url: null,
            contractsValidated: null
        };

        $scope.loadOptionDetails = function () {
            if (!$scope.model.optionDetails) {
                Vps.getSelected().then(function (data) {
                    $scope.model.vps = data;
                }, function (data) {
                    $scope.resetAction();
                    $scope.setMessage($scope.tr("vps_configuration_veeam_order_step1_loading_error"), data);
                });

                Vps.getVeeamOption().then(function (data) {
                    $scope.model.optionDetails = data;
                    // Remove that !!!
                    Vps.getPriceOptions($scope.vps).then(function (price) {
                        $scope.model.optionDetails.unitaryPrice = price.data.text;
                    });

                }, function (data) {
                    $scope.resetAction();
                    $scope.setMessage($scope.tr("vps_configuration_veeam_order_step1_loading_error"), data.data);
                });
            }
        };

        $scope.order = function () {
            $scope.model.url = null;
            Vps.orderVeeamOption($scope.model.optionDetails.duration.duration)
                .then(function (order) {
                    $scope.model.url = order.url;
                }, function (data) {
                    $scope.resetAction();
                    $scope.setMessage($scope.tr("vps_configuration_veeam_order_fail"), data.data);
                });
        };

        $scope.displayBC = function () {
            $scope.resetAction();
            window.open(
                $scope.model.url,
                "_blank"
            );
        };

    }

]);
