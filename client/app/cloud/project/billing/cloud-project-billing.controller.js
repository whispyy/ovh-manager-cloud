(() => {
    "use strict";
	class CloudProjectBillingCtrl {
		constructor (FeatureAvailabilityService) {
			this.FeatureAvailabilityService = FeatureAvailabilityService;
		}
	}

	angular.module("managerApp")
	  .controller("CloudProjectBillingCtrl", CloudProjectBillingCtrl);
})();