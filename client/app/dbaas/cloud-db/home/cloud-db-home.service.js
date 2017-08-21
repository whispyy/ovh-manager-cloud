class CloudDbHomeService {
    constructor ($q, ServiceHelper) {
        this.$q = $q;
        this.ServiceHelper = ServiceHelper;
    }

    getStatus () {
        return this.ServiceHelper.errorHandler("cloud_db_home_status_loading_error")({});
    }

    getAccess () {
        return this.ServiceHelper.errorHandler("cloud_db_home_access_loading_error")({});
    }

    getConfiguration () {
        return this.ServiceHelper.errorHandler("cloud_db_home_configuration_loading_error")({});
    }

    getSubscription () {
        return this.ServiceHelper.errorHandler("cloud_db_home_subscription_loading_error")({});
    }

    updateName (serviceName, newName) {
        console.log(serviceName, newName);
        return this.ServiceHelper.errorHandler("cloud_db_name_change_error")({});
    }
}

angular.module("managerApp").service("CloudDbHomeService", CloudDbHomeService);
