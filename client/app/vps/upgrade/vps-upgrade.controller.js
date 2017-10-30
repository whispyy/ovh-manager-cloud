angular.module("managerApp")
.controller("VpsUpgradeCtrl",
['$scope', 'Module.vps.services.Vps','$filter',

function ($scope,Vps,$filter){
    'use strict';

    $scope.order = null;
    $scope.selectedModel = {};
    $scope.upgradesList = null;

    $scope.getCurrentModel = function () {
        return _.find($scope.upgradesList, function (upgrade) {
            return upgrade.isCurrentModel === true;
        });
    };

    $scope.loadUpgradesList = function () {
        if (!$scope.upgradesList) {
            Vps.upgradesList().then(function (data) {
                $scope.upgradesList = data.results;
            }, function (data) {
                $scope.resetAction();
                $scope.setMessage($scope.tr('vps_configuration_upgradevps_fail'), data);
            });
        }
    };

    $scope.agree = {
        value: false
    };

    $scope.upgradeVps = function () {
        $scope.order = null;
        var modelToUpgradeTo = $.grep($scope.upgradesList, function(e){ return e.model === $scope.selectedModel.model; });
        if(modelToUpgradeTo.length > 0) {
            $scope.selectedModelForUpgrade = modelToUpgradeTo[0];
            Vps.upgrade($scope.selectedModelForUpgrade.model, $scope.selectedModelForUpgrade.duration.duration).then(function (data) {
                $scope.agree.value = false;
                $scope.selectedModelForUpgrade.duration.dateFormatted = $filter('date')($scope.selectedModelForUpgrade.duration.date, 'dd/MM/yyyy');
                $scope.order = data;
            }, function (data) {
                $scope.resetAction();
                $scope.setMessage($scope.tr('vps_configuration_upgradevps_fail'), data);
            });
        }
    };

    $scope.displayBC = function () {
        $scope.resetAction();
        window.open(
            $scope.order.url,
            '_blank'
        );
    };

}

]);
