angular.module('managerApp').directive('miniChart', ['$timeout', '$filter', '$translate', function ($timeout, $filter, $translate) {
    'use strict';

    return {
        restrict: 'A',
        scope: {
            data: '=chartdata'
        },
        link: function ($scope, $elm, $attr) {
            var chart = null;
            //1px solid #DBDBDB
            function createChart() {
                
                Highcharts.setOptions({
                    lang: {
                        resetZoom: 'Réinitialiser zoom',
                        thousandsSep: " ",
                        months: [$translate.instant('januar'), $translate.instant('frebruar'), $translate.instant('march'), $translate.instant('april'), $translate.instant('may'), $translate.instant('june'), $translate.instant('jully'), $translate.instant('august'), $translate.instant('september'), $translate.instant('october'), $translate.instant('november'), $translate.instant('december')],
                        shortMonths: [$translate.instant('januar_short'), $translate.instant('frebruar_short'), $translate.instant('march_short'), $translate.instant('april_short'), $translate.instant('may_short'), $translate.instant('june_short'), $translate.instant('jully_short'), $translate.instant('august_short'), $translate.instant('september_short'), $translate.instant('october_short'), $translate.instant('november_short'), $translate.instant('december_short')]
                    }
                });
               
                var d = moment($scope.data.pointStart, 'YYYY-MM-DDTHH:mm:dd.SSSZZ').toDate(), 
                    offset = d.getTimezoneOffset() * 60000,
                    chartOptions = {
                        chart: {
                            renderTo: $attr.id,
                            type: 'line',
                            className: 'mini-charts',
                            height: 110
                        },
                        title : {
                            text : ''
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            line: {
                                allowPointSelect : true,
                                lineColor: '#3D92B1',
                                color: '#D0D0D0',
                                dataLabel: {
                                    enabled: false
                                },
                                marker: {
                                    enabled: false,
                                    fillColor: '#4EA3C2',
                                    states: {
                                        hover: {
                                            enabled: true
                                        }
                                    }
                                }
                            },
                            series: {
                                pointInterval: $scope.data.pointInterval.millis,
                                pointStart: Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
                            }
                        },
                        xAxis : {
                            lineWidth: 1,
                            title: null,
                            type: 'datetime',
                            gridLineWidth: 0,
                            showFirstLabel: false,
                            minorGridLineWidth: 0,
                            minorTickLength: 0,
                            tickLength: 0,
                            labels : {
                                formatter : function () {
                                    return $filter('date')(new Date(this.value + offset), 'dd/MM');
                                }
                            }
                        },
                        tooltip : {
                            formatter: function () {
                                var text = $filter('date')(new Date(this.x + offset), 'dd/MM - HH:mm:ss') + '<br/>' + this.y + ' %';
                                if(_.has(this.point.max, "unit") && _.has(this.point.used, "unit")) {
                                    text += '<br/>' + this.point.used.value + ' ' + $translate.instant('unit_size_' + this.point.used.unit);
                                    text += ' / ' + this.point.max.value + ' ' + $translate.instant('unit_size_' + this.point.max.unit);
                                }
                                return text;
                            }
                        },
                        yAxis: {
                            title: null,
                            lineWidth: 1,
                            type : 'linear',
                            gridLineWidth: 0,
                            minorGridLineWidth: 0,
                            minorTickLength: 0,
                            tickLength: 0,
                            labels: {
                                enabled: false
                            },
                            min: 0,
                            max: 100
                        },
                        credits: {
                            enabled: false
                        },
                        series: []
                    };

                angular.forEach($scope.data.values, function (serie) {
                    chartOptions.series.push({
                        data: serie.points,
                        showInLegend : false
                    });
                });

                chart = new Highcharts.Chart(chartOptions);
            }

            $scope.$watch('data', function (newData) {
                $timeout(function () {
                    if (newData) {
                        if (chart === null) {
                            createChart();
                        }
                    }
                }, 5, true);
            });
        }
    };
}]);
