var DefaultErrorHandler = function() {
    numberOfErrors = 0;
}

var AUTHORISATION_EXCEPTION = 2;
var NETWORK_EXCEPTION = 10;
var DISABLED_EXCEPTION = 20;
var DELETED_EXCEPTION = 30;
var AUTHENTICATION_EXCEPTION = 40;
var UNKNOWN_EXCEPTION = 50;

//Authorisation Exception
var AUTH_EXPIRED = 2;
var NO_AUTH = 3;
var INVALID_REGISTRATION_PARAMS = 4;
var INVALID_ACTIVATION_KEY = 5;
var ACTIVATION_KEY_EXPIRED = 6;
var DATA_RESET_REQUIRED = 7;


//Network Exception
var GATEWAY_EXCEPTION = 10;
var TARGET_EXCEPTION = 11;
var GATEWAY_NETWORK_ISSUE = 12;
var TARGET_CONFIG_ISSUE  = 13;

    // Target Business Exception
    var TARGET_BUSINESS_EXCEPTION = 14;

//Disabled Exception
var TENANT_DISABLED = 20;
var USER_DISABLED = 21;
var DEVICE_DISABLED = 22;
var TENANT_APP_DISABLED = 23;
var USER_APP_DISABLED = 24;
var MOB_APP_VER_DISABLED = 25;
var TENANT_LOCKED = 26;
var disabledMessage = [
    "Your company's access has been disabled.",
    "Your user's access has been disabled.",
    "This device's access has been disabled.",
    "Your access to this application has been disabled.",
    "Your access to this application has been disabled.",
    "Your access to this application version has been disabled.",
    "Access for your company has been denied."
];

//Delete Exception
var TENANT_DELETED = 30;
var USER_DELETED = 31;
var USER_APP_DELETED = 32;
var DEVICE_DELETED = 33;
//var NO_DEVICE_USER_LINK = 34;
var deletedMessage = [
    "Your company's access has been revoked.",
    "Your user's access has been revoked.",
    "Your access to this application has been revoked.",
    "This device's access has been revoked."//,
    //"Your user's access has been revoked."
];

var INVALID_VERIFIER = -10;
var invalidVerifier = "The activation key was invalid.";
//var RESPONSE_FORMAT_ERROR = -11;
var responseFormatErrorMessage = "There is a problem with the information received from the Gateway.";
var DEVICE_ID_UNAVAILABLE = -12;
var deviceIDUnavailableMessage = "Unable to identify device.";

//Authentication Exception
var USER_UNREGISTERED = 40;
var INVALID_TARGET = 41;
var INVALID_APP_VERSION = 42;
var DEVICE_UNREGISTERED = 43;
var DEVICE_UNREGISTERED_FOR_APP = 44;
var INVALID_ACCESS_PIN = 45;
var INVALID_PARAMETERS = 46;

var contactAdministrator = " Please contact your system administrator.";
var errorDialogCloseFunction = null;
var numberOfErrors = 0;
var maxNumberOfErrors = 10;

function resetErrorCount()
{
    numberOfErrors = 0;
}
function accessError(code)
{
  messageText = "You do not have access to this application." + contactAdministrator;
  app.view.showErrorPage( messageText, code );
}
function authorisationError()
{
    var msg = "";
    var suffix = "are invalid.";
    if (!app.model.isRegistered())
    {
       msg = "You will need to reregister.";
    }
    else
    {
       if(app.hasHadData)
       {
           var suffix = "have expired.";
       }
       msg = "You will need to login again.";
    }
    app.view.showModalDialog("Your authorisation credentials " + suffix + " "+ msg,
        function() { app.restartApp(); });
}
function generalError()
{
    app.view.showModalDialog(
        "Internal problem detected. Please restart the application.",
        function() { app.restartApp(); } );
}
function securityError (code)
{
    app.view.showErrorPage( "A low level security problem has occurred.", code );
}
function serverNetworkError (code)
{
    var message = "There has been a network problem.";
    if(app.hasHadData) {
        app.view.showModalDialog(
            message,
            function () {
                closeDialog();
            }, code);
    }
    else {
        app.view.showModalDialog(
            message+" The app will restart",
            function () {
                app.restartApp();
            }, code);
    }
}
function handleResponseFormatError()
{
    app.view.hideLoading();
    checkErrorCount();
    app.view.showErrorPage( this.responseFormatErrorMessage );
}
function handleDeviceIDUnavailable()
{
    app.view.hideLoading();
    checkErrorCount();
    app.view.showErrorPage(deviceIDUnavailableMessage);
}
function handleAdminConfig (code)
{
    app.view.showModalDialog("There has been an Administrator Configuration exception."+contactAdministrator,
        function() { app.restartApp(); }, code);
}
function checkErrorCount()
{
  // Check a maximum number of errors allowed
  if (numberOfErrors++ > maxNumberOfErrors)
  {
      app.setMode(LIVE_MODE);
      generalError();
      return;
  }
}
function invalidActivationKey(data)
{
    app.view.hideLoading();
    if  (app.model.extendedActivationKey == null)
    {
        app.view.showModalDialog("Activation Key invalid. Please try again.",
           function()
           {
             app.restartApp();
           }, data.code
        );
    }
    else
    {
        app.wipeLocalStorage();
        app.view.showErrorPage( "Activation Key invalid. Please reregister.", data.code );
    }
}
function expiredActivationKey(data)
{
    app.view.hideLoading();
    if  (app.model.extendedActivationKey == null)
    {
        app.view.showModalDialog("Activation Key expired. "+contactAdministrator,
            function()
            {
                app.restartApp();
            }, data.code
        );
    }
    else
    {
        app.wipeLocalStorage();
        app.view.showErrorPage( "Activation Key expired. "+contactAdministrator, data.code );
    }
}

