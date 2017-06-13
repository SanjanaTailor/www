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
    this.errorHandler = errorHandler;
    routerServiceErrorHandler = errorHandler.handleRouterError;
    formatErrorHandler = errorHandler.handleResponseFormatError;
}
var deferredFunctionCall;
var routerServiceErrorHandler = null;
var formatErrorHandler = null;
// Dummy data for get
var dummyData = {"FeedParticipantResponse":{"result":"SUCCESS","message":"","approvals":[
    {"id":"FPMID999","header1":"Debtor - SPC002","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen","category":"Debtor Invoices","details":[
        {"key":"Invoice prefix","value":"S - 12"},
        {"key":"Customer","value":"SPC002 - STEVENS LTD"},
        {"key":"Sub ledger","value":"S01"},
        {"key":"Transaction type","value":"I - Invoice"},
        {"key":"Period","value":"5"},
        {"key":"Year","value":"2012"},
        {"key":"Reference","value":"PO78788"},
        {"key":"Print status","value":"N - No Print"},
        {"key":"Header text","value":"Hire 31/10/12"},
        {"key":"Footer text","value":"Terms strictly 10 days from invoice date"},
        {"key":"Additional text","value":""}
    ],"lines":[
        {"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[
            {"key":"Quantity","value":"1"},
            {"key":"Unit of measure","value":"EA - EACH"},
            {"key":"Price","value":"1000.00"},
            {"key":"Per","value":"1"},
            {"key":"Net value","value":"1000.00"},
            {"key":"VAT code","value":"SR - 20"},
            {"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},
            {"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},
            {"key":"Activity","value":""},
            {"key":"Job","value":""},
            {"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}
        ]}
    ]},
    {"id":"FPMID1001","header1":"Debtor - SPC002","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen","category":"Debtor Invoices","details":[
        {"key":"Invoice prefix","value":"S - 12"},
        {"key":"Customer","value":"SPC002 - STEVENS LTD"},
        {"key":"Sub ledger","value":"S01"},
        {"key":"Transaction type","value":"I - Invoice"},
        {"key":"Period","value":"5"},
        {"key":"Year","value":"2012"},
        {"key":"Reference","value":"PO78788"},
        {"key":"Print status","value":"N - No Print"},
        {"key":"Header text","value":"Hire 31/10/12"},
        {"key":"Footer text","value":"Terms strictly 10 days from invoice date"},
        {"key":"Additional text","value":""}
    ],"lines":[
        {"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[
            {"key":"Quantity","value":"1"},
            {"key":"Unit of measure","value":"EA - EACH"},
            {"key":"Price","value":"1000.00"},
            {"key":"Per","value":"1"},
            {"key":"Net value","value":"1000.00"},
            {"key":"VAT code","value":"SR - 20"},
            {"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},
            {"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},
            {"key":"Activity","value":""},
            {"key":"Job","value":""},
            {"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}
        ]}
    ]},
    {"id":"FPMID1002","header1":"Debtor - SPC002","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen","category":"Debtor Invoices","details":[
        {"key":"Invoice prefix","value":"S - 12"},
        {"key":"Customer","value":"SPC002 - STEVENS LTD"},
        {"key":"Sub ledger","value":"S01"},
        {"key":"Transaction type","value":"I - Invoice"},
        {"key":"Period","value":"5"},
        {"key":"Year","value":"2012"},
        {"key":"Reference","value":"PO78788"},
        {"key":"Print status","value":"N - No Print"},
        {"key":"Header text","value":"Hire 31/10/12"},
        {"key":"Footer text","value":"Terms strictly 10 days from invoice date"},
        {"key":"Additional text","value":""}
    ],"lines":[
        {"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[
            {"key":"Quantity","value":"1"},
            {"key":"Unit of measure","value":"EA - EACH"},
            {"key":"Price","value":"1000.00"},
            {"key":"Per","value":"1"},
            {"key":"Net value","value":"1000.00"},
            {"key":"VAT code","value":"SR - 20"},
            {"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},
            {"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},
            {"key":"Activity","value":""},
            {"key":"Job","value":""},
            {"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}
        ]}
    ]},
    {"id":"FPMID205","header1":"Supplier - Alison's Holding Company","header2":"S/L - P01","header3":"","header4":"Ann Bowen","category":"Supplier Requests","details":[
        {"key":"Type","value":"S - Statement"},
        {"key":"Code","value":"98765432"},
        {"key":"Name","value":"Alison's Holding Company"},
        {"key":"Address line 1","value":"Caldicot"},
        {"key":"Address line 2","value":"Monmouthshire"},
        {"key":"Address line 3","value":""},
        {"key":"Address line 4","value":""},
        {"key":"Post code","value":"NP17 7TT"},
        {"key":"Payment method","value":"PQ - Cheque"},
        {"key":"Bank account","value":""},
        {"key":"Bank sort code","value":""},
        {"key":"Payment terms","value":"30 - 30 DAYS FROM INVOICE DATE"},
        {"key":"Phone no.","value":"01291 641739"},
        {"key":"Sub ledger","value":"P01"},
        {"key":"Contact name","value":"Janice thomas"},
        {"key":"Credit controller id","value":"UA - Not allocated"},
        {"key":"Email address","value":"Alison@gmail.com"},
        {"key":"Payment method sub type","value":""}
    ],"lines":[]},
    {"id":"FPMID206","header1":"Supplier - Alison's Holding Company","header2":"S/L - P01","header3":"","header4":"Ann Bowen","category":"Supplier Requests","details":[
        {"key":"Type","value":"S - Statement"},
        {"key":"Code","value":"98765432"},
        {"key":"Name","value":"Alison's Holding Company"},
        {"key":"Address line 1","value":"Caldicot"},
        {"key":"Address line 2","value":"Monmouthshire"},
        {"key":"Address line 3","value":""},
        {"key":"Address line 4","value":""},
        {"key":"Post code","value":"NP17 7TT"},
        {"key":"Payment method","value":"PQ - Cheque"},
        {"key":"Bank account","value":""},
        {"key":"Bank sort code","value":""},
        {"key":"Payment terms","value":"30 - 30 DAYS FROM INVOICE DATE"},
        {"key":"Phone no.","value":"01291 641739"},
        {"key":"Sub ledger","value":"P01"},
        {"key":"Contact name","value":"Janice thomas"},
        {"key":"Credit controller id","value":"UA - Not allocated"},
        {"key":"Email address","value":"Alison@gmail.com"},
        {"key":"Payment method sub type","value":""}
    ],"lines":[]},
    {"id":"FPMID207","header1":"Supplier - Alison's Holding Company","header2":"S/L - P01","header3":"","header4":"Ann Bowen","category":"Supplier Requests","details":[
        {"key":"Type","value":"S - Statement"},
        {"key":"Code","value":"98765432"},
        {"key":"Name","value":"Alison's Holding Company"},
        {"key":"Address line 1","value":"Caldicot"},
        {"key":"Address line 2","value":"Monmouthshire"},
        {"key":"Address line 3","value":""},
        {"key":"Address line 4","value":""},
        {"key":"Post code","value":"NP17 7TT"},
        {"key":"Payment method","value":"PQ - Cheque"},
        {"key":"Bank account","value":""},
        {"key":"Bank sort code","value":""},
        {"key":"Payment terms","value":"30 - 30 DAYS FROM INVOICE DATE"},
        {"key":"Phone no.","value":"01291 641739"},
        {"key":"Sub ledger","value":"P01"},
        {"key":"Contact name","value":"Janice thomas"},
        {"key":"Credit controller id","value":"UA - Not allocated"},
        {"key":"Email address","value":"Alison@gmail.com"},
        {"key":"Payment method sub type","value":""}
    ],"lines":[]},
    {"id":"FPMID208","header1":"Supplier - SPC002","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen","category":"Supplier Requests","details":[
        {"key":"Invoice prefix","value":"S - 12"},
        {"key":"Customer","value":"SPC002 - STEVENS LTD"},
        {"key":"Sub ledger","value":"S01"},
        {"key":"Transaction type","value":"I - Invoice"},
        {"key":"Period","value":"5"},
        {"key":"Year","value":"2012"},
        {"key":"Reference","value":"PO78788"},
        {"key":"Print status","value":"N - No Print"},
        {"key":"Header text","value":"Hire 31/10/12"},
        {"key":"Footer text","value":"Terms strictly 10 days from invoice date"},
        {"key":"Additional text","value":""}
    ],"lines":[
        {"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[
            {"key":"Quantity","value":"1"},
            {"key":"Unit of measure","value":"EA - EACH"},
            {"key":"Price","value":"1000.00"},
            {"key":"Per","value":"1"},
            {"key":"Net value","value":"1000.00"},
            {"key":"VAT code","value":"SR - 20"},
            {"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},
            {"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},
            {"key":"Activity","value":""},
            {"key":"Job","value":""},
            {"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}
        ]}
    ]},
    {"id":"FPMID209","header1":"Record - Alison's Holding Company","header2":"S/L - P01","header3":"","header4":"Ann Bowen","category":"Record","details":[
        {"key":"Type","value":"S - Statement"},
        {"key":"Code","value":"98765432"},
        {"key":"Name","value":"Alison's Holding Company"},
        {"key":"Address line 1","value":"Caldicot"},
        {"key":"Address line 2","value":"Monmouthshire"},
        {"key":"Address line 3","value":""},
        {"key":"Address line 4","value":""},
        {"key":"Post code","value":"NP17 7TT"},
        {"key":"Payment method","value":"PQ - Cheque"},
        {"key":"Bank account","value":""},
        {"key":"Bank sort code","value":""},
        {"key":"Payment terms","value":"30 - 30 DAYS FROM INVOICE DATE"},
        {"key":"Phone no.","value":"01291 641739"},
        {"key":"Sub ledger","value":"P01"},
        {"key":"Contact name","value":"Janice thomas"},
        {"key":"Credit controller id","value":"UA - Not allocated"},
        {"key":"Email address","value":"Alison@gmail.com"},
        {"key":"Payment method sub type","value":""}
    ],"lines":[]},
    {"id":"FPMID210","header1":"Record - SPC002","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen","category":"Record","details":[
        {"key":"Invoice prefix","value":"S - 12"},
        {"key":"Customer","value":"SPC002 - STEVENS LTD"},
        {"key":"Sub ledger","value":"S01"},
        {"key":"Transaction type","value":"I - Invoice"},
        {"key":"Period","value":"5"},
        {"key":"Year","value":"2012"},
        {"key":"Reference","value":"PO78788"},
        {"key":"Print status","value":"N - No Print"},
        {"key":"Header text","value":"Hire 31/10/12"},
        {"key":"Footer text","value":"Terms strictly 10 days from invoice date"},
        {"key":"Additional text","value":""}
    ],"lines":[
        {"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[
            {"key":"Quantity","value":"1"},
            {"key":"Unit of measure","value":"EA - EACH"},
            {"key":"Price","value":"1000.00"},
            {"key":"Per","value":"1"},
            {"key":"Net value","value":"1000.00"},
            {"key":"VAT code","value":"SR - 20"},
            {"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},
            {"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},
            {"key":"Activity","value":""},
            {"key":"Job","value":""},
            {"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}
        ]}
    ]}
]}};
var testCount = 0;
function callDeferredFunction()
{
    console.log("callDeferredFunction()");
    var data = dummyData.FeedParticipantResponse.data;
    if (testCount < 10)
    {
        deferredFunctionCall(data);
        testCount++;
    }
    else
    {
        testCount = 0;
        app.routerService.simulateError( 43 );
    }
}

var sendItemsCount = 0;
var sentItemsStash = [];
function callStashedFunction(index)
{
    console.log("calling stashed function at index " + index);
    //app.routerService.simulateError(43);
    if (sendItemsCount > 1)
    {
        sendItemsCount = 0;
        var stash = sentItemsStash[index];
        stash.functionCall( stash.item.id );
    }
    else
    {
        sendItemsCount++;
    }
}
RouterService.prototype = {
    /*registerDevice: function(activationKey, registrationPin, okFunction)
    {
        console.log( "RouterService.registerDevice");
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
    attemptToRegister: function( activationKey, registrationPin, okFunction) {
        app.routerService.airGateway.registerDevice( activationKey, registrationPin,  app.device.deviceModel,
            app.device.devicePlatform, app.device.deviceVersion,  app.device.deviceUUID,
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
        this.airGateway.authenticate( loginPin, app.device.deviceModel,
            app.device.devicePlatform, app.device.deviceVersion, app.device.deviceUUID,
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
            } );
    },
    _doOAuthAuthentication: function(activationKey, success, failure) {
        //app.tracker += ", _doOAuthAuthentication";
        console.log( "RouterService._doOAuthAuthentication airGateway "+this.airGateway );
        if (this.airGateway == undefined || this.airGateway == null)
        {
            this.airGateway = new AirGateway(this.baseURL,this.consumerKey,this.consumerSecret,this.appName,this.appVersion);
            this.airGateway.setGatewayRuntimeToken( app.gatewayRuntimeToken );
            this.airRouter = new AirRouter( this.airGateway );
        }
        // We only need to do the authentication part if we have not already got an oauth access token
        if (oauth == undefined || oauth.getAccessTokenKey() == null || oauth.getAccessTokenKey().length < 1)
        {
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
                       console.log("Get result "+ gatewayResponse.result);
                       if (gatewayResponse.result != 'SUCCESS')
                       {
                           failFunction(gatewayResponse);
                           routerServiceErrorHandler( gatewayResponse,showNonCriticalErrors );
                       }
                       else
                       {
                           //parseJSON(gatewayResponse.routingResponse, okFunction);
                           okFunction(getParsedJSON(gatewayResponse.routingResponse), showNonCriticalErrors);
                       }
                    },
                    function( error ) {
                       console.log("GetError:"+error);
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
        this._doOAuthAuthentication( extendedActivationKey,
            function() {
                app.routerService.airRouter.putSync( "datafeed/approvals", update, itemID,
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
                routerServiceErrorHandler(error, showNonCriticalErrors);
            }
        );
    },*/
    registerDevice: function(activationKey, registrationPin, okFunction)
    {
        //this.simulateError(registrationPin);
        /*if (registrationPin.length >= 3 && registrationPin.length < 7)
         {
         // The ok
             registeredPin = registrationPin;
             console.log("RegisteredPin", registrationPin);
             okFunction("123456789", "DeviceID");
         }
         else
         {
         // Simulate an error*/
             this.simulateError(registrationPin);
         //}
    },
    loginToRouter: function(extendedActivationKey, loginPin, okFunction, invalidPinFunction)
    {
        errorDialogCloseFunction = invalidPinFunction;
        // We have been authenticated so try to login
        // For now just check against the registered user pin
        setTimeout( function() {
            if (registeredPin == loginPin)
            {
                // Valid login
                okFunction(extendedActivationKey, 1);
            }
            else
            {
                // Invalid pin attempt
                app.routerService.simulateError(45);
            }
        }, 100 );
    },
    getApprovalItems: function(extendedActivationKey, showNonCriticalErrors, okFunction, failFunction)
    {
        // Get the items and if all ok invoke the okFunction
        deferredFunctionCall = okFunction;

        // Simulate getting access to the server
        //var tId = setTimeout("callDeferredFunction();", 500000);
        //callDeferredFunction();
        console.log("Router", deferredFunctionCall, okFunction);
        //deferredFunctionCall( dummyData.FeedParticipantResponse);
        if (showNonCriticalErrors)
        {
             this.getOnDemandApprovals(extendedActivationKey, okFunction, failFunction);
        }
        else
        {
            this.getTimerApprovals(extendedActivationKey, okFunction, failFunction);
        }
    },
    getOnDemandApprovals: function(extendedActivationKey, okFunction, failFunction)
    {
        // Get the items and if all ok invoke the okFunction
        deferredFunctionCall = okFunction;

        // Simulate getting access to the server
        //var tId = setTimeout("callDeferredFunction();", 500000);
        //callDeferredFunction();
        console.log("Router", deferredFunctionCall, okFunction);
        deferredFunctionCall( dummyData.FeedParticipantResponse);
        //this.simulateError(12, true);
    },
    getTimerApprovals: function(extendedActivationKey, okFunction, failFunction)
    {
        // Get the items and if all ok invoke the okFunction
        deferredFunctionCall = okFunction;

        // Simulate getting access to the server
        //var tId = setTimeout("callDeferredFunction();", 500000);
        //callDeferredFunction();
        console.log("Router", deferredFunctionCall, okFunction);
        //deferredFunctionCall( dummyData.FeedParticipantResponse);
        failFunction();
        this.simulateError(12, false);
    },
    getTransactionStatusList: function(extendedActivationKey, trans, showNonCriticalErrors, ignoreNonCriticalErrors, success)
    {
        // Get the items and if all ok invoke the okFunction
        //this.deferredFunctionCall = okFunction;
        //okfunction();
        // Simulate getting access to the server

        //
        /*var AUTH_EXPIRED = 2;
         var NO_AUTH = 3;
         var INVALID_REGISTRATION_PARAMS = 4;
         var ACTIVATION_KEY_EXPIRED = 6;
         var GATEWAY_EXCEPTION = 10;
         var TARGET_EXCEPTION = 11;
         var GATEWAY_NETWORK_ISSUE = 12;
         var TARGET_CONFIG_ISSUE  = 13;
         var USER_UNREGISTERED = 40;
         var INVALID_TARGET = 41;
         var INVALID_APP_VERSION = 42;
         var DEVICE_UNREGISTERED = 43;
         var DEVICE_UNREGISTERED_FOR_APP = 44;
         var INVALID_ACCESS_PIN = 45;
         var INVALID_PARAMETERS = 46;*/

        app.routerService.simulateError(2);
    },
    sendApprovalItem: function(item, okFunction)
    {
        // We need to simulate sending this item to the remote server
        // In this simulator is it not easy as we do not want
        // to overwrite any single value as this will be called multiple times
        var stash = { item: item, functionCall: okFunction };
        var length = sentItemsStash.push(stash);
        var index = length - 1;
        var sId = setTimeout("callStashedFunction(" + index + ");", 300);
    },
    simulateTransactionError: function(code, showErrors)
    {
        var error = {};
        error.status = 700;
        error.code = 0;
        error.detail = "";
        error.transactionId = 23;
        this.errorHandler.handleRouterError(error, true);
    },
    simulateStatusError: function(code, showErrors)
    {
        var error = {};
        error.status = 500;
        error.code = 0;
        error.detail = "";
        error.transactionId = null;
        this.errorHandler.handleRouterError(error, true);
    },
    simulateError: function(code, showErrors)
    {
        var error = {};
        error.status = 500;
        error.code = 0;
        error.detail = "";
        error.transactionId = null;
        this.errorHandler.handleRouterError(error, true);
    }
}
function routerServiceEncode(txt) {
    //return "'"+encodeURIComponent(comment)+"'";
    return "'"+txt+"'";
}




