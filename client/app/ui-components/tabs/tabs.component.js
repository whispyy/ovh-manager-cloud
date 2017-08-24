angular.module("managerApp")
    .directive("cuiTabs", ($window, $timeout, $interval) => ({
        replace: true,
        restrict: "E",
        require: "cuiTabs",
        template: `
            <div class="cui-tabs-container">
                <ul class="cui-tabs"
                    role="menubar"
                    data-ng-transclude></ul>
                <button class="cui-tabs-container__button cui-tabs-container__button-left"
                    data-ng-click="$ctrl.scrollLeft()"
                    data-ng-if="$ctrl.isDisplayingResponsiveTabs() && $ctrl.canScrollLeft()"
                    aria-hidden="true">
                    <i class="oui-icon oui-icon-chevron-left" aria-hidden="true"></i>
                </button>
                <button class="cui-tabs-container__button cui-tabs-container__button-right"
                    data-ng-click="$ctrl.scrollRight()"
                    data-ng-if="$ctrl.isDisplayingResponsiveTabs() && $ctrl.canScrollRight()"
                    aria-hidden="true">
                    <i class="oui-icon oui-icon-chevron-right" aria-hidden="true"></i>
            </div>
        `,
        controllerAs: "$ctrl",
        controller: class cuiTabsController {
            constructor ($scope, TabsService) {
                this.TabsService = TabsService;

                $scope.$watch(() => _.find(this.tabs, tab => tab.active), () => this.updateActive());
            }

            $onInit () {
                this.tabs = [];
                this.displayResponsiveTabs = false;
            }

            addTab (tab) {
                this.TabsService.registerTab(tab);
                this.tabs = this.TabsService.getRegisteredTabs();
            }

            isDisplayingResponsiveTabs () {
                return this.displayResponsiveTabs;
            }

            beginResponsiveDisplay () {
                this.displayResponsiveTabs = true;
            }

            endResponsiveDisplay () {
                this.displayResponsiveTabs = false;
            }
        },
        link: ($scope, $element, $attrs, $ctrl) => {
            const container = $element[0].getElementsByClassName("cui-tabs")[0];

            const easingFunction = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) {
                    return c / 2 * t * t + b;
                }
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            };

            const animateScroll = newValue => {
                let frameCount = 0;
                const loop = $interval(() => {
                    container.scrollLeft = easingFunction(frameCount++, container.scrollLeft, newValue - container.scrollLeft, 60);
                    if (frameCount === 60) {
                        $interval.cancel(loop);
                    }
                }, 1000 / 60);
            };

            const scrollToActiveTab = (animate = false) => {
                const activeElement = container.getElementsByClassName("cui-tabs__tab-active")[0];
                if (activeElement) {
                    const newScrollValue = activeElement.offsetLeft - (container.clientWidth - activeElement.clientWidth) / 2;
                    if (!animate) {
                        container.scrollLeft = newScrollValue;
                    } else {
                        animateScroll(newScrollValue);
                    }
                }
            };

            $ctrl.scrollRight = () => {
                animateScroll(container.scrollLeft + container.clientWidth);
            };

            $ctrl.scrollLeft = () => {
                animateScroll(container.scrollLeft - container.clientWidth);
            };

            $ctrl.canScrollRight = () => (container.scrollWidth - container.clientWidth) !== container.scrollLeft;

            $ctrl.canScrollLeft = () => container.scrollLeft !== 0;

            $ctrl.updateActive = () => $timeout(() => {
                const activeElement = container.getElementsByClassName("cui-tabs__tab-active")[0];
                //  If the active element is cropped from the left or right overflow, we recenter it.
                if (container.scrollLeft > activeElement.offsetLeft ||
                    activeElement.offsetLeft + activeElement.clientWidth > container.scrollLeft + container.clientWidth) {
                    scrollToActiveTab(true);
                }
            });

            const resizeFunction = () => {
                $scope.width = $window.innerWidth;
                const isOverflowing = container.clientWidth < container.scrollWidth;

                if (isOverflowing && !$ctrl.isDisplayingResponsiveTabs()) {
                    $ctrl.beginResponsiveDisplay();

                    //  HACK => Hide scrollbar on firefox.
                    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
                    if (isFirefox && container.parentElement.clientHeight > container.offsetHeight) {
                        container.parentElement.style.overflowY = "hidden";
                        container.parentElement.style.height = `${container.offsetHeight - 1}px`;
                    }
                }

                if (!isOverflowing && $ctrl.isDisplayingResponsiveTabs()) {
                    $ctrl.endResponsiveDisplay();
                }

                scrollToActiveTab();
                $scope.$digest();
            };

            //  We call the function a first time when we load the component.
            $timeout(() => {
                resizeFunction();
            });

            angular.element($window).bind("resize", () => {
                resizeFunction();
            });
        },
        scope: true,
        transclude: true
    }))
    .directive("cuiTab", () => ({
        replace: true,
        restrict: "E",
        require: ["^^cuiTabs", "cuiTab"],
        controllerAs: "$ctrl",
        controller: class CuiTabController {
            constructor ($timeout) {
                this.active = false;
                this.isActivating = false;
                this.updateActive = tabAttr => {
                    this.active = tabAttr.active;
                    this.isActivating = tabAttr.isActivating;

                    if (tabAttr.isActivating) {
                        $timeout(() => {
                            tabAttr.isActivating = false;
                            this.updateActive(tabAttr);
                        }, 200);
                    }
                };
            }
        },
        scope: true,
        transclude: true,
        template: `
            <li class="cui-tabs__tab"
                role="menuitem"
                data-ng-class="{ 'cui-tabs__tab-active': $ctrl.active, 'cui-tabs__tab-animate': $ctrl.isActivating }">
                <ng-transclude data-ng-if="!$ctrl.state"></ng-transclude>
                <a data-ng-if="$ctrl.state"
                   ui-sref="{{ $ctrl.state + '(' + String($ctrl.stateParams) + ')' }}">
                   <span data-ng-bind="$ctrl.text"></span>
                </a>
            </li>
        `,
        bindToController: {
            active: "<",
            state: "@",
            stateParams: "<",
            text: "<"
        },
        link: ($scope, $element, $attrs, $ctrls) => {
            const parentCtrl = $ctrls[0];
            const childCtrl = $ctrls[1];
            let tabAttr = _.pick(childCtrl, ["active", "state", "stateParams", "text"]);

            // We purge undefined attributes from the object.
            tabAttr = _.pick(tabAttr, _.identity);

            tabAttr.updateActive = (active, isActivating) => {
                tabAttr.active = active;
                tabAttr.isActivating = isActivating;
                childCtrl.updateActive(tabAttr);
            };

            parentCtrl.addTab(tabAttr);
        }
    }));
