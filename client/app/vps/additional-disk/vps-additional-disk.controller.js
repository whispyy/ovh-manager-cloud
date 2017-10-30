angular.module("managerApp").controller("AdditionalDiskCtrl", [
    "$scope",
    "$q",
    "Module.vps.services.Vps",
    "User",
    "Alerter",
    "constants",
    "additionalDisk.hasNoOption",
    function ($scope, $q, Vps, User, Alerter, constants, additionalDiskHasNoOption) {
        "use strict";

        $scope.alertId = "vps_additional_disk_alert";

        $scope.loading = {
            information: true
        };
        $scope.error = false;
        $scope.hasAdditionalDiskOption = null;
        $scope.additionalDisks = [];

        function getHasAdditionalDiskOption () {
            return Vps.hasAdditionalDiskOption().then(() => {
                $scope.hasAdditionalDiskOption = true;
            }).catch((error) => {
                if (error === additionalDiskHasNoOption) {
                    $scope.hasAdditionalDiskOption = false;
                } else {
                    $scope.resetAction();
                    $scope.error = true;
                    Alerter.alertFromSWS($scope.tr("vps_additional_disk_info_fail"), error, $scope.alertId);
                }
                return $q.reject(error);
            });
        }

        function getAdditionalDisks () {
            $scope.loading.disksInformation = true;
            return Vps.getDisks().then((data) => {
                var promises = data.map((elem, id)  => {
                    return Vps.getDiskInfo(data[id]);
                });
                return $q.all(promises).then((data) => {
                    $scope.additionalDisks = Vps.showOnlyAdditionalDisk(data);
                });
            }).catch((error) => {
                $scope.resetAction();
                $scope.error = true;
                Alerter.alertFromSWS($scope.tr("vps_additional_disk_info_fail"), error, $scope.alertId);
                return $q.reject(error);
            });
        }

        function getAdditionalDiskInfo () {
            getHasAdditionalDiskOption().then(() => {
                return getAdditionalDisks();
            }).catch(() => { }).finally(() => {
                $scope.loading.information = false;
            });
        }

        function getGuideURL () {
            User.getUrlOf("guides").then((guides) => {
                if (guides && guides.additionalDisksGuide) {
                    $scope.guideURL = guides.additionalDisksGuide;
                }
            });
        }

        getAdditionalDiskInfo();
        getGuideURL();

    }
]);
