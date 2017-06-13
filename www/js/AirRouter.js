var airRouterGateway = null;

var AirRouter = function(gateway) {
    airRouterGateway = gateway;
}

AirRouter.prototype = {
    get: function( appURL, success, failure) {
        console.log("airRouter.get-Async-baseURL "+airRouterGateway.baseURL +" appURL "+appURL);
        airRouterGateway.oauthGateway.get( airRouterGateway.baseURL + "/route/" + appURL+"?rand="+new Date().getTime(), function (response) {
                success(response.GatewayResponse);
            }, failure );
    },
	getSync: function( appURL, success, failure) {
        console.log("airRouter.get-Sync-baseURL "+airRouterGateway.baseURL +" appURL "+appURL);
        airRouterGateway.oauthGateway.getSync( airRouterGateway.baseURL + "/route/" + appURL+"?rand="+new Date().getTime(),
            function (response) {
                success(response.GatewayResponse);
            }
            , failure
        );
    },
    post: function( appURL, data, success, failure) {
        console.log("airRouter.post-Async-baseURL ",airRouterGateway.baseURL, "appURL",appURL, "data", data);
        airRouterGateway.oauthGateway.post( airRouterGateway.baseURL + "/route/" + appURL+"?rand="+new Date().getTime(), data,
            function (response) {
                success(response.GatewayResponse);
            }
            , failure
        );
    },
    postSync: function( appURL, data, success, failure) {
       console.log("airRouter.post-Sync-baseURL ",airRouterGateway.baseURL, "appURL",appURL, "data", data);
       airRouterGateway.oauthGateway.postSync( airRouterGateway.baseURL + "/route/" + appURL+"?rand="+new Date().getTime(), data,
           function (response) {
                 success(response.GatewayResponse);
           }
           , failure
       );
    },
	put: function( appURL, data, correlationData, success, failure) {
        console.log("airRouter.put-baseURL ",airRouterGateway.baseURL, "appURL",appURL, "data", data, "correlationData", correlationData);
        airRouterGateway.oauthGateway.put( airRouterGateway.baseURL + "/route/" + appURL+"?rand="+new Date().getTime(), data,
            function (response) {
                success(response.GatewayResponse, correlationData);
            },
            function(error)
            {
                failure(error,correlationData);
            }
        );
    },
    putSync: function( appURL, data, correlationData, success, failure) {
        //app.tracker += ", AirRouter putSync";
        console.log("airRouter.putSync-baseURL ",airRouterGateway.baseURL, "appURL",appURL, "data", data, "correlationData", correlationData);
        airRouterGateway.oauthGateway.putSync( airRouterGateway.baseURL + "/route/" + appURL+"?rand="+new Date().getTime(), data,
            function (response) {
                success(response.GatewayResponse, correlationData);
            },
            function(error)
            {
                failure(error,correlationData);
            }
        );
    }
}




