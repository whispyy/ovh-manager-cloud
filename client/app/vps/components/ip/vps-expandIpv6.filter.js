angular.module("managerApp").filter("expandIpv6", ["Module.vps.services.ip", function (ipService) {
    "use strict";
    return function (ip) {
        if (!ip) {
            return;
        }

        return ipService.expandIpv6(ip);
    };
}]);
