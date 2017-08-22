angular.module("managerApp")
    .config((atInternetProvider, atInternetUiRouterPluginProvider, CONFIG) => {
        "use strict";
        const trackingEnabled = CONFIG.env === "production";

        atInternetProvider.setEnabled(trackingEnabled);
        atInternetProvider.setDebug(!trackingEnabled);

        atInternetUiRouterPluginProvider.setTrackStateChange(true);
        atInternetUiRouterPluginProvider.addStateNameFilter(routeName => routeName ? routeName.replace(/\./g, "::") : "");

    })
    .config(["$provide", function ($provide) {
        "use strict";

        $provide.decorator("atInternet", ($delegate, $q, $cookies, Cloud, User, TRACKING) => {
            const delegateTrackPage = $delegate.trackPage;
            let isDefaultConfigurationSet = false;
            let trackPageRequestArgumentStack = [];
            let projectNumber = "";

            // Decorate trackPage to stack requests until At-internet default configuration is set
            $delegate.trackPage = function () {
                if (isDefaultConfigurationSet) {
                    delegateTrackPage.apply($delegate, arguments);
                } else {
                    trackPageRequestArgumentStack.push(arguments);
                }
            };

            Cloud.Project().Lexi().query().$promise.then(projects => {
                projectNumber = `[CloudProjects-${projects.length}]`;
            }).catch(err => $q.reject(err));

            User.Lexi().get().$promise.then(me => {
                const settings = angular.copy(TRACKING.config);

                const referrerSite = $cookies.get("OrderCloud");
                if (referrerSite) {
                    settings.referrerSite = referrerSite;
                }

                settings.countryCode = me.country;
                settings.currencyCode = me.currency && me.currency.code;
                settings.projectNumber = projectNumber;
                $delegate.setDefaults(settings);

                isDefaultConfigurationSet = true;

                _.forEach(trackPageRequestArgumentStack, trackPageArguments => {
                    delegateTrackPage.apply($delegate, trackPageArguments);
                });

            }).catch(err => {
                $delegate.trackPage = function () {};
                trackPageRequestArgumentStack = [];
                $delegate.setEnabled(false);
                return $q.reject(err);
            });

            return $delegate;
        });
    }]);
