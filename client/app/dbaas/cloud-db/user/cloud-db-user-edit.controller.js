class CloudDbUserEditCtrl {
    constructor ($q, $stateParams, CloudDbUserService, CloudMessage, CloudNavigation, ControllerHelper) {
        this.$q = $q;
        this.$stateParams = $stateParams;
        this.CloudDbUserService = CloudDbUserService;
        this.CloudMessage = CloudMessage;
        this.CloudNavigation = CloudNavigation;
        this.ControllerHelper = ControllerHelper;
        this.serviceName = this.$stateParams.serviceName;
        this.userId = this.$stateParams.userId;

        this.initModel();

        this.user = this.ControllerHelper.request.getHashLoader({
            loaderFunction: () => this.isInEdition() ? this.CloudDbUserService.getUser(this.serviceName, this.userId) : this.$q.when({}),
            successHandler: () => {
                this.model.name.value = _.get(this.user, "data.something");

                //  We don't set password fields in edition.  It's a secret and should not be displayed.
                this.model.databases.value = _.get(this.user, "data.somethingElse");
            }
        });
    }

    initModel () {
        this.model = {
            name: {
                value: "",
                maxLength: Infinity,
                required: false
            },
            password: {
                value: "",
                maxLength: Infinity,
                required: false
            },
            passwordConfirm: {
                value: "",
                maxLength: Infinity,
                required: false
            },
            databases: {
                value: []
            }
        };
    }

    $onInit () {
        this.user.load();
        this.previousState = this.CloudNavigation.getPreviousState();
    }

    add () {
        if (this.form.$invalid) {
            return this.$q.reject();
        }

        this.CloudMessage.getMessageHandler().flushMessages();
        this.saving = true;
        return this.CloudDbUserService.addUser(this.serviceName, this.extractModelValues())
            .then(() => this.previousState.go())
            .finally(() => { this.saving = false; });
    }

    update () {
        if (this.form.$invalid) {
            return this.$q.reject();
        }

        this.CloudMessage.getMessageHandler().flushMessages();
        this.saving = true;
        return this.CloudDbUserService.saveUser(this.serviceName, this.userId, this.extractModelValues())
            .then(() => this.previousState.go())
            .finally(() => { this.saving = false; });
    }

    isInEdition () {
        return this.userId;
    }

    extractModelValues () {
        return _.mapValues(this.model, modelKey => modelKey.value);
    }
}

angular.module("managerApp").controller("CloudDbUserEditCtrl", CloudDbUserEditCtrl);
