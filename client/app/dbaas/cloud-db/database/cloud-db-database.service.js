class CloudDbDatabaseService {
    constructor (ServiceHelper) {
        this.ServiceHelper = ServiceHelper;
    }

    addDatabase (serviceName, data) {
        return this.ServiceHelper.errorHandler("cloud_db_database_add_error")({});
    }

    saveDatabase (serviceName, databaseId, data) {
        return this.ServiceHelper.errorHandler("cloud_db_database_update_error")({});
    }

    deleteDatabase (serviceName, databaseId) {
        return this.ServiceHelper.errorHandler("cloud_db_database_delete_error")({});
    }

    getDatabase (serviceName, databaseId) {
        return this.ServiceHelper.errorHandler("cloud_db_database_loading_error")({});
    }

    getDatabases (serviceName) {
        return this.ServiceHelper.errorHandler("cloud_db_database_list_loading_error")({});
    }
}

angular.module("managerApp").service("CloudDbDatabaseService", CloudDbDatabaseService);
