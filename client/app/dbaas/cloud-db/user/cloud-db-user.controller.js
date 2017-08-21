class CloudDbUserCtrl {
    constructor ($state, $stateParams, $translate, CloudDbActionService, CloudDbUserService, ControllerHelper) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.CloudDbActionService = CloudDbActionService;
        this.CloudDbUserService = CloudDbUserService;
        this.ControllerHelper = ControllerHelper;

        this.serviceName = this.$stateParams.serviceName;

        this.users = this.ControllerHelper.request.getArrayLoader({
            loaderFunction: () => this.CloudDbUserService.getUsers(this.serviceName)
        });

        this.actions = {
            addUser: {
                text: this.$translate.instant("cloud_db_user_add"),
                state: "dbaas.cloud-db.detail.user.add",
                stateParams: { serviceName: this.serviceName },
                isAvailable: () => true
            },
            preview: {
                text: this.$translate.instant("common_preview_see"),
                callback: user => this.CloudDbActionService.showUserPreviewModal(this.serviceName, user),
                isAvailable: () => true
            },
            updateUser: {
                text: this.$translate.instant("common_edit"),
                callback: () => this.$state.go("dbaas.cloud-db.detail.user.update", {
                    serviceName: this.$stateParams.serviceName,
                    userId: 123456
                }),
                isAvailable: () => true
            },
            deleteUser: {
                text: this.$translate.instant("common_delete"),
                callback: userId => this.ControllerHelper.modal.showDeleteModal({
                    titleText: this.$translate.instant("cloud_db_user_delete_title"),
                    text: this.$translate.instant("cloud_db_user_delete_confirmation_message"),
                    onDelete: () => this.CloudDbUserService.deleteUser(this.serviceName, userId)
                }),
                isAvailable: () => true
            }
        };
    }

    $onInit () {
        this.users.load()
            //TODO : Remove this.
            .finally(() => {
                this.users.data = [{ name: 1 }];
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
                                data-ng-disabled="!$ctrl.actions.updateUser.isAvailable()"
                                data-ng-bind="'common_edit' | translate"
                                data-ng-click="$ctrl.actions.updateUser.callback(123456)"></button>
                        </div>
                        <div class="oui-action-menu__item oui-action-menu-item">
                            <div class="oui-action-menu-item__icon">
                                <i class="oui-icon oui-icon-trash_line"></i>
                            </div>
                            <button class="oui-button oui-button_link oui-action-menu-item__label"
                                type="button"
                                data-ng-bind="'common_delete' | translate"
                                data-ng-disabled="!$ctrl.actions.deleteUser.isAvailable()"
                                data-ng-click="$ctrl.actions.deleteUser.callback(123456)"></button>
                        </div>
                    </div>
                </cui-dropdown-menu-body>
            </cui-dropdown-menu>`;
    }
}

angular.module("managerApp").controller("CloudDbUserCtrl", CloudDbUserCtrl);
