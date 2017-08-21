class CloudNavigation {
    constructor ($rootScope, $state, $stateParams, TabsService) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.TabsService = TabsService;

        $rootScope.$on("$stateChangeSuccess", (event, toState, toParams, fromState, fromParams) => {
            const correspondingState = _.find(this.history, state => state.name === toState.name && _.isEqual(state.stateParams, toParams));

            if (correspondingState) {
                while (_.last(this.history) !== correspondingState) { this.history.pop(); }
                this.history.pop();
            } else {
                this.history.push({ name: fromState.name, stateParams: fromParams, sref: `${fromState.name}(${JSON.stringify(fromParams)})` });
            }
        });
    }

    $onInit () {
        this.init();
    }

    init () {
        this.history = [];
    }

    getPreviousState () {
        const previousState = _.assign({}, _.last(this.history) || _.pick(this.TabsService.getActiveTab(), ["state", "stateParams", "sref"]));
        previousState.go = () => this.$state.go(previousState.state, previousState.stateParams);
        return previousState;
    }
}

angular.module("managerApp").service("CloudNavigation", CloudNavigation);
