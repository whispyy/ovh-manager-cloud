angular.module("managerApp").controller("VpsTabsCtrl", [
    "$scope",
    "$stateParams",
    "$location",
    "Module.vps.services.Vps",
    function ($scope, $stateParams, $location, Vps) {
        "use strict";

        $scope.toKebabCase = _.kebabCase;
        var defaultTab = "summary";
        $scope.tabs = [
            "summary",
            "ip",
            "secondary_dns",
            "veeam",
            "backup_storage",
            "additional_disk"
        ];

        $scope.setSelectedTab = function (tab) {
            if (tab !== undefined && tab !== null && tab !== "") {
                $scope.selectedTab = tab;
            } else {
                $scope.selectedTab = defaultTab;
            }
            $location.search("tab", $scope.selectedTab);
        };

        Vps.getSelected().then(function () {
            if ($stateParams.tab && ~$scope.tabs.indexOf($stateParams.tab)) {
                $scope.setSelectedTab($stateParams.tab);
            } else {
                $scope.setSelectedTab(defaultTab);
            }
        });
    }

]);
