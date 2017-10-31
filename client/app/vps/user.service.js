angular.module("managerApp").service("User", [
    "$rootScope",
    "$http",
    "$q",
    "Products",
    "OvhApiMe",
    "constants",
    function ($rootScope, $http, $q, Products, OvhApiMe, constants) {
        "use strict";

        this.getUser = function () {
            return OvhApiMe.Lexi().get().$promise;
        };


        this.getUser();

        this.getUrlOf = function(link) {
            return this.getUser().then(function(data) {
                try {
                    return constants.urls[data.ovhSubsidiary][link];
                } catch (exception){
                    return constants.urls.FR[link];
                }
            });
        };

        /* The new structure in constants.config.js will be ...value.subsidiary and not subsidiary.value
         * It will be easier for maintainers when you see all the possible values for a constant at the same place
         * If constants are structured the old way, use getUrlOf
         */
        this.getUrlOfEndsWithSubsidiary = function(link) {
            return this.getUser().then(function(data) {
                try {
                    return constants.urls[link][data.ovhSubsidiary];
                } catch (exception){
                    return constants.urls[link].FR;
                }
            });
        };

        this.getSshKeys = function () {
            // return OvhHttp.get("/me/sshKey", {
            //     rootPath: "apiv6"
            // });
            return OvhApiMe.SshKey().Lexi().get().$promise;
        };

        this.getUserAlerts = function () {
            return $http.get("/me/alerts", {
                serviceType: "aapi",
                params: {
                    target: constants.target
                }
            }).then(function (response) {
                return response.data;
            });
        };

        this.getCreditCards = function () {
            var _this = this;

            return $http.get("apiv6/me/paymentMean/creditCard").then(function(response) {
                var queries = response.data.map(_this.getCreditCard);

                return $q.all(queries);
            });
        };

        this.getCreditCard = function(id) {
            return $http.get("apiv6/me/paymentMean/creditCard/" + id).then(function(response) {
                return response.data;
            });
        };

        this.uploadFile = function(filename, file, tags) {
            var idFile, documentResponse;

            var filenameSplitted = file.name.split('.');
            var params = {
               name: [filename, filenameSplitted[filenameSplitted.length - 1]].join('.')
            };

            if(tags) {
               angular.extend(params, {tags: tags});
            }

            return $http.post("apiv6/me/document", params)
                .then(function (response) {
                    documentResponse = response;

                    return $http.post("apiv6/me/document/cors", { origin: window.location.origin });
                })
                .then(function () {
                    idFile = documentResponse.data.id;
                    return $http.put(documentResponse.data.putUrl, file, {
                        serviceType: "external",
                        headers: {'Content-Type': 'multipart/form-data'}
                    });
                })
                .then(function () {
                    return idFile;
                });
        };

        this.getDocument = function (id) {
            return $http.get("apiv6/me/document/" + id)
                .then(function (response) {
                    return response.data;
                });
        };

        this.getDocumentIds = function () {
            return $http.get("apiv6/me/document")
                .then(function (response) {
                    return response.data;
                });
        };

        this.getDocuments = function () {
            var _this = this;

            return _this.getDocumentIds().then(function(data) {
                var queries = data.map(_this.getDocument);

                return $q.all(queries);
            });
        };

        // this.payWithRegisteredPaymentMean = function (opts) {
        //     return OvhHttp.post("/me/order/{orderId}/payWithRegisteredPaymentMean", {
        //         rootPath: "apiv6",
        //         urlParams: {
        //             orderId: opts.orderId
        //         },
        //         data: {
        //             paymentMean: opts.paymentMean
        //         }
        //     });
        // };

        this.getValidPaymentMeansIds = function () {
            var means = ["bankAccount", "paypal", "creditCard", "deferredPaymentAccount"];
            var baseUrl = constants.swsProxyRootPath + "me/paymentMean";
            var meanRequests = [];
            means.forEach(function (paymentMethod) {
                var paramStruct = null;
                if ("bankAccount" === paymentMethod) {
                    paramStruct = {
                        "state": "valid"
                    };
                }
                var promise = $http.get([baseUrl, paymentMethod].join("/"), { params : paramStruct })
                    .then(function (response) {
                        return response.data;
                    });
                meanRequests.push(promise);
            });
            return $q.all(meanRequests).then(function (response) {
                return _.flatten(response);
            });
        };

    }
]);
