angular.module("managerApp").service("Module.vps.services.ip", function () {
    "use strict";
    var self = this;

    self.ipV6Infos = {
        numberOfGroup: 8,
        groupSize: 4
    };

    self.compressIpv6 = function (ip) {
        var out = ip.replace(/(^|\:)0{1,3}([0-9]+)/g, '$1$2');
        out = out.replace(/(^|:)0(\:0)+/, '$1:');
        out = out.replace(/\:{3,}/g, '::');
        if (out === ":") {
            out = "::";
        }
        return out;
    };

    self.expandIpv6 = function (ip) {
        //If the IP address contains :: it means that the compression replaced one or more "0000" group with ::.  We have to recreate these groups.
        var fullAddress = ip.indexOf("::") === -1 ?
                            ip :
                            self.fillIpV6MissingGroup(ip);

        var expandedAddress = "";
        var groups = fullAddress.split(":");
        for(var i=0; i < self.ipV6Infos.numberOfGroup; i++)
        {
            groups[i]  = _.padLeft(groups[i] , self.ipV6Infos.groupSize, 0);
            expandedAddress += (i !== self.ipV6Infos.numberOfGroup - 1) ? groups[i] + ":" : groups[i]; //We put back leading 0 in each ip group.  xxxx:23:xxxx becomes xxxx:0023:xxxx
        }
        return expandedAddress;
    };

    self.fillIpV6MissingGroup = function (ip) {
        var fullAddress = "";
        var sides = ip.split("::");
        var groupsPresent = 0;

        for(var i = 0; i < sides.length; i++)
        {
            groupsPresent += sides[i].split(":").length;
        }

        fullAddress += sides[0] + ":";
        for(var j = 0; i < self.ipV6Infos.numberOfGroup - groupsPresent; j++)
        {
            fullAddress += "0000:";
        }
        fullAddress += sides[1];

        return fullAddress;
    };
});