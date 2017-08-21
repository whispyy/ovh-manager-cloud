class CloudDbDatabaseCtrl {
    constructor ($state, $stateParams, $translate, CloudDbActionService, CloudDbDatabaseService, ControllerHelper) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.CloudDbActionService = CloudDbActionService;
        this.CloudDbDatabaseService = CloudDbDatabaseService;
        this.ControllerHelper = ControllerHelper;

        this.serviceName = this.$stateParams.serviceName;

        this.databases = this.ControllerHelper.request.getArrayLoader({
            loaderFunction: () => this.CloudDbDatabaseService.getDatabases(this.serviceName)
        });

        this.actions = {
            addDatabase: {
                text: this.$translate.instant("cloud_db_database_add"),
                state: "dbaas.cloud-db.detail.database.add",
                stateParams: { serviceName: this.serviceName },
                isAvailable: () => true
            },
            preview: {
                text: this.$translate.instant("common_preview_see"),
                callback: database => this.CloudDbActionService.showDatabasePreviewModal(this.serviceName, database),
                isAvailable: () => true
            },
            updateDatabase: {
                text: this.$translate.instant("common_edit"),
                callback: () => this.$state.go("dbaas.cloud-db.detail.database.update", {
                    serviceName: this.$stateParams.serviceName,
                    databaseId: 123456
                }),
                isAvailable: () => true
            },
            deleteDatabase: {
                text: this.$translate.instant("common_delete"),
                callback: databaseId => this.ControllerHelper.modal.showDeleteModal({
                    titleText: this.$translate.instant("cloud_db_database_delete_title"),
                    text: this.$translate.instant("cloud_db_database_delete_confirmation_message"),
                    onDelete: () => this.CloudDbDatabaseService.deleteDatabase(this.serviceName, databaseId)
                }),
                isAvailable: () => true
            }
        };
    }

    $onInit () {
        this.databases.load()
            //TODO : Remove this.
            .finally(() => {
                this.databases.data = [{ name: 1 }];
            });
    }

    getActionTemplate () {
        return `
            <cui-dropdown-menu>
                <cui-dropdown-menu-button>
                    <ng-include src="'app/ui-components/icons/button-action.html'"></ng-include>
                </cui-dropdown-menu-button>
                <cui-dropdown-menu-body>
                    <div class="oui-action-menu">
                        <div class="oui-action-menu__item oui-action-menu-item">
                            <div class="oui-action-menu-item__icon">
                                <i class="oui-icon oui-icon-eye"></i>
                            </div>
                            <button class="oui-button oui-button_link oui-action-menu-item__label"
                                type="button"
                                data-ng-bind="$ctrl.actions.preview.text"
                                data-ng-disabled="!$ctrl.actions.preview.isAvailable()"
                                data-ng-click="$ctrl.actions.preview.callback($row)"></button>
                        </div>
                    </div>
                    <div class="oui-action-menu">
                        <div class="oui-action-menu__item oui-action-menu-item">
                            <div class="oui-action-menu-item__icon">
                                <i class="oui-icon oui-icon-pen_line"></i>
                            </div>
                            <button class="oui-button oui-button_link oui-action-menu-item__label"
                                type="button"
                                data-ng-disabled="!$ctrl.actions.updateDatabase.isAvailable()"
                                data-ng-bind="'common_edit' | translate"
                                data-ng-click="$ctrl.actions.updateDatabase.callback(123456)"></button>
                        </div>
                        <div class="oui-action-menu__item oui-action-menu-item">
                            <div class="oui-action-menu-item__icon">
                                <i class="oui-icon oui-icon-trash_line"></i>
                            </div>
                            <button class="oui-button oui-button_link oui-action-menu-item__label"
                                type="button"
                                data-ng-bind="'common_delete' | translate"
                                data-ng-disabled="!$ctrl.actions.deleteDatabase.isAvailable()"
                                data-ng-click="$ctrl.actions.deleteDatabase.callback(123456)"></button>
                        </div>
                    </div>
                </cui-dropdown-menu-body>
            </cui-dropdown-menu>`;
    }
}

angular.module("managerApp").controller("CloudDbDatabaseCtrl", CloudDbDatabaseCtrl);
