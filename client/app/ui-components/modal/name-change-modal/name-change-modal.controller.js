class NameChangeModalCtrl {
    constructor ($uibModalInstance, params, ControllerHelper) {
        this.$uibModalInstance = $uibModalInstance;

        this.params = params;
        this.ControllerHelper = ControllerHelper;
    }

    $onInit () {
        this.serviceName = this.params.serviceName;

        this.model = {
            displayName: {
                value: null,
                maxlength: this.params.maxlength || Infinity
            }
        };

        this.model.displayName.value = this.params.displayName;
    }

    confirm () {
        this.saving = true;

        return this.params.onSave(this.model.displayName.value, this.serviceName)
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

angular.module("managerApp").controller("NameChangeModalCtrl", NameChangeModalCtrl);