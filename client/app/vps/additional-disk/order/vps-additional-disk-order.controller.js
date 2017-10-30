angular.module("managerApp").controller("OrderAdditionalDiskCtrl", [
    "$scope",
    "Module.vps.services.Vps",
    "Alerter",
    function ($scope, Vps, Alerter) {
        "use strict";

        $scope.alertId = "vps_information_alert";

        $scope.model = {
            capacity : null,
            duration : null
        };
        $scope.loading = {
            capacity: true,
            offer: null,
            validation: null
        };

        $scope.offer = null;

        $scope.capacityArray = null;

        $scope.agree = {
            value: false
        };

        /*==============================
          =            STEP 1            =
          ==============================*/

        $scope.getAdditionalDiskPrices = function() {
            Vps.getAdditionalDiskPrices().then(function (data) {
                $scope.capacityArray = data;
            }, function (error) {
                $scope.resetAction();
                Alerter.alertFromSWS($scope.tr('vps_order_additional_disk_fail'), error, $scope.alertId);
            })
            ["finally"](function () {
                $scope.loading.capacity = false;
            });
        };

        /*==============================
          =            STEP 2            =
          ==============================*/

        $scope.getAdditionalDiskFinalPrice = function() {
            $scope.loading.offer = true;
            Vps.getAllowedDuration($scope.model.capacity).then(function (duration) {
                $scope.model.duration = duration;
                Vps.getAdditionalDiskFinalPrice($scope.model.capacity, $scope.model.duration).then(function (response) {
                    $scope.loading.offer = false;
                    $scope.offer = response;
                });
            })
            ["catch"](function (error) {
                $scope.resetAction();
                Alerter.alertFromSWS($scope.tr('vps_order_additional_disk_fail'), error, $scope.alertId);
            })
            ["finally"](function () {
                var date = $scope.model.duration;
                date = date.replace(/[a-zA-Z]*-/, "");
                $scope.date = moment(date).format("L");
                $scope.size = $scope.model.capacity + $scope.tr("unit_size_GB");
                $scope.loading.offer = false;
            });
        };

        /*==============================
          =            Order            =
          ==============================*/

        $scope.orderAdditionalDiskOption = function () {
            $scope.loading.validation = true;
            Vps.postAdditionalDiskOrder($scope.model.capacity, $scope.model.duration).then(function (order) {
                $scope.loading.validation = false;
                Alerter.success($scope.tr('vps_order_additional_disk_success', [order.url, order.orderId]), $scope.alertId);
                window.open(order.url, '_blank');
                $scope.resetAction();
            }, function (err) {
                $scope.loading.validation = false;
                Alerter.alertFromSWS($scope.tr('vps_order_additional_disk_fail'), err, $scope.alertId);
                $scope.resetAction();
            });
        };

    }
]);
