class DeleteModalCtrl {
    constructor ($uibModalInstance, params, ControllerHelper) {
        this.$uibModalInstance = $uibModalInstance;

        this.params = params;
        this.ControllerHelper = ControllerHelper;
    }

    confirm () {
        this.saving = true;

        return this.params.onDelete()
            .then(response => this.$uibModalInstance.close(response))
            .catch(response => this.$uibModalInstance.dismiss(response))
            .finally(() => {
                this.saving = false;
            });
    }

    cancel () {
        this.$uibModalInstance.dismiss();
    }

    isModalLoading () {
        return this.saving;
    }
}

angular.module("managerApp").controller("DeleteModalCtrl", DeleteModalCtrl);
