class CloudDbBackupService {
    constructor (ServiceHelper) {
        this.ServiceHelper = ServiceHelper;
    }

    addBackup (serviceName, data) {
        //cloud_db_backup_add_error
        return this.ServiceHelper.errorHandler("cloud_db_backup_add_error")({});
    }

    restoreBackup (serviceName, backupId) {
        //cloud_db_backup_restore_sucess
        return this.ServiceHelper.errorHandler("cloud_db_backup_restore_error")({});
    }

    deleteBackup (serviceName, backupId) {
        return this.ServiceHelper.errorHandler("cloud_db_backup_delete_error")({});
    }

    getBackup (serviceName, backupId) {
        return this.ServiceHelper.errorHandler("cloud_db_backup_loading_error")({});
    }

    getBackups (serviceName) {
        return this.ServiceHelper.errorHandler("cloud_db_backup_list_loading_error")({});
    }
}

angular.module("managerApp").service("CloudDbBackupService", CloudDbBackupService);
