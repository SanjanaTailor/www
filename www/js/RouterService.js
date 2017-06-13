var RouterService = function(baseUrl, appName, appVersion, clientVersion, consumerKey, consumerSecret, errorHandler)
{
    this.baseURL = baseUrl;
    this.appName = appName;
    this.appVersion = appVersion;
    this.clientVersion = clientVersion;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.airGateway = null;
    this.airRouter = null;
    this.device = null;
    this.errorHandler = errorHandler;
    routerServiceErrorHandler = errorHandler.handleRouterError;
    formatErrorHandler = errorHandler.handleResponseFormatError;
}

var routerServiceErrorHandler = null;
var formatErrorHandler = null;

RouterService.prototype = {
    setDevice: function(device)
    {
        this.device = device;
        console.log("setDevice",device);
    },
    setClientVersion: function(version)
    {
        this.clientVersion = version;
        console.log("setVersion",version);
    },
    registerDevice: function(activationKey, registrationPin, okFunction)
    {
        console.log( "RouterService.registerDevice", activationKey,registrationPin);
        this._doOAuthAuthentication( activationKey,
            function() {
                app.routerService.attemptToRegister( activationKey, registrationPin, okFunction );
            },
            function (data)
            {
                routerServiceErrorHandler(data, true);
            }
        );
    },
    loginToRouter: function(extendedActivationKey, loginPin, okFunction, invalidPinFunction)
    {
        // We need to oauth authenticate
        this._doOAuthAuthentication( extendedActivationKey,
            function() {
                app.routerService.attemptToLogin( loginPin, okFunction, invalidPinFunction );
            },
            function(error) {
                routerServiceErrorHandler(error, true);
            }
        );
    },
    attemptToRegister: function (activationKey, registrationPin, okFunction) {
        app.routerService.airGateway.registerDevice( activationKey, registrationPin,  this.device.deviceModel,
            this.device.devicePlatform, this.device.deviceVersion,  this.device.deviceUUID,
            function(data) {
                console.log("GatewayResponse",gatewayResponse);
                var gatewayResponse = data.GatewayResponse;
                if (gatewayResponse.result != 'SUCCESS')
                {
                    routerServiceErrorHandler( gatewayResponse, true);
                }
                else
                {
                    console.log("DeviceId",gatewayResponse.deviceId);
                    okFunction( gatewayResponse.extendedActivationKey, gatewayResponse.deviceId );
                }
            },
            function (error)
            {
                routerServiceErrorHandler(error, true);
            }
        );
    },
    attemptToLogin: function(loginPin, okFunction, invalidPinFunction) {
        // We have been authenticated so make login attempt
        // Inform the error handler of the close dialog option
        errorDialogCloseFunction = invalidPinFunction;
        this.airGateway.authenticate( loginPin, this.device.deviceModel,
            this.device.devicePlatform, this.device.deviceVersion, this.device.deviceUUID,
            function(data) {
                var gatewayResponse = data.GatewayResponse;
                if (gatewayResponse.result != 'SUCCESS')
                {
                    routerServiceErrorHandler( gatewayResponse, true);
                }
                else
                {
                    var token = gatewayResponse.token;
                    app.routerService.airGateway.setGatewayRuntimeToken( token );
                    okFunction( token, gatewayResponse.deviceRefresh );
                }
            },
            function( error ) {
                routerServiceErrorHandler( error, true );
            }, app.dataResetPerformed );
    },
    _doOAuthAuthentication: function(activationKey, success, failure) {
        //app.tracker += ", _doOAuthAuthentication";
        console.log( "RouterService._doOAuthAuthentication airGateway "+this.airGateway );
        if (this.airGateway == undefined || this.airGateway == null)
        {
            this.airGateway = new AirGateway(this.baseURL,this.consumerKey,this.consumerSecret,this.appName,this.appVersion, this.clientVersion);
            this.airGateway.setGatewayRuntimeToken( app.gatewayRuntimeToken );
            this.airRouter = new AirRouter( this.airGateway );
        }
        // We only need to do the authentication part if we have not already got an oauth access token
        console.log("oAuth "+oauth +" oauth.getAccessTokenKey "+ oauth.getAccessTokenKey());
        if (oauth == undefined || oauth.getAccessTokenKey() == null || oauth.getAccessTokenKey().length < 1)
        {
            //this.airGateway.fetchRequestToken(activationKey, success, failure );
            this.airGateway.fetchRequestToken(activationKey, success, failure );
        }
        else
        {
            success();
        }
    },
    getApprovalItems: function(extendedActivationKey, showNonCriticalErrors, okFunction, failFunction)
    {
        this._doOAuthAuthentication( extendedActivationKey,
            function() {
                // Get the items and if all ok invoke the okFunction
                app.routerService.airRouter.getSync( "datafeed/approvals",
                    function(gatewayResponse)
                    {
                       // process the response object. We need to check the version information for this application
                       // and other mundane things. If all ok then we can show the main application page.
                       //online=true;
                       console.log("Get result "+ gatewayResponse.result);
                       if (gatewayResponse.result != 'SUCCESS')
                       {
                           failFunction(gatewayResponse);
                           routerServiceErrorHandler( gatewayResponse,showNonCriticalErrors );
                       }
                       else
                       {
                           //parseJSON(gatewayResponse.routingResponse, okFunction);
                           okFunction(getParsedJSON(gatewayResponse.routingResponse));
                       }
                    },
                    function( error ) {
                       console.log("GetError:",error);
                       failFunction(error);
                       routerServiceErrorHandler( error, showNonCriticalErrors );
                    }
                );
            },
            function (error) {
                console.log( "RouterServer::getApprovals error " , error);
                failFunction(error);
                routerServiceErrorHandler( error, showNonCriticalErrors );
            }
        );
    },
    sendApprovalItem: function(extendedActivationKey, itemID, update, okFunction, failFunction)
    {
        //app.tracker += ", sendApprovalItem";
        this._doOAuthAuthentication( extendedActivationKey,
            function() {
                app.routerService.airRouter.put( "datafeed/approvals", update, itemID,
                    function(gatewayResponse, correlatedID)
                    {
                        console.log("Send result "+ gatewayResponse.result);
                        if (gatewayResponse.result != 'SUCCESS')
                        {
                            failFunction(correlatedID);
                            routerServiceErrorHandler( gatewayResponse, false );
                        }
                        else
                        {
                            console.log("Sent Correlated ID "+correlatedID);
                            //okFunction( correlatedID );
                            okFunction( correlatedID, gatewayResponse.transactionId );
                        }
                    },
                    function(error, correlationID)
                    {
                        console.log("Send Error " , error);
                        failFunction(correlationID);
                        routerServiceErrorHandler(error, false);
                    }
                );
            },
            function (error) {
                console.log( "RouterServer::sendApprovalItem error " , error);
                failFunction(itemID);
                routerServiceErrorHandler(error, false);
            }
        );
    },
    getTransactionStatusList: function(extendedActivationKey, transactionIds, okFunction, failFunction)
    {
        console.log("TransStatList",transactionIds);
        this._doOAuthAuthentication( extendedActivationKey,
            function() {

                app.routerService.airGateway.postTransactions(transactionIds,
                    function(gatewayResponse)
                    {
                        gatewayResponse = gatewayResponse.GatewayResponse;
                        console.log("GatewayResponse ", gatewayResponse);
                        console.log("Transactioncheck result "+ gatewayResponse.result);
                        if (gatewayResponse.result != 'SUCCESS')
                        {
                            failFunction(gatewayResponse);
                            routerServiceErrorHandler( gatewayResponse, false);
                        }
                        else
                        {
                            //var obj = [];
                            /*for(var key in gatewayResponse.statusList)
                            {
                                if (obj.hasOwnProperty(key))
                                {*/
                                  //obj[key] = gatewayResponse.statusList[key];
                                /*}
                            }*/
                            console.log("statusList",gatewayResponse.statusList) ;
                            // ParseJSON?
                            okFunction( gatewayResponse.statusList );

                        }
                    },
                    function(error)
                    {
                        console.log("Transaction Check Error " , error);
                        failFunction(error);
                        routerServiceErrorHandler(error, false);
                    }
                );
            },
            function (error) {
                console.log( "RouterServer::sendApprovalItem error " , error);
                failFunction(error);
                routerServiceErrorHandler(error, false);
            }
        );
        /*this._doOAuthAuthentication( extendedActivationKey,
            function() {
                app.routerService.airRouter.putSync( "datafeed/approvals", update, item.id,
                    function(gatewayResponse, correlatedID)
                    {
                        console.log("Send result "+ gatewayResponse.result);
                        if (gatewayResponse.result != 'SUCCESS')
                        {
                            routerServiceErrorHandler( gatewayResponse, false, true );
                        }
                        else
                        {
                            console.log("Sent Correlated ID "+correlatedID);
                            okFunction( correlatedID, gatewayResponse.transactionId );
                        }
                    },
                    function(error)
                    {
                        console.log("Send Error " + error);
                        routerServiceErrorHandler(error, false, true);
                    }
                );
            },
            function (error) {
                console.log( "RouterServer::sendApprovalItem error " + error);
                routerServiceErrorHandler(error, false, true);
            }
        );*/
    }
}
function routerServiceEncode(txt) {
    //return "'"+encodeURIComponent(comment)+"'";
    return "'"+txt+"'";
}




