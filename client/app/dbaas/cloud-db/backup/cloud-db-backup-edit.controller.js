class CloudDbBackupEditCtrl {
    constructor ($q, $uibModalInstance, CloudDbBackupService, ControllerHelper, serviceName) {
        this.$q = $q;
        this.$uibModalInstance = $uibModalInstance;
        this.CloudDbBackupService = CloudDbBackupService;
        this.ControllerHelper = ControllerHelper;
        this.serviceName = serviceName;

        this.model = {
            database: {
                value: "",
                required: true
            }
        };
    }

    add () {
        if (this.form.$invalid) {
            return this.$q.reject();
        }

        this.saving = true;
        return this.CloudDbBackupService.addBackup(this.serviceName, this.extractModelValues())
            .then(response => this.$uibModalInstance.close(response))
            .catch(response => this.$uibModalInstance.dismiss(response))
            .finally(() => { this.saving = false; });
    }

    cancel () {
        this.$uibModalInstance.dismiss();
    }

    isModalLoading () {
        return this.saving;
    }

    extractModelValues () {
        return _.mapValues(this.model, modelKey => modelKey.value);
    }
}

angular.module("managerApp").controller("CloudDbBackupEditCtrl", CloudDbBackupEditCtrl);
