class CloudDbGraphCtrl {
    constructor ($stateParams, ControllerHelper) {
        this.$stateParams = $stateParams;
        this.ControllerHelper = ControllerHelper;
    }
}

angular.module("managerApp").controller("CloudDbGraphCtrl", CloudDbGraphCtrl);
