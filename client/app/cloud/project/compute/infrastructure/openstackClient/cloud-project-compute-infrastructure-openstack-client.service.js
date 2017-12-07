class CloudProjectComputeInfrastructureOpenstackClientService {
    constructor ($q, $stateParams, OvhApiCloudProjectOpenstackClient, OvhApiCloudProjectRegion, CloudMessage, ServiceHelper) {
        this.$q = $q;
        this.OvhApiCloudProjectOpenstackClient = OvhApiCloudProjectOpenstackClient;
        this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;
        this.CloudMessage = CloudMessage;
        this.ServiceHelper = ServiceHelper;

        this.ws = null;
    }

    getSession ({ serviceName, term }) {
        return this.OvhApiCloudProjectOpenstackClient.Lexi().post({ serviceName }).$promise
            .then(session => {
                if (!term) {
                    return session;
                }
                return this.initWebSocket(session, term);
            })
            .catch(this.ServiceHelper.errorHandler("cpci_openstack_client_session_error"));
    }

    getRegions (serviceName) {
        return this.OvhApiCloudProjectRegion.Lexi().query({ serviceName }).$promise
            .catch(this.ServiceHelper.errorHandler("cpci_openstack_client_regions_error"));
    }

    sendAction (action) {
        this.clear();
        this.send(`${action}\n`);
    }

    initWebSocket (session, term) {
        const self = this;
        const defer = this.$q.defer();
        let pingTimer;
        this.ws = new WebSocket(session.websocket);
        this.ws.onopen = () => {
            self.ws.opened = true;
            pingTimer = setInterval(ws => ws.send("1"), 30 * 1000, self.ws);
            defer.resolve(session);
        };

        this.ws.onmessage = event => {
            const data = event.data.slice(1);
            switch (event.data[0]) {
                case "0":
                    term.io.writeUTF8(atob(data));
                    break;
                default :break;
            }
        };

        this.ws.onclose = function () {
            if (pingTimer) {
                clearInterval(pingTimer)
            }
            defer.reject();
            self.ServiceHelper.errorHandler("cpci_openstack_client_socket_closed");
        };
        return defer.promise;
    }

    send (data) {
        if (!this.wsReady()) {
            return;
        }
        this.ws.send(`0${data}`);
    }

    clear () {
        // to clear the line before sending data
        this.ws.send("0\x15\x0b")
    }

    setRegion (region) {
        if (!this.wsReady()) {
            return;
        }
        this.clear();
        this.send(`export OS_REGION_NAME=${region}\n`);
    }

    setConfig (config) {
        if (!this.wsReady()) {
            return;
        }
        this.ws.send(`2${JSON.stringify(config)}`);
    }

    wsReady() {
        return this.ws && this.ws.opened;
    }

}


angular.module("managerApp").service("CloudProjectComputeInfrastructureOpenstackClientService", CloudProjectComputeInfrastructureOpenstackClientService);
