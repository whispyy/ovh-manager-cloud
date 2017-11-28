class HomeCtrl {
    constructor ($translate, ovhDocUrl) {
        this.$translate = $translate;
        this.ovhDocUrl = ovhDocUrl;
    }

    $onInit () {
        this.guides = {
            title: this.$translate.instant(""),
            list: [{
                name: this.$translate.instant(""),
                url: this.ovhDocUrl.getDocUrl("cloud/")
            }],
            footer: this.$translate.instant("")
        };
    }
}

angular.module("managerApp").controller("HomeCtrl", HomeCtrl);
