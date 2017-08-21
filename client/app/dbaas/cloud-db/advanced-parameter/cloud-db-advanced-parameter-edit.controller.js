class CloudDbAdvancedParameterEditCtrl {
    constructor ($stateParams, CloudNavigation, ControllerHelper) {
        this.$stateParams = $stateParams;
        this.CloudNavigation = CloudNavigation;
        this.ControllerHelper = ControllerHelper;
    }

    $onInit () {
        this.previousState = this.CloudNavigation.getPreviousState();
    }
}

angular.module("managerApp").controller("CloudDbAdvancedParameterEditCtrl", CloudDbAdvancedParameterEditCtrl);
