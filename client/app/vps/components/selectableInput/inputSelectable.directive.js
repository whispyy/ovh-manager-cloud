angular.module("managerApp").directive("inputSelectable", function () {
    "use strict";

    return {
        restrict: "E",
        replace: true,
        scope: {
            ngModel: "=",
            ngReadonly: "=",
            ngValue: "=",
            id: "@"
        },
        template: '<input class="input-selectable" type="text" data-tooltip="Ctrl+C" data-tooltip-trigger="focus">',
        link: function (scope, elem) {
            if (scope.id) {
                elem.attr("id", scope.id);
            }
            elem.on("focus", function () {
                this.select();
            });
        }
    };
});
