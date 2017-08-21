class CloudDbNetworkService {
    constructor (ServiceHelper) {
        this.ServiceHelper = ServiceHelper;
    }

    addNetwork (serviceName, data) {
        return this.ServiceHelper.errorHandler("cloud_db_network_add_error")({});
    }

    saveNetwork (serviceName, networkId, data) {
        return this.ServiceHelper.errorHandler("cloud_db_network_update_error")({});
    }

    deleteNetwork (serviceName, networkId) {
        return this.ServiceHelper.errorHandler("cloud_db_network_delete_error")({});
    }

    getNetwork (serviceName, networkId) {
        return this.ServiceHelper.errorHandler("cloud_db_network_loading_error")({});
    }

    getNetworks (serviceName) {
        return this.ServiceHelper.errorHandler("cloud_db_network_list_loading_error")({});
    }
}

angular.module("managerApp").service("CloudDbNetworkService", CloudDbNetworkService);
