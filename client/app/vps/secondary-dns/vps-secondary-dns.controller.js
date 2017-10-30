angular.module("managerApp").controller("VpsTabSecondaryDnsCtrl", [
    "$scope",
    "Module.vps.services.Vps",

    function ($scope, Vps) {
        "use strict";

        $scope.secondaryDnsLoading = false;
        $scope.secondaryDns = null;

        $scope.loadSecondaryDns = function (count, offset) {
            $scope.secondaryDnsLoading = true;
            Vps.getTabSecondaryDns(count, offset).then(function (secondaryDns) {
                $scope.secondaryDnsLoading = false;
                $scope.secondaryDns = secondaryDns;
            }, this.onError);
        };

        $scope.deleteSecondaryDnsDomain = function (domain) {
            $scope.setAction("secondary-dns/delete/vps-secondary-dns-delete", domain);
        };

        var reloadCurrentPage = function () {
            if (!$scope.secondaryDnsLoading) {
                $scope.$broadcast("paginationServerSide.reload");
            }
        };

        $scope.$on("vps.tabs.secondarydns.refresh", function () {
            reloadCurrentPage();
        });

    }

]);
