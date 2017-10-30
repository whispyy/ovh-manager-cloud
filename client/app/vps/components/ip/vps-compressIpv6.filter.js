angular.module("managerApp").filter("compressIpv6", ["Module.vps.services.ip", function (ipService) {
    "use strict";
    return function (ip) {
        if (!ip) {
            return;
        }

        return ipService.compressIpv6(ip);
    };
}]);
