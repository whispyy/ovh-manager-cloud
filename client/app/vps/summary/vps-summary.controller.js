angular.module("managerApp").controller("VpsTabSummaryCtrl", [
    "$scope",
    "$q",
    "Alerter",
    "Module.vps.services.Vps",
    "User",
    "additionalDisk.hasNoOption",

    function ($scope, $q, Alerter, Vps, User, additionalDiskHasNoOption) {
        "use strict";

        $scope.alertId = "vps_summary_alert";
        $scope.summaryLoading = true;
        $scope.additionalDisk = {
            loading: true,
            hasOption: null,
            optionReleased: false,
            error: false
        };
        $scope.summary = null;

        $scope.loadPage = function (forceRefresh) {
            User.getUrlOf("vpsCloud").then(function (link) {
                $scope.vpsCloudUrl = link;
            });

            Vps.getTabSummary(forceRefresh).then(function (summary) {

                completeSummaryOptionsStatus(summary)
                    ["finally"](function () {
                        $scope.summary = summary;
                        $scope.summaryLoading = false;
                    });
            });

            Vps.hasAdditionalDiskOption().then(function () {
                $scope.additionalDisk.hasOption = true;
                Vps.getDisks().then(function (data) {
                    var promises = data.map(function (elem, id) {
                        return Vps.getDiskInfo(data[id]);
                    });
                    return $q.all(promises).then(function (results) {
                        var disks = Vps.showOnlyAdditionalDisk(results);
                        $scope.additionalDisk.count = disks.length;
                        if (disks.length > 0) {
                            return Vps.getOptionStatus("additionalDisk").then(function (r) {
                                $scope.additionalDisk.optionReleased = r.state === "released";
                            });
                        }
                    });
                });
            })
            ["catch"](function (error) {
                if (error === additionalDiskHasNoOption) {
                    $scope.additionalDisk.hasOption = false;
                } else {
                    $scope.additionalDisk.error = true;
                    Alerter.alertFromSWS($scope.tr("vps_additional_disk_info_fail"), error, $scope.alertId);
                }
            })
            ["finally"](function () {
                $scope.additionalDisk.loading = false;
            });
        };

        $scope.loadPage();

        $scope.$on("vps.tabs.summary.refresh", function () {
            $scope.loadPage(true);
        });

        function completeSummaryOptionsStatus (summary) {

            // Because Play backend is deprecated, getting the released option status
            // here and dynamically adding the missing property to the
            // existing summary data model

            var optionsStatus = [];
            if (summary.ftpBackup.optionActivated) {
                optionsStatus.push(Vps.getOptionStatus("ftpbackup"));
            }

            if (summary.snapshot.optionActivated) {
                optionsStatus.push(Vps.getOptionStatus("snapshot"));
            }

            if (summary.veeamActivated) {
                optionsStatus.push(Vps.getOptionStatus(summary.veeamType));
            }

            if (summary.windowsActivated) {
                optionsStatus.push(Vps.getOptionStatus("windows"));
            }

            return $q.all(optionsStatus).then(function (responses) {

                angular.forEach(responses, function (r) {

                    switch (r.option) {
                    case "ftpbackup":
                        summary.ftpBackup.optionReleased = r.state === "released";
                        break;
                    case "snapshot":
                        summary.snapshot.optionReleased = r.state === "released";
                        break;
                    case "veeam":
                    case "automatedBackup":
                        summary.veeamReleased = r.state === "released";
                        break;
                    case "windows":
                        summary.windowsReleased = r.state === "released";
                        break;
                }
                });
            });
        }
    }

]);
