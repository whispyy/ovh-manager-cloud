angular.module("managerApp")
.controller("VpsMonitoringCtrl",
['$scope', '$q', '$filter','Module.vps.services.Vps',

function ($scope,$q,$filter,Vps){
    'use strict';

    $scope.monitoring = null;
    $scope.loadingMonitoring = true;

    $scope.selectedPeriod = {period : "LASTDAY"};


    $scope.loadMonitoring = function () {
        $scope.loadingMonitoring = true;
        $scope.chartOptionsMonitoring = null;
        Vps.getMonitoring($scope.selectedPeriod.period).then(result => {
            $scope.monitoring = result;
            setTraficMonitoring();
        }).catch(err => {
            $scope.resetAction();
            $scope.setMessage($scope.tr('vps_configuration_monitoring_fail'), err);
        }).finally(() => {
            $scope.loadingMonitoring = false;
        });

    };

    function setTraficMonitoring () {
        var d = moment($scope.monitoring.netRx.pointStart, 'YYYY-MM-DDTHH:mm:dd.SSSZZ').toDate(),
            offset = d.getTimezoneOffset() * 60000,
            colors = {
                netRx : '#F4BA4D',
                netTx : '#3D92B1'
            };

        $scope.chartOptionsMonitoring = {
            chart: {
                renderTo: 'monitoringTRAFICLoadChart',
                height: 120
            },
            credits: {
                enabled: false
            },
            title: {
                text : '',
                x: -20 //center
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top'
            },
            xAxis: {
                title: null,
                type: 'datetime'
            },
            yAxis: {
                title: null,
                showFirstLabel: false,
                gridLineWidth: 1,
                minorGridLineWidth: 2,
                lineColor: '#DDDDDD',
                min: 0,
                labels : {
                    formatter: function () {
                        return this.value + ' ' + $scope.monitoring.netTx.values[0].points[0].unit;
                    }
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true,
                valueDecimals: 2,
                formatter: function () {
                    var text = $filter('date')(new Date(this.points[0].x + offset), 'dd/MM - HH:mm:ss') + '<br/>',
                        points = this.points;
                    angular.forEach(points, function (point, index) {
                        text += '<span style="color: ' + point.series.color + '; font-weight: bold;">' + point.series.name + '</span> : ' + point.point.y.toFixed(2) + ' ' + point.point.unit;
                        if (index !== points.length - 1) {
                            text += '<br />';
                        }
                    });
                    return text;
                }
            },
            plotOptions: {
                area: {
                    allowPointSelect : false,
                    dataLabel: {
                        enabled: false
                    },
                    stacking: 'normal',
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                },
                series: {
                    pointInterval: $scope.monitoring.netRx.pointInterval.millis,
                    pointStart: Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
                }
            },
            series: [{
                data : $scope.monitoring.netRx.values[0].points,
                name : $scope.i18n.vps_monitoring_network_netRx,
                color : colors.netRx
            }, {
                data : $scope.monitoring.netTx.values[0].points,
                name : $scope.i18n.vps_monitoring_network_netTx,
                color : colors.netTx
            }]
        };
    }

}]);
