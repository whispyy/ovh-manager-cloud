angular.module("managerApp")
.controller("VpsKVMCtrl",
['$scope', 'Module.vps.services.Vps','$timeout','$rootScope', '$sce',

function ($scope,Vps,$timeout,$rootScope, $sce){
    'use strict';

    $scope.kvmData = null;
    $scope.loadingKvm = true;
    $scope.consoleUrl = null;
    $scope.showFullScreen = {value: false};

    $scope.loadKVM = function () {
        Vps.getKVMAccess().then(function (data) {
            $scope.kvmData = data;
            $scope.loadingKvm = false;
            $timeout(function () {
                $rootScope.$broadcast("vps.TASK.polling");
            }, 2000);
        }, function () {
            Vps.getKVMConsoleUrl($scope.vps.name).then(function (consoleUrl) {
                $scope.consoleUrl = $sce.trustAsResourceUrl(consoleUrl);
                $scope.loadingKvm = false;
            }, function (data) {
                $scope.setMessage($scope.tr('vps_configuration_kvm_fail'), data);
                $scope.loadingKvm = false;
                $scope.resetAction();
            });
        });
    };
    
    $scope.closeConnection = function() {
        $scope.resetAction();
        $scope.kvmData = null;
    };

}

]);


