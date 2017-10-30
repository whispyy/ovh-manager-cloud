angular.module("managerApp").controller("VpsCtrl", [
    "$scope",
    "$rootScope",
    "$filter",
    "$q",
    "$log",
    "Module.vps.services.Vps",
    "User",
    "$timeout",
    "CloudMessage",
    "Polling",
    "constants",
    "STOP_NOTIFICATION_USER_PREF",
    "$translate",
    "Module.vps.services.Notification",
    function ($scope, $rootScope, $filter, $q, $log, Vps, User, $timeout, CloudMessage, Polling, constants, STOP_NOTIFICATION_USER_PREF, $translate, Notification) {
        "use strict";

        var vpsPollingTasksInitialized = false;

        $scope.viewMode = "expert";
        $scope.alertId = "vps_information_alert";
        $scope.alertIdSummary = "vps_information_alert";
        $scope.alertIdVeeam = "vps_veeam_alert";
        $scope.loadingVPSInformations = true;
        $scope.loadingVPSMonitoring = false;
        $scope.loadingVPSError = false;
        $scope.loadingVPSMonitoringError = false;
        $scope.loadingVPSStatus = false;
        $scope.message = null;

        $scope.loaders = {
            autoRenew: true,
            ipV6: true
        };

        $scope.stepPath = "";
        $scope.currentAction = null;

        $scope.alerts = {
            dashboard: "vps_alert_dashboard"
        };

        $scope.stopNotification = {
            autoRenew: true,
            ipV6: true
        };

        $scope.autoRenew = null;
        $scope.autoRenewable = false;
        $scope.autoRenewGuide = null;
        $scope.hasPaymentMean = false;

        $scope.worldPart =  constants.target;

        $scope.reloadVps = function () {
            $scope.loadingVPSInformations = true;
            $scope.loadingVPSMonitoring = false;
            $scope.loadingVPSError = false;
            $scope.loadingVPSMonitoringError = false;
            $scope.message = null;
            $scope.loadVps();
        };

        $scope.$on("vps.dashboard.refresh", function () {
            $scope.loadVps();
        });

        $scope.$on("vps.dashboard.vpsonly.refresh", function () {
            $scope.loadVpsOnly();
        });

        $scope.refreshVpsStatus = function () {
            $scope.loadingVPSStatus = true;
            $scope.loadVpsOnly();
            loadIps();
        };

        $scope.loadVpsOnly = function () {
            return Vps.getSelected(true).then(
                    function (vps) {
                        var expiration = moment.utc(vps.expiration);
                        vps.expiration = moment([expiration.year(), expiration.month(), expiration.date()]).toDate();

                        vps.ipv6Gateway = _.get($scope, "vps.ipv6Gateway"); //If an old value is present, we preserve it in case loadIPs is not called after.  
                        $scope.vps = vps;
                        $scope.loadingVPSInformations = false;
                        $scope.loadingVPSStatus = false;
                        $scope.iconDistribution = vps.distribution ? "icon-" + vps.distribution.distribution : "";
                        $scope.iconLocationCountry = vps.location ? "icon-" + vps.location.country : "";

                        if (vps.isExpired) {
                            $scope.setMessage($scope.tr("common_service_expired", [vps.name]));
                        } else if (vps.messages.length > 0) {
                            $scope.setMessage($scope.tr("vps_dashboard_loading_error"), vps);
                        }
                        return vps;
                    }
                );
        };

        function loadIps () {
            return Vps.getIps().then(function (ips) {
                $scope.vps.ips = ips.results;
                $scope.vps.ipv6Gateway = _.get(_.find(ips.results, { version: "v6" }), "gateway");
            });
        }

        $scope.loadVps = function () {
            function loadVpsAndMonitoring () {
                return $scope.loadVpsOnly()
                    .then(function () {
                        $scope.loadingVPSMonitoring = true;
                        $scope.loadingVPSMonitoringError = false;
                    })
                    ["catch"](function () {
                        $scope.loadingVPSInformations = false;
                        $scope.loadingVPSError = true;
                        $scope.setMessage($scope.tr("vps_dashboard_loading_error"));
                    })
                    .then(function () {
                        if (!$scope.vps.isExpired) {
                            return Vps.getMonitoring("lastweek");
                        }
                    })
                    .then(function (vpsMonitoring) {
                        if (vpsMonitoring) {
                            $scope.vps.monitoring = vpsMonitoring;
                            setVpsNetworkMonitoringChartOptions();
                        }
                        $scope.loadingVPSMonitoring = false;
                        $scope.loadingVPSMonitoringError = false;
                    })
                    ["catch"](function () {
                        // vpsMonitoring data contains error and graph can't be generated
                        $scope.setMessage($scope.tr("vps_dashboard_loading_error_monitoring"));
                        $scope.loadingVPSMonitoring = false;
                        $scope.loadingVPSMonitoringError = true;
                    });
            }

            vpsPollingTasksInitialized = false;
            return $q.allSettled([
                loadVpsAndMonitoring(),
                getTaskInProgress(),
                loadIps()
            ]);
        };

        function setVpsNetworkMonitoringChartOptions () {
            var d = moment($scope.vps.monitoring.netRx.pointStart, "YYYY-MM-DDTHH:mm:dd.SSSZZ").toDate(),
                offset = d.getTimezoneOffset() * 60000,
                colors = {
                    netRx: "#F4BA4D",
                    netTx: "#3D92B1"
                };

            $scope.chartOptions = {
                chart: {
                    renderTo: "vpsNetworkMonitoringChart",
                    height: 110
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: "",
                    x: -20 //center
                },
                subtitle: {
                    x: -20
                },
                xAxis: {
                    lineWidth: 1,
                    title: null,
                    type: "datetime",
                    gridLineWidth: 0,
                    showFirstLabel: false,
                    minorGridLineWidth: 0,
                    minorTickLength: 0,
                    tickLength: 0,
                    labels: {
                        formatter: function () {
                            return $filter("date")(new Date(this.value + offset), "dd/MM");
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: null,
                    lineWidth: 1,
                    type: "linear",
                    gridLineWidth: 0,
                    minorGridLineWidth: 0,
                    minorTickLength: 0,
                    tickLength: 0,
                    labels: {
                        enabled: false
                    }
                },
                tooltip: {
                    crosshairs: true,
                    shared: true,
                    valueDecimals: 2,
                    formatter: function () {
                        var text = $filter("date")(new Date(this.points[0].x + offset), "dd/MM - HH:mm:ss") + "<br/>",
                            points = this.points;
                        angular.forEach(points, function (point, index) {
                            text += "<span style='color: " + point.series.color + "; font-weight: bold;'>" + point.series.name + "</span> : " + point.point.y.toFixed(2) + " " + point.point.unit;
                            if (index !== points.length - 1) {
                                text += "<br />";
                            }
                        });
                        return text;
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    line: {
                        marker: {
                            enabled: false
                        }
                    },
                    series: {
                        pointInterval: $scope.vps.monitoring.netRx.pointInterval.millis,
                        pointStart: Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
                    }
                },
                series: [{
                    data: $scope.vps.monitoring.netRx.values[0].points,
                    name: $scope.i18n.vps_monitoring_network_netRx,
                    color: colors.netRx
                }, {
                    data: $scope.vps.monitoring.netTx.values[0].points,
                    name: $scope.i18n.vps_monitoring_network_netTx,
                    color: colors.netTx
                }]
            };
        }

        $scope.resetAction = function (noAction) {
            if (noAction !== true) {
                $scope.setAction(false);
            }
        };

        $scope.$on("$locationChangeStart", function () {
            $scope.resetAction();
        });

        $scope.setMessage = function (message, data) {
            var messageToSend = message, i = 0,
                messagesFiltered = [];
            $scope.alertType = "";
            if (data) {
                if (data.message) {
                    messageToSend += " (" + data.message + ")";
                    switch (data.type) {
                    case "ERROR" :
                        $scope.alertType = "alert-error";
                        break;
                    case "WARNING" :
                        $scope.alertType = "alert";
                        break;
                    case "INFO" :
                        $scope.alertType = "alert-success";
                        break;
                }
                } else if (data.messages) {
                    if (data.messages.length > 0) {
                        switch (data.state) {
                        case "ERROR" :
                            $scope.alertType = "alert-error";
                            break;
                        case "PARTIAL" :
                            $scope.alertType = "alert";
                            break;
                        case "OK" :
                            $scope.alertType = "alert-success";
                            break;
                    }
                        messagesFiltered = $.grep(data.messages, function (e) {
                            return e.type && e.type !== "INFO";
                        });
                        if (messagesFiltered.length > 0) {
                            messageToSend += " (";
                            for (i; i < messagesFiltered.length; i++) {
                                messageToSend += messagesFiltered[i].id + " : " + messagesFiltered[i].message + (messagesFiltered.length === (i + 1) ? ")" : ", ");
                            }
                        }
                    }
                } else if (data.idTask && data.state) {
                    switch (data.state) {
                    case "BLOCKED":
                    case "blocked":
                    case "CANCELLED":
                    case "cancelled":
                    case "PAUSED":
                    case "paused":
                    case "ERROR":
                    case "error":
                        $scope.alertType = "alert-error";
                        break;
                    case "WAITING_ACK":
                    case "waitingAck":
                    case "DOING":
                    case "doing":
                        $scope.alertType = "alert";
                        break;
                    case "TODO":
                    case "todo":
                    case "DONE":
                    case "done":
                        $scope.alertType = "alert-success";
                        break;
                }
                } else if (data === "true") {
                    $scope.alertType = "alert-success";
                }
            }
            $scope.message = messageToSend;
        };

        $scope.setAction = function (action, data, large) {
            $scope.currentAction = action;
            $scope.currentActionData = data;
            $scope.currentActionLargeModal = large;
            if ($scope.currentAction) {
                $scope.stepPath = "vps/" + $scope.currentAction + ".html";
                $("#currentAction").modal({
                    keyboard: false,
                    backdrop: "static"
                });
            } else {
                $("#currentAction").modal("hide");
                $timeout(function () {
                    $scope.stepPath = "";
                }, 300);
            }
        };

        $scope.updateSlaMonitoringState = function (newState) {
            Vps.getTaskInError().then(function (tasks) {
                updateSlaMonitoringState(newState, tasks);
            }, function (tasks) {
                updateSlaMonitoringState(newState, tasks);
            });
        };

        function updateSlaMonitoringState (newState, tasks) {
            if (!tasks || !tasks.length) {
                Vps.update({ slaMonitoring: newState }).then(function (data) {
                    getTaskSlaMonitoringInProgress();
                    CloudMessage.success($scope.tr("vps_configuration_monitoring_sla_ok_" + newState), data, $scope.alerts.dashboard);
                }, function (data) {
                    $scope.vps.slaMonitoring = !newState;
                    CloudMessage.error($scope.tr("vps_configuration_monitoring_sla_error_" + newState), data.data, $scope.alerts.dashboard);
                });
            } else {
                CloudMessage.error($scope.tr("vps_configuration_polling_fail"), "ERROR", $scope.alertId);
            }
        }

        $scope.showAlertNetboot = function () {
            CloudMessage.warning($scope.tr("vps_configuration_reinitpassword_fail_netboot", [
                $scope.reinitPasswordGuide
            ]), "WARN", $scope.alertId);
        };

        //---------- TASKS + Polling-------------

        $scope.vpsPolling = {
            rebootVm: false,
            setNetboot: false,
            setMonitoring: false,
            changeRootPassword: false,
            createSnapshot: false,
            deleteSnapshot: false,
            reinstallVm: false,
            revertSnapshot: false,
            restoreVeeamBackup: false,
            removeVeeamBackup: false,
            openConsoleAccess: false,
            getConsoleUrl: false,
            deliverVm: false,
            restoreVm: false
        };
        $scope.vpsPollingProgress = {
            rebootVm: 0,
            setNetboot: 0,
            setMonitoring: 0,
            changeRootPassword: 0,
            createSnapshot: 0,
            deleteSnapshot: 0,
            reinstallVm: 0,
            revertSnapshot: 0,
            restoreVeeamBackup: 0,
            removeVeeamBackup: 0,
            openConsoleAccess: 0,
            getConsoleUrl: 0,
            deliverVm: 0,
            restoreVm: 0
        };

        $scope.$on("$destroy", function () {
            Polling.addKilledScope();
        });

        $scope.getPollingActivity = function () {
            return _.contains($scope.vpsPolling, true) || !vpsPollingTasksInitialized;
        };

        //-----------------------TASK-----------------------

        //Because put no return task
        function getTaskSlaMonitoringInProgress () {
            return Vps.getTaskInProgress("SET_MONITORING").then(function (taskTab) {
                if (taskTab.length > 0) {
                    $scope.$broadcast("vps.TASK.polling", taskTab[0]);
                }
            });
        }

        //Get tasks in progress.
        function getTaskInProgress () {
            Vps.getTaskInProgress("")
                .then(function (taskTab) {
                    angular.forEach(taskTab, function (task) {
                        $scope.$broadcast("vps.TASK.polling", task);
                    });
                })
                ["finally"](function () {
                    vpsPollingTasksInitialized = true;
                });
        }

        // If vps_dashboard_task_" + taskName + not exist, polling is not started for this task
        $scope.$on("vps.TASK.polling", function (e, task) {
            if (!task || !task.id || task.notIdTask) {
                getTaskInProgress(); //netboot was be changed
            }else {
                var taskName = task["function"] || task.type;
                if ($scope.i18n["vps_dashboard_task_" + taskName]) {
                    $scope.vpsPollingProgress[taskName] = 0;
                    $scope.vpsPolling[taskName] = true;
                    startPoll(task);
                }
            }
        });

        function startPoll (task) {
            var taskName = task["function"] || task.type;
            getAddTaskFast(task).then(function (state) {
                $scope.vpsPollingProgress[taskName] = state.task.progress;
                if (Polling.isResolve(state)) {
                    $scope.vpsPolling[taskName] = false;
                    launchBroadcast(taskName);
                    if ($scope.i18n["vps_configuration_" + taskName + "_polling_done"]) {
                        CloudMessage.success($scope.tr("vps_configuration_" + taskName + "_polling_done", $scope.vps.name), true, $scope.alertId);
                    }
                } else {
                    startPoll(task);
                }
            }, function (data) {
                $scope.vpsPolling[taskName] = false;
                if ($scope.i18n["vps_configuration_" + taskName + "_polling_fail"]) {
                    CloudMessage.error($scope.tr("vps_configuration_" + taskName + "_polling_fail"), data, $scope.alertId);
                }
            });
        }

        //If task can take long time to be resolved, use addTask
        function getAddTaskFast (task) {
            var taskName = task["function"] || task.type;

            switch (taskName){
            case "restoreVeeamBackup" :
            case "reinstallVm":
            case "deliverVm":
            case "restoreVm":
                return Vps.addTask(task, $scope.$id);
        }

            return Vps.addTaskFast(task, $scope.$id);
        }

        function launchBroadcast (taskFunction) {
            switch (taskFunction){
            case "setMonitoring" :
            case "reinstallVm":
            case "deliverVm":
            case "setNetboot" :
                $scope.$broadcast("vps.dashboard.refresh");
                break;
            case "createSnapshot" :
            case "deleteSnapshot" :
            case "revertSnapshot" :
                $rootScope.$broadcast("vps.tabs.summary.refresh");
                break;
            case "restoreVeeamBackup" :
            case "removeVeeamBackup" :
            case "restoreVm" :
                $rootScope.$broadcast("Vps.events.tabVeeamChanged");
                break;
        }
        }

        $scope.editDisplayName = function () {
            $scope.newDisplayName = $scope.vps.displayName;
            $scope.editMode = true;
        };

        $scope.resetDisplayName = function () {
            $timeout(function () {
                $scope.editMode = false;
                $scope.setMessage($scope.tr("vps_dashboard_display_name_reset"));
            }, 300);
        };

        $scope.displayNameClass = function () {
            return !$scope.newDisplayName || $scope.newDisplayName.length <= 2 ? "disabled" : "";
        };

        $scope.saveDisplayName = function () {
            if ($scope.newDisplayName && $scope.newDisplayName.length >= 2) {
                $scope.setMessage($scope.tr("vps_dashboard_action_doing"));

                var dataToSend = { "displayName": $scope.newDisplayName };
                Vps.updateDisplayName(dataToSend)
                .then(function () {
                    $scope.editMode = false;
                    $scope.setMessage($scope.tr("exchange_ACTION_configure_success"));
                    $scope.vps.displayName = $scope.newDisplayName;
                }, function (reason) {
                    $scope.editMode = false;
                    $scope.setMessage($scope.tr("exchange_ACTION_configure_error"), reason.data || "");
                });
                $scope.editMode = false;
            }
        };

        $scope.keyboardDisplayNameEvent = function (clickEvent) {
            if (clickEvent.keyCode === 13 || clickEvent.key === "Enter") {
                $scope.saveDisplayName();
            } else if (clickEvent.keyCode === 27 || clickEvent.key === "Esc") {
                $scope.resetDisplayName();
            }
        };

        $scope.getOptions = function (option) {
            if ($scope.vps && $scope.vps.availableOptions && $scope.vps.availableOptions.length) {
                return $scope.vps.availableOptions.indexOf(option) >= 0;
            }
            return false;
        };

        $scope.hasAutoRenew = function () {
            $scope.autoRenew = false;
            if (constants.NO_AUTORENEW_COUNTRIES.indexOf($scope.user.ovhSubsidiary) === -1) {
                return $q.all([Vps.getServiceInfos(), Vps.isAutoRenewable()])
                    .then(function (results) {
                        $scope.autoRenew = results[0].renew && results[0].renew.automatic;
                        $scope.autoRenewable = results[1];
                        $scope.autoRenewGuide = constants.urls[$scope.user.ovhSubsidiary].guides.autoRenew || constants.urls.FR.guides.autoRenew;
                        $scope.checkIfStopNotification("autoRenew", true, $scope.vps.name);
                    });
            }
        };

        $scope.getRescueModeButtonTitle = function () {
            return $scope.vps.netbootMode !== "RESCUE" ? $translate.instant("vps_configuration_snapshot_take_title_button") : $translate.instant("vps_configuration_reboot_rescue_warning_btn_title");
        };

        $scope.hasDiskUsageInfo = function () {
            if (!$scope.vps) {
                return false;
            }
            return $scope.vps.version !== "_2015_V_1";
        };

        $scope.init = function () {
            User.getUrlOf("changeOwner")
                .then(function (link) {
                    $scope.changeOwnerUrl = link;
                });

            $scope.loaders.autoRenew = true;
            $scope.loaders.ipV6 = true;

            $q.allSettled([
                $scope.loadVps(),
                User.getUser(),
                User.getValidPaymentMeansIds(),
                Vps.getServiceInfos()
            ])
            .then(function (data) {
                $scope.checkIfStopNotification("ipV6", true, $scope.vps.name);
                $scope.user = data[1];
                $scope.reinitPasswordGuide = constants.urls[$scope.user.ovhSubsidiary].guides.reinitPassword || constants.urls.FR.guides.reinitPassword;
                $scope.hasPaymentMean = data[2].length > 0;
                $scope.serviceInfos = data[3];
                $scope.initGuidesUrl();
                $scope.hasAutoRenew();
            })
            ["finally"](function () {
                $scope.loaders.autoRenew = false;
                $scope.loaders.ipV6 = false;
            });
        };

        $scope.checkIfStopNotification = function (message, isArray, item) {
            return Notification.checkIfStopNotification(STOP_NOTIFICATION_USER_PREF[message], isArray, item)
                .then(function (showNotification) {
                    $scope.stopNotification[message] = showNotification;
                })
                ["catch"](function (error) {
                    $scope.stopNotification[message] = false;
                    $log.error(error);
                });
        };

        $scope.stopNotificationAutoRenew = function () {
            $scope.stopNotification.autoRenew = true;
            Notification.stopNotification(STOP_NOTIFICATION_USER_PREF.autoRenew, $scope.vps.name)
                ["catch"](function (error) {
                    CloudMessage.error($scope.tr("vps_stop_bother_error"), error, $scope.alerts.dashboard);
                });
        };

        $scope.stopNotificationIpV6 = function () {
            $scope.stopNotification.ipV6 = true;
            Notification.stopNotification(STOP_NOTIFICATION_USER_PREF.ipV6, $scope.vps.name)
                ["catch"](function (error) {
                    CloudMessage.error($scope.tr("vps_stop_bother_error"), error, $scope.alerts.dashboard);
                });
        };

        $scope.showIpV6Banner = function () {
            var stillLoading = $scope.loaders.ipV6;
            var userAcknowledged = $scope.stopNotification.ipV6;
            var oldVersion = false;

            if (!stillLoading) {
                // old vps had an ipv6 but we dont want to show the message for those.
                oldVersion = _.contains($scope.vps.version, "2014") || _.contains($scope.vps.version, "2013");
            }
            return !stillLoading && !userAcknowledged && !oldVersion && $scope.vps.ipv6;
        };

        $scope.initGuidesUrl = function () {
            /* Arbitrary fallback to English */
            var fallbackLang;
            fallbackLang = "GB";

            var lang;
            try {
                // lang = translator.getSelectedAvailableLanguage().value.replace(/_\w{2}$/, "").toUpperCase();
                User.getUser().then(function(user) {
                    lang = user.ovhSubsidiary;
                });
            } catch (e) {
                lang = fallbackLang;
            }

            if (constants.urls[lang] && constants.urls[lang].guides) {
                $scope.ipv6GuideUrl = constants.urls[lang].guides.ipv6Vps;
            } else {
                $scope.ipv6GuideUrl = constants.urls[fallbackLang].guides.ipv6Vps;
            }
        };

        $scope.init();

    }

]);
