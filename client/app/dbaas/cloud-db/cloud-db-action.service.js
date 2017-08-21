class CloudDbActionService {
    constructor (ControllerHelper) {
        this.ControllerHelper = ControllerHelper;
    }

    showBackupEditModal (serviceName) {
        this.ControllerHelper.modal.showModal({
            modalConfig: {
                templateUrl: "app/dbaas/cloud-db/backup/cloud-db-backup-edit.html",
                controller: "CloudDbBackupEditCtrl",
                controllerAs: "$ctrl",
                resolve: {
                    serviceName: () => serviceName
                }
            }
        });
    }

    showNetworkEditModal (serviceName, networkId) {
        this.ControllerHelper.modal.showModal({
            modalConfig: {
                templateUrl: "app/dbaas/cloud-db/network/cloud-db-network-edit.html",
                controller: "CloudDbNetworkEditCtrl",
                controllerAs: "$ctrl",
                resolve: {
                    serviceName: () => serviceName,
                    networkId: () => networkId
                }
            }
        });
    }

    showDatabasePreviewModal (serviceName, database) {
        this.ControllerHelper.modal.showModal({
            modalConfig: {
                templateUrl: "app/dbaas/cloud-db/database/cloud-db-database-preview.html",
                controller: "CloudDbDatabasePreviewCtrl",
                controllerAs: "$ctrl",
                resolve: {
                    database: () => database
                }
            }
        });
    }

    showUserPreviewModal (serviceName, user) {
        this.ControllerHelper.modal.showModal({
            modalConfig: {
                templateUrl: "app/dbaas/cloud-db/user/cloud-db-user-preview.html",
                controller: "CloudDbUserPreviewCtrl",
                controllerAs: "$ctrl",
                resolve: {
                    user: () => user
                }
            }
        });
    }
}

angular.module("managerApp").service("CloudDbActionService", CloudDbActionService);
