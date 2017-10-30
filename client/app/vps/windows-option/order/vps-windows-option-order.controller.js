
angular.module("managerApp")
.controller("OrderWindowsOptionCtrl",
['$rootScope', '$scope','$q','User','Alerter', 'Module.vps.services.Vps',
function ($rootScope,$scope,$q,User,Alerter, VPS){
    'use strict';

    $scope.alertId = "vps_information_alert";

    $scope.model = {
        capacity : null,
        duration: null
    };
    $scope.loading = {
        durations: null
    };

    $scope.agree = {
        value: false
    };

    /*==============================
     =            STEP 1            =
     ==============================*/
    $scope.informations = $scope.currentActionData;

    /*==============================
     =            STEP 2            =
     ==============================*/
    $scope.getDurations = function() {
        $scope.durations = {
            available : null,
            details : {}
        };
        $scope.loading.durations = true;

        VPS.getWindowsOptionDurations().then(function(durations) {
            $scope.loading.durations = false;
            $scope.durations.available = durations;
            loadPrices(durations);
        });
    };

    function loadPrices(durations) {
        var queue = [];
        $scope.loading.prices = true;

        angular.forEach(durations, function(duration) {
            queue.push(VPS.getWindowsOptionOrder(duration).then(function(details){
                $scope.durations.details[duration] = details;
            }));
        } );

        $q.all(queue).then(function () {
            if (durations && durations.length === 1) {
                $scope.model.duration = durations[0];
            }
            $scope.loading.prices = false;
        }, function (data) {
            Alerter.alertFromSWS($scope.tr('vps_order_windows_price_error'), data.data);
            $scope.loading.durations = false;
        });

    }

    /*==============================
     =            STEP 3            =
     ==============================*/

    $scope.loadContracts = function () {
        $scope.agree.value = false;
        if (!$scope.durations.details[$scope.model.duration].contracts || !$scope.durations.details[$scope.model.duration].contracts.length) {
            $rootScope.$broadcast('wizard-goToStep', 5);
        }
    };

    $scope.backToContracts = function () {
        if (!$scope.durations.details[$scope.model.duration].contracts || !$scope.durations.details[$scope.model.duration].contracts.length) {
            $rootScope.$broadcast('wizard-goToStep', 2);
        }
    };

    /*==============================
     =            STEP 4            =
     ==============================*/

    $scope.getResumePrice = function (price) {
        return price.value === 0 ? $scope.tr('price_free') : $scope.tr('price_ht_label', [price.text]);
    };

    $scope.orderWindowsOption = function () {
        $scope.loading.validation = true;
        VPS.postWindowsOptionOrder($scope.model.duration).then(function (order) {
            console.log(order);
            $scope.loading.validation = false;
            Alerter.success($scope.tr('vps_order_windows_order_success', [order.url, order.orderId]), $scope.alertId);
            window.open(order.url, '_blank');
            $scope.resetAction();
        }, function (data) {
            $scope.loading.validation = false;
            Alerter.alertFromSWS($scope.tr('vps_order_windows_order_success'), data, $scope.alertId);
        });
    };

}

]);
