class CloudDbBackupCtrl {
    constructor ($stateParams, $translate, CloudDbActionService, CloudDbBackupService, ControllerHelper) {
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.CloudDbActionService = CloudDbActionService;
        this.CloudDbBackupService = CloudDbBackupService;
        this.ControllerHelper = ControllerHelper;

        this.serviceName = this.$stateParams.serviceName;

        this.backups = this.ControllerHelper.request.getArrayLoader({
            loaderFunction: () => this.CloudDbBackupService.getBackups(this.serviceName)
        });

        this.actions = {
            addBackup: {
                text: this.$translate.instant("cloud_db_backup_add"),
                callback: () => this.CloudDbActionService.showBackupEditModal(this.serviceName),
                isAvailable: () => true
            },
            downloadBackup: {
                text: this.$translate.instant("cloud_db_backup_action_menu_download"),
                callback: backupId => console.log("DO SOMETHING", backupId),
                isAvailable: () => true
            },
            restoreBackup: {
                text: this.$translate.instant("cloud_db_backup_action_menu_restore"),
                callback: backupId => this.CloudDbBackupService.restoreBackup(this.serviceName, backupId),
                isAvailable: () => true
            },
            deleteBackup: {
                text: this.$translate.instant("common_delete"),
                callback: backupId => this.ControllerHelper.modal.showDeleteModal({
                    titleText: this.$translate.instant("cloud_db_backup_delete_title"),
                    text: this.$translate.instant("cloud_db_backup_delete_confirmation_message"),
                    onDelete: () => this.CloudDbBackupService.deleteBackup(this.serviceName, backupId)
                }),
                isAvailable: () => true
            }
        };
    }

    $onInit () {
        this.backups.load()
            //TODO : Remove this.
            .finally(() => {
                this.backups.data = [{ name: 1 }];
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
                                <i class="oui-icon oui-icon-pen_line"></i>
                            </div>
                            <button class="oui-button oui-button_link oui-action-menu-item__label"
                                type="button"
                                data-ng-disabled="!$ctrl.actions.downloadBackup.isAvailable()"
                                data-ng-bind="$ctrl.actions.downloadBackup.text"
                                data-ng-click="$ctrl.actions.downloadBackup.callback(123456)"></button>
                        </div>
                        <div class="oui-action-menu__item oui-action-menu-item">
                            <div class="oui-action-menu-item__icon">
                                <i class="oui-icon oui-icon-pen_line"></i>
                            </div>
                            <button class="oui-button oui-button_link oui-action-menu-item__label"
                                type="button"
                                data-ng-disabled="!$ctrl.actions.restoreBackup.isAvailable()"
                                data-ng-bind="$ctrl.actions.restoreBackup.text"
                                data-ng-click="$ctrl.actions.restoreBackup.callback(123456)"></button>
                        </div>
                        <div class="oui-action-menu__item oui-action-menu-item">
                            <div class="oui-action-menu-item__icon">
                                <i class="oui-icon oui-icon-trash_line"></i>
                            </div>
                            <button class="oui-button oui-button_link oui-action-menu-item__label"
                                type="button"
                                data-ng-bind="'common_delete' | translate"
                                data-ng-disabled="!$ctrl.actions.deleteBackup.isAvailable()"
                                data-ng-click="$ctrl.actions.deleteBackup.callback(123456)"></button>
                        </div>
                    </div>
                </cui-dropdown-menu-body>
            </cui-dropdown-menu>`;
    }
}

angular.module("managerApp").controller("CloudDbBackupCtrl", CloudDbBackupCtrl);
