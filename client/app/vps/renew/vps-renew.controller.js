angular.module("managerApp")
.controller("VpsRenewCtrl",
['$scope', '$q','constants',

function ($scope,$q,constants){
    'use strict';

    $scope.displayBC = function () {
        $scope.resetAction();

        $q.when(URI.expand(constants.renew, {
                serviceName : $scope.vps.name
            }).toString()).then(function(result) {
                window.open(result,'_blank' );
            });
    };

}

]);
