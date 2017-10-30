angular.module("managerApp").directive('autofocus', ['$interval', function ($interval) {
    "use strict";
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            var delay = parseInt($attrs.autofocus, 10) || 0,
                interval = $interval(function () {
                    $element[0].focus();
                }, delay);

            $scope.$on('$destroy', function () {
                $interval.cancel(interval);
            });
        }
    };
}]);