DefaultErrorHandler.prototype = {
    setDialogCloseFunction: function(closeFunction)
    {
        errorDialogCloseFunction = closeFunction;
    },
    handleRouterError: function (data, showNonCriticalErrorDialog )
    {
        app.view.hideLoading();
        console.log("Error: Status "+data.status+" Text "+data.text+" Response "+data.responseText+" Result "+data.result +" Detail "+data.detail);
        console.log("showNonCriticalErrorDialog", showNonCriticalErrorDialog);
        console.log("code", data.code);
        if (data.status == 0 || data.status == 400)
        {
            var errorHandler = null;
            if (showNonCriticalErrorDialog) // ie showNoCriticalErrorDialog is true
            {
                /*if (!ignoreNonCriticalErrors)
                {
                    errorHandler = function() { app.restartApp(); };
                }*/
                serverNetworkError();
            }
            return;
        }
        var messageText = "";
        if (data.code >= AUTHORISATION_EXCEPTION && data.code < NETWORK_EXCEPTION)
        {
            if (data.code == AUTH_EXPIRED || data.code == NO_AUTH)
            {
                app.view.showModalDialog(
                    "The connection to the server has timed out. You will need to login again.",
                    function() { app.requiresOAuthAuthorisation(); }, data.code );
                console.log("The connection to the server has timed out. You will need to login again.");
            }
            else if (data.code == INVALID_REGISTRATION_PARAMS)
            {
                app.view.showModalDialog(data.detail,function() {
                    console.log( "wiping system and starting again" );
                    app.wipeAuthenticationDetails();
                    app.restartApp();
                }, data.code);
                checkErrorCount();
            }
            else if (data.code == INVALID_ACTIVATION_KEY)
            {
                 invalidActivationKey(data);
            }
            else if (data.code == ACTIVATION_KEY_EXPIRED)
            {
                expiredActivationKey(data);
            }
            else if (data.code == DATA_RESET_REQUIRED)
            {
                app.view.showModalDialog(data.detail + ". You will need to login again.",function() {
                    console.log( "gateway end point switched, data reset" );
                    //app.wipeAuthenticationDetails();
                    app.clearOAuthDetails();
                    app.model.clearApplicationStoredData();
                    app.dataResetPerformed = true;
                    app.restartApp();
                }, data.code);
            }
            else
            {
                app.view.showErrorPage(
                    "Failed to complete transaction." + contactAdministrator, data.code );
            }
        }
        else if (data.code >= NETWORK_EXCEPTION && data.code < DISABLED_EXCEPTION)
        {
            // Problems with gateway talking to data feed, so only report if we have not received data
            if (data.code == TARGET_CONFIG_ISSUE)
            {
               handleAdminConfig(data.code);
            }
            else if (showNonCriticalErrorDialog)
            {
               serverNetworkError(data.code);
            }
            return;
        }
        else if (data.code >= DISABLED_EXCEPTION && data.code < DELETED_EXCEPTION)
        {
            if (data.code != TENANT_LOCKED)
            {
                app.setMode(LIVE_MODE);
                app.wipeLocalStorage();
            }
            accessError(data.code);
		    /*if ((data.code - DISABLED_EXCEPTION) < disabledMessage.length)
			{
                messageText = disabledMessage[data.code - DISABLED_EXCEPTION] + contactAdministrator;
			}
			else
			{
			    messageText = "Your access to this application has been disabled." + contactAdministrator;
			}
            app.view.showErrorPage( messageText, data.code );*/
            
        }
        else if (data.code >= DELETED_EXCEPTION && data.code < AUTHENTICATION_EXCEPTION)
        {
            app.setMode(LIVE_MODE);
            app.wipeLocalStorage();
            //app.restartApp();
            
			/*if ((data.code - DELETED_EXCEPTION) < deletedMessage.length)
			{
                messageText = deletedMessage[data.code - DELETED_EXCEPTION] + contactAdministrator;
			}
			else
			{
			    messageText = "Your access to this application has been revoked."+ contactAdministrator;
			}
            app.view.showErrorPage( messageText, data.code );*/
            accessError(data.code);
        }
        else if (data.code >= AUTHENTICATION_EXCEPTION && data.code < UNKNOWN_EXCEPTION)
        {
            if (data.code == DEVICE_UNREGISTERED)
            {
                app.view.showModalDialog(
                    "This device is not registered.",
                    function() {
                        console.log( "wiping system and starting again" );
                        app.wipeAuthenticationDetails();
                        app.restartApp();
                    }, data.code);
            }
            else if (data.code == DEVICE_UNREGISTERED_FOR_APP)
            {
                /*app.wipeLocalStorage();
                messageText = "Access from this device has been revoked." + contactAdministrator;
                app.view.showErrorPage( messageText, data.code );*/
                accessError(data.code);
            }
            else if (data.code == USER_UNREGISTERED)
            {
                app.wipeLocalStorage();
                messageText = "You are not registered." + contactAdministrator;
                app.view.showErrorPage( messageText, data.code );
            }
			else if (data.code == INVALID_TARGET)
            {
                // ServerNetworkError
                serverNetworkError(data.code);
            }
			else if (data.code == INVALID_APP_VERSION)
            {
                app.view.showErrorPage( "This version of the app has been superseded. Please upgrade.", data.code );
            }
            else if (data.code == INVALID_PARAMETERS)
            {
                securityError(data.code);
            }
            else if (data.code == INVALID_ACCESS_PIN)
            {
                console.log( "Error: invalid access pin detected" );
                app.view.showModalDialog(
                    "Invalid access pin, please try again.", errorDialogCloseFunction, data.code);
                checkErrorCount();
            }
            else
            {
                securityError(data.code);
            }
        }
        else if (data.detail != null && data.detail != undefined && data.detail != "") // Catch all for code being larger than we have handled
        {
            // Could do with checking the activation key, due to verifier wrong
            console.log( "low level error " + data.detail );
            if (data.detail.indexOf( "Invalid verifier" ) > -1)
            {
                // Probably due to an invalid activation key
                invalidActivationKey(data);
            }
            else if (data.code != undefined)
            {
                app.view.showModalDialog(
                    "You need to reconnect to the server. The App will restart",
                    function() { app.restartApp(); }, data.code );
               //app.view.showErrorPage( "You need to reconnect to the server. Please restart the application." );
            }
            else
            {
                //app.view.showErrorPage( "You need to reconnect to the server."+ data.detail, data.code );
                app.view.showModalDialog(
                    "You need to reconnect to the server."+ data.detail +" The App will restart",
                    function() { app.restartApp(); }, data.code );
            }
            //checkErrorCount();
            /*else
            {
                // May need expanding
                app.view.showErrorPage( "You need to reconnect to the server. Please restart the application." );
            }*/
        }
        else if (data.transactionId != null && data.transactionId != "" && data.transactionId != " ")
        {
            app.view.showTransactionErrorPage( "A server problem occurred", data.transactionId);
            checkErrorCount();
        }
        else if (data.status == 401)
        {
            /*app.view.showModalDialog("Credentials invalid. Please try again.",
                function() { app.restartApp(); });*/
            authorisationError();
        }
		else if (data.status >= 500 && data.status < 600)
        {
            if (showNonCriticalErrorDialog)
            {
                app.view.showStatusErrorPage( "Server Unavailable.", data.status );
                checkErrorCount();
            }
            return;
        }
        else
        {
            generalError();
        }
    },
    handleValidationError: function()
    {
        checkErrorCount();
    },
    handlePersistenceError:function()
    {
        checkErrorCount();

    },
    decodeDetail: function()
    {
        checkErrorCount();
    }
}
