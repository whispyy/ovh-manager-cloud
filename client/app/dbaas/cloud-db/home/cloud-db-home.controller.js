class CloudDbHomeCtrl {
    constructor ($state, $stateParams, $translate, CloudDbActionService, CloudDbHomeService, ControllerHelper, ControllerModalHelper) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.CloudDbActionService = CloudDbActionService;
        this.CloudDbHomeService = CloudDbHomeService;
        this.ControllerHelper = ControllerHelper;
        this.ControllerModalHelper = ControllerModalHelper;

        this.serviceName = this.$stateParams.serviceName;

        this.initLoaders();
    }

    $onInit () {
        this.status.load();
        this.access.load();
        this.configuration.load();
        this.subscription.load();

        this.initActions();
    }

    initLoaders () {
        this.status = this.ControllerHelper.request.getHashLoader({
            loaderFunction: () => this.CloudDbHomeService.getStatus(this.serviceName)
        });

        this.access = this.ControllerHelper.request.getHashLoader({
            loaderFunction: () => this.CloudDbHomeService.getAccess(this.serviceName)
        });

        this.configuration = this.ControllerHelper.request.getHashLoader({
            loaderFunction: () => this.CloudDbHomeService.getConfiguration(this.serviceName)
        });

        this.subscription = this.ControllerHelper.request.getHashLoader({
            loaderFunction: () => this.CloudDbHomeService.getSubscription(this.serviceName)
        });
    }

    initActions () {
        this.actions = {
            addDataBase: {
                text: this.$translate.instant("cloud_db_home_tile_shortcut_create_database"),
                state: "dbaas.cloud-db.detail.database.add",
                stateParams: { serviceName: this.serviceName },
                isAvailable: () => true
            },
            addUser: {
                text: this.$translate.instant("cloud_db_home_tile_shortcut_create_user"),
                state: "dbaas.cloud-db.detail.user.add",
                stateParams: { serviceName: this.serviceName },
                isAvailable: () => true
            },
            addBackup: {
                text: this.$translate.instant("cloud_db_home_tile_shortcut_create_backup"),
                callback: () => this.CloudDbActionService.showBackupEditModal(this.serviceName),
                isAvailable: () => true
            },
            addNetwork: {
                text: this.$translate.instant("cloud_db_home_tile_shortcut_add_network"),
                callback: () => this.CloudDbActionService.showNetworkEditModal(this.serviceName),
                isAvailable: () => true
            },
            restartInstance: {
                text: this.$translate.instant("cloud_db_home_tile_status_instance_restart"),
                callback: () => this.CloudDbActionService.showInstanceRestartModal(this.serviceName),
                isAvailable: () => true
            },
            editName: {
                text: this.$translate.instant("common_edit"),
                callback: () => this.ControllerModalHelper.showNameChangeModal({
                    serviceName: this.serviceName,
                    displayName: this.configuration.data.displayName,
                    onSave: newDisplayName => this.CloudDbHomeService.updateName(this.serviceName, newDisplayName)
                }),
                isAvailable: () => true
            },
            editAdvancedParameters: {
                text: this.$translate.instant("common_edit"),
                state: "dbaas.cloud-db.detail.advanced-parameter.update",
                stateParams: { serviceName: this.serviceName },
                isAvailable: () => true
            },
            changeOffer: {
                text: this.$translate.instant("cloud_db_home_tile_shortcut_change_offer"),
                state: "dbaas.cloud-db.detail.offer.update",
                stateParams: { serviceName: this.serviceName },
                isAvailable: () => true
            },
            manageAutorenew: {
                text: this.$translate.instant("common_manage"),
                href: this.ControllerHelper.navigation.getUrl("renew", { serviceName: this.serviceName, serviceType: "CLOUD_DB" }),
                isAvailable: () => true
            },
            manageContact: {
                text: this.$translate.instant("common_manage"),
                href: this.ControllerHelper.navigation.getUrl("contacts", { serviceName: this.serviceName }),
                isAvailable: () => true
            }
        };
    }
}

angular.module("managerApp").controller("CloudDbHomeCtrl", CloudDbHomeCtrl);
