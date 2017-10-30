angular.module("managerApp")
.controller("VpsReinstallCtrl",
['$scope', 'Module.vps.services.Vps','Alerter', 'User', 'Distribution', 'constants',

function ($scope,Vps,Alerter, User, Distribution){
    'use strict';

    var offerType = $scope.currentActionData;

    $scope.loader = {
        loading: false
    };

    $scope.selectedTemplate = {
        value : null,
        language: null,
        softwares: [],
        sshKeys: [],
        sendPassword: true
    };

    $scope.$watch('selectedTemplate.value', function () {
        if($scope.selectedTemplate.value) {
            if($scope.selectedTemplate.value.availableLanguage.indexOf($scope.selectedTemplate.language) === -1) {
                $scope.selectedTemplate.language = null;
            }
            $scope.selectedTemplate.softwares = [];
            loadPackages($scope.selectedTemplate.value.distribution);
        }
    }, true);

//    $scope.$watch('selectedTemplate.softwares', function (newValue, oldValue) {
//        if($scope.selectedTemplate.softwares) {
//            var newTypes = {}, filterNeeded = false, currentTypes = {};
//            angular.forEach(newValue, function (soft) {
//                if(newTypes[soft.type] === undefined || newTypes[soft.type] === null) {
//                    newTypes[soft.type] = 0;
//                }
//                newTypes[soft.type]++;
//            });
//
//            filterNeeded = _.some(newTypes, function (element) {
//                return element > 1;
//            });
//            if(filterNeeded) {
//                angular.forEach(oldValue, function (soft) {
//                    if(currentTypes[soft.type] === undefined || currentTypes[soft.type] === null) {
//                        currentTypes[soft.type] = soft;
//                    }
//                });
//
//                angular.forEach(newValue, function (soft) {
//                    if(newTypes[soft.type] > 1) {
//                        var index = _.findIndex($scope.selectedTemplate.softwares, {id: currentTypes[soft.type].id});
//                        if(index !== -1) {
//                            $scope.selectedTemplate.softwares.splice(index, 1);
//                        }
//                    }
//                });
//            }
//        }
//    }, true);

    $scope.isWindows = function(os){
        return os && /Windows/.test(os.name);
    };

    $scope.getSoftwareLabel = function (soft) {
        var result = soft.name;
        if(soft.status !== 'STABLE') {
            result += ' (' + $scope.tr('vps_configuration_reinstall_step2_software_status_' + soft.status) + ')';
        }
        return result;
    };

    $scope.getSoftwareSummaryList = function () {
        var names = [];
        if($scope.selectedTemplate.database){
            names.push($scope.selectedTemplate.database.name);
        }
        if($scope.selectedTemplate.webserver) {
            names.push($scope.selectedTemplate.webserver.name);
        }
        if( $scope.selectedTemplate.environment) {
            names.push($scope.selectedTemplate.environment.name);
        }
        return names.join(', ');
    };

    function loadSshKeys () {
        $scope.loadingSshKeys = true;

        User.getSshKeys().then(function(sshKeys) {
            $scope.UserSshKeys = sshKeys;
            $scope.loadingSshKeys = false;
        }, function() {
            $scope.resetAction();
            $scope.loadingSshKeys = false;
            Alerter.alertFromSWS($scope.tr('vps_configuration_reinstall_loading_sshKeys_error'), 'ERROR', $scope.alertId);
        });
    }

    function loadSummary () {
        Vps.getTabSummary(true).then(function(summary) {
            $scope.summary = summary;
        }, function() {
            $scope.resetAction();
            Alerter.alertFromSWS($scope.tr('vps_configuration_reinstall_loading_summary_error'), 'ERROR', $scope.alertId);
        });
    }

    function loadPackages (distribution) {
        var lastLoad = new Date();
        $scope.loadingPackages = lastLoad;
        Distribution.getPackages("vps", distribution).then(function(response) {
            if ($scope.loadingPackages === lastLoad)
            {
                $scope.selectedTemplate.packages = filterKernel(response.packages);
                $scope.loadingPackages = false;
            }
        }, function () {
            if ($scope.loadingPackages === lastLoad)
            {
                $scope.loadingPackages = false;
                $scope.resetAction();
                Alerter.alertFromSWS($scope.tr("vps_configuration_reinstall_loading_summary_error"), "ERROR", $scope.alertId);
            }
        });
    }

    function filterKernel(packages) {
        // Classic VPS are OpenVZ based so they don't have Kernel.
        if (offerType.toLowerCase() !== "classic") {
            return packages;
        }

        return _.filter(packages, function(pkg) {
            return !_.includes((pkg.name + pkg.alias).toLowerCase(), "kernel");
        });
    }

    $scope.getOptions = function (option) {
        if ($scope.vps && $scope.vps.availableOptions && $scope.vps.availableOptions.length) {
            return $scope.vps.availableOptions.indexOf(option) >= 0;
        }
        return false;
    };

    $scope.loadCheck = function () {
        $scope.loadingTemplates = true;

        loadSummary();
        loadSshKeys();

        Vps.getTaskInError().then(function (tasks){
            loadTemplates(tasks);
        }, function (tasks){
            loadTemplates(tasks);
        });
    };

    function loadTemplates (tasks) {
        $scope.selectedTemplate.language = null;
        if (!tasks || !tasks.length){
            if (!$scope.templates) {
                $scope.templates = null;
                Vps.getTemplates().then(function (data) {
                    $scope.templates = data.results;
                    $scope.loadingTemplates = false;
                }, function () {
                    $scope.loadingTemplates = false;
                });
            } else {
                $scope.loadingTemplates = false;
            }
        } else {
            $scope.resetAction();
            $scope.loadingTemplates = false;
            Alerter.alertFromSWS($scope.tr('vps_configuration_polling_fail'), 'ERROR', $scope.alertId);
        }
    }

    $scope.getSelectedLanguage = function () {
        if($scope.selectedTemplate.value) {
            return $scope.selectedTemplate.value.availableLanguage.length > 1 ? $scope.selectedTemplate.language : $scope.selectedTemplate.value.locale;
        }
    };

    $scope.reinstall = function () {
        $scope.loader.loading = true;

        var softIds = [];

        if($scope.selectedTemplate.database){
            softIds.push($scope.selectedTemplate.database.id);
        }
        if($scope.selectedTemplate.webserver) {
            softIds.push($scope.selectedTemplate.webserver.id);
        }
        if($scope.selectedTemplate.environment) {
            softIds.push($scope.selectedTemplate.environment.id);
        }

        Vps.reinstall(
                $scope.selectedTemplate.value.idTemplate,
                $scope.getSelectedLanguage(),
                softIds,
                $scope.selectedTemplate.sshKeys,
                ($scope.selectedTemplate.sendPassword ? 0 : 1)
                ).then(function () {
            $scope.resetAction();
            $scope.loader.loading = false;
            Alerter.alertFromSWS($scope.tr('vps_configuration_reinstall_success', $scope.vps.name), true, $scope.alertId);
        }, function (data) {
            $scope.resetAction();
            $scope.loader.loading = false;
            Alerter.alertFromSWS($scope.tr('vps_configuration_reinstall_fail'), data, $scope.alertId);
        });
    };

    $scope.getLanguageTraduction = function (x) {
        return $scope.tr('language_' + x);
    };
}

]);
