angular.module("managerApp")
.controller("VpsTabVeeamCtrl",
["$scope", "Module.vps.services.Vps", "User", "$q", "Polling",

function ($scope, Vps, User, $q, Polling) {
    "use strict";

    $scope.veeamStates = {
        MOUNTED: "MOUNTED",
        ENABLED: "enabled",
        DISABLED: "disabled"
    };
    $scope.alertId = "vps_veeam_alert";
    $scope.loaders = {
        veeamInfo: false,
        restorePoints: false
    };

    $scope.veeamLoading = false;
    $scope.veeamTab = null;
    $scope.vps.canOrderVeeamOptions = true;

    $scope.loadVeeamTab = function () {

        User.getUrlOf("vpsCloud").then(function (link) {
            $scope.vpsCloudUrl = link;
        });

        if ($scope.vps.hasVeeam) {
            $scope.loaders.veeamInfo = true;
            $scope.loaders.restorePoints = true;
            $q.all([Vps.getVeeam(), Vps.getTabVeeam("available", true), Vps.getTabVeeam("restoring", false)])
                .then(function (data) {
                    $scope.veeamTab = data[0];
                    $scope.veeams = data[1];
                    if (data[2].length) {
                        $scope.veeamTab.state = "MOUNTING";
                        $scope.veeamTab.accessInfos = {
                            restorePoint: data[2][0]
                        };
                    }
                }, this.onError)
                ["finally"](function () {
                    $scope.loaders.veeamInfo = false;
                });

            Vps.getVeeamOption()["catch"](function (data) {
                $scope.vps.canOrderVeeamOptions = data.status !== 400;
            });

            getTaskInProgress();
        }
    };

    function getTaskInProgress () {
        Vps.getTaskInProgress("").then(function (taskTab) {
            angular.forEach(taskTab, function (task) {
                $scope.$broadcast("vps.TASK.polling", task);
            });
        });
    }

    $scope.mountRestorePoint = function (restorePoint) {
        if ($scope.veeamTab && !$scope.veeamTab.isRestoring) {
            $scope.setAction("veeam/mount/vps-veeam-mount", restorePoint);
        }
    };

    $scope.restoreRestorePoint = function (restorePoint) {
        if ($scope.veeamTab && !$scope.veeamTab.isRestoring) {
            $scope.setAction("veeam/restore/vps-veeam-restore", restorePoint);
        }
    };

    $scope.onTransformItemDone = function () {
        $scope.loaders.restorePoints = false;
    };

    $scope.$on("Vps.events.tabVeeamChanged", function () {
        $scope.loadVeeamTab();
    });

    $scope.$on("vps.TASK.polling", function (e, task) {
        $scope.veeamTab.state = "MOUNTING";
        startPollRestart(task);
    });

    function startPollRestart (task) {
        Vps.addTask(task, $scope.$id).then(function (state) {
            if (Polling.isResolve(state)) {
                $scope.loadVeeamTab();
            } else {
                startPollRestart(task);
            }
        }, function () {
            $scope.loadVeeamTab();
        });
    }

    $scope.transformItem = function (item) {
        return { value: item };
    };

    $scope.loadVeeamTab();
}

]);
