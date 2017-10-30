angular.module("managerApp")
.controller("VpsSnapshotRestoreCtrl",
['$scope', 'Module.vps.services.Vps','$filter',

function ($scope,Vps,$filter){
    'use strict';

    Vps.getTabSummary().then(function (summary) {
        $scope.summary = summary;
        $scope.summary.snapshot.formattedCreationData = $filter('date')($scope.summary.snapshot.creationDate, 'dd/MM/yyyy HH:mm:ss');
    });

    $scope.restoreSnapshot = function () {
        $scope.resetAction();
        Vps.restoreSnapshot().then(function (data) {
            $scope.setMessage($scope.tr('vps_configuration_snapshot_restore_success', [$scope.vps.name]), data);
        }, function (data) {
            $scope.setMessage($scope.tr('vps_configuration_snapshot_restore_fail'), data);
        });
    };

}

]);

angular.module("managerApp")
.controller("VpsSnapshotTakeCtrl",
['$scope', 'Module.vps.services.Vps',

function ($scope,Vps){
    'use strict';

    $scope.snapshotToTake = {
        description: null
    };

    $scope.takeSnapshot = function () {
        $scope.resetAction();
        Vps.takeSnapshot($scope.snapshotToTake).then(function (data) {
            $scope.setMessage($scope.tr('vps_configuration_snapshot_take_success', [$scope.vps.name]), data);
        }, function (data) {
            $scope.setMessage($scope.tr('vps_configuration_snapshot_take_fail'), data);
        });
    };

}

]);


angular.module("managerApp")
.controller("VpsSnapshotActivateCtrl",
['$scope', 'Module.vps.services.Vps',

function ($scope,Vps){
    'use strict';

    $scope.optionDetails = null;
    $scope.url = null;

    $scope.loadOptionDetails = function () {
        if (!$scope.optionDetails) {
            // HOT FIX remove this fukin shit !!
            if ($scope.vps.version === "_2015_V_1" && $scope.vps.offerType === "SSD") {
                Vps.getOptionSnapshot($scope.vps).then(function (d) {
                    Vps.getOptionDetails2('snapshot',$scope.vps, d.data[0]).then(function (data) {
                        $scope.optionDetails = {
                            unitaryPrice: data[0].data.text,
                            withoutTax: data[1].data.prices.withoutTax.text,
                            withTax: data[1].data.prices.withTax.text,
                            duration: {
                                duration : d.data[0]
                            }
                        };
                    }, function (data) {
                        $scope.resetAction();
                        $scope.setMessage($scope.tr('vps_configuration_activate_snapshot_fail'), data.data);
                    });
                });

            } else {
                Vps.getOptionDetails('snapshot').then(function (data) {
                    $scope.optionDetails = data.results[0];
                }, function (data) {
                    $scope.resetAction();
                    $scope.setMessage($scope.tr('vps_configuration_activate_snapshot_fail'), data);
                });
            }
        }
    };

    $scope.activateSnapshot = function () {
        if(!$scope.url) {
            Vps.orderOption('snapshot', $scope.optionDetails.duration.duration).then(function (order) {
                $scope.url = order.url;
            }, function (data) {
                $scope.resetAction();
                $scope.setMessage($scope.tr('vps_configuration_activate_snapshot_fail'), data);
            });
        }
    };

    $scope.displayBC = function () {
        $scope.resetAction();
        window.open(
            $scope.url,
            '_blank'
        );
    };

}

]);


angular.module("managerApp")
.controller("VpsSnapshotDeleteCtrl",
['$scope', 'Module.vps.services.Vps',

function ($scope,Vps){
    'use strict';

    $scope.deleteSnapshot = function () {
        $scope.resetAction();
        Vps.deleteSnapshot().then(function (data) {
            $scope.setMessage($scope.tr('vps_configuration_delete_snapshot_success', [$scope.vps.name]), data);
        }, function (data) {
            $scope.setMessage($scope.tr('vps_configuration_delete_snapshot_fail'), data);
        });
    };

}

]);
