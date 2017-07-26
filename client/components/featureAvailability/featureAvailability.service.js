(() => {
    "use strict";
    const allEuropeanSubsidiaries = ["CZ", "DE", "ES", "FI", "FR", "GB", "IT", "LT", "NL", "PL", "PT"];
    const allCanadianSubsidiaries = ["AU", "CA", "QC", "WE", "WS"];
    const featuresAvailability = {
        VPS: {
            sidebarOrder: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
            }
        },
        SERVER: {
            sidebarOrder: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
                US: ["US"],
            },
            billingConsumption: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
                US: ["US"],
            },
            billingHistory: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
                US: ["US"],                
            },
            billingVouchers: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
                US: ["US"],
            },
            billingQuota: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
                US: ["US"],
            },
            billingRights: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
            }
        },
        PROJECT: {
            sidebarOrder: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
                US: ["US"],
            }
        },
        DEDICATED_CLOUD:{
            sidebarOrder: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
                US: ["US"],
            }
        },
        ip: {
            sidebarOrder: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
                US: ["US"],
            }
        },
        iplb: {
            sidebarOrder: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
                US: ["US"],
            }
        },
        VRACK: {
            sidebarOrder: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
            }
        },
        licence: {
            sidebarOrder: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
                US: ["US"],
            }
        },
        NASHA: {
            sidebarOrder: {
                EU: allEuropeanSubsidiaries,
                CA: allCanadianSubsidiaries,
            }
        },
        METRICS: {
            sidebarOrder: {
                EU: ["FR"],
                US: ["US"]
            }
        },
        CEPH: {
            sidebarOrder: {
                EU: ["FR"],
                US: ["US"]
            }
        },
        VEEAM: {
            sidebarOrder: {
                EU: [],
            }
        },
        DESKAAS: {
            sidebarMenu: {
                EU: ["FR"]
            }
        }
    };

    class FeatureAvailabilityService {
        constructor (User, TARGET) {
            this.User = User;
            this.TARGET = TARGET;

            this.locale = null;
            this.User.Lexi().get().$promise
                .then(user => {
                    this.locale = user.ovhSubsidiary;
                });
        }

        hasFeature (product, feature, locale = this.locale) {
            if (!_.has(featuresAvailability, [product, feature, this.TARGET ])) {
                return false;
            }
            return _.indexOf(featuresAvailability[product][feature][this.TARGET], locale) !== -1;
        }

    }
    angular.module("managerApp").service("FeatureAvailabilityService", FeatureAvailabilityService);
})();
