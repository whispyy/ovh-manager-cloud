class CloudDbUserService {
    constructor (ServiceHelper) {
        this.ServiceHelper = ServiceHelper;
    }

    addUser (serviceName, data) {
        return this.ServiceHelper.errorHandler("cloud_db_user_add_error")({});
    }

    saveUser (serviceName, userId, data) {
        return this.ServiceHelper.errorHandler("cloud_db_user_update_error")({});
    }

    deleteUser (serviceName, userId) {
        return this.ServiceHelper.errorHandler("cloud_db_user_delete_error")({});
    }

    getUser (serviceName, userId) {
        return this.ServiceHelper.errorHandler("cloud_db_user_loading_error")({});
    }

    getUsers (serviceName) {
        return this.ServiceHelper.errorHandler("cloud_db_user_list_loading_error")({});
    }
}

angular.module("managerApp").service("CloudDbUserService", CloudDbUserService);
