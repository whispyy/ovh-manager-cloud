angular.module("managerApp")
    .controller("VpsOptionCancelCtrl",
        ['$rootScope', '$scope','$q','$filter','User','Alerter', 'Module.vps.services.Vps',
            function ($rootScope,$scope,$q,$filter,User,Alerter, Vps) {
                'use strict';
                
                $scope.loader = {
                    loading: false
                };
                
                $scope.init = function() {
                    $scope.expirationDate = $filter("date")($scope.vps.expiration, "shortDate");
                };

                $scope.cancelOption = function () {

                    $scope.loader.loading = true;

                    Vps.cancelOption($scope.currentActionData)
                        .then(function () {
                            Alerter.success($scope.tr("vps_configuration_cancel_option_cancel_success"), true, $scope.alertId);
                            $rootScope.$broadcast("vps.tabs.summary.refresh");
                        })
                        ["catch"](function (data) {
                            Alerter.alertFromSWS($scope.tr("vps_configuration_cancel_option_cancel_error"), data, $scope.alertId);
                        })
                        ["finally"](function () {
                            $scope.resetAction();
                            $scope.loader.loading = false;
                        });
                };
            }
        ]);
