class CloudDbDatabaseEditCtrl {
    constructor ($q, $stateParams, CloudDbDatabaseService, CloudMessage, CloudNavigation, ControllerHelper) {
        this.$q = $q;
        this.$stateParams = $stateParams;
        this.CloudDbDatabaseService = CloudDbDatabaseService;
        this.CloudMessage = CloudMessage;
        this.CloudNavigation = CloudNavigation;
        this.ControllerHelper = ControllerHelper;
        this.serviceName = this.$stateParams.serviceName;
        this.databaseId = this.$stateParams.databaseId;

        this.initModel();

        this.database = this.ControllerHelper.request.getHashLoader({
            loaderFunction: () => this.isInEdition() ? this.CloudDbDatabaseService.getDatabase(this.serviceName, this.databaseId) : this.$q.when({}),
            successHandler: () => {
                this.model.name.value = _.get(this.database, "data.something");

                //  We don't set password fields in edition.  It's a secret and should not be displayed.
                this.model.databases.value = _.get(this.database, "data.somethingElse");
            }
        });
    }

    initModel () {
        this.model = {
            name: {
                value: "",
                maxLength: Infinity,
                required: true
            },
            users: {
                value: []
            },
            extensions: {
                value: []
            }
        };
    }

    $onInit () {
        this.database.load();
        this.previousState = this.CloudNavigation.getPreviousState();
    }

    add () {
        if (this.form.$invalid) {
            return this.$q.reject();
        }

        this.CloudMessage.getMessageHandler().flushMessages();
        this.saving = true;
        return this.CloudDbDatabaseService.addDatabase(this.serviceName, this.extractModelValues())
            .then(() => this.previousState.go())
            .finally(() => { this.saving = false; });
    }

    update () {
        if (this.form.$invalid) {
            return this.$q.reject();
        }

        this.CloudMessage.getMessageHandler().flushMessages();
        this.saving = true;
        return this.CloudDbDatabaseService.saveDatabase(this.serviceName, this.databaseId, this.extractModelValues())
            .then(() => this.previousState.go())
            .finally(() => { this.saving = false; });
    }

    isInEdition () {
        return this.databaseId;
    }

    extractModelValues () {
        return _.mapValues(this.model, modelKey => modelKey.value);
    }
}

angular.module("managerApp").controller("CloudDbDatabaseEditCtrl", CloudDbDatabaseEditCtrl);
