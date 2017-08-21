class CloudDbLogCtrl {
    constructor ($stateParams, ControllerHelper) {
        this.$stateParams = $stateParams;
        this.ControllerHelper = ControllerHelper;
    }
}

angular.module("managerApp").controller("CloudDbLogCtrl", CloudDbLogCtrl);
