/**
 * version: 1
 * @constructor
 *
 */
var ApprovalsApp = function()
{
    // Create persistent store
    this.persistentStore = new ApprovalsStore();

    this.oauthConsumerKey = 'dpf43f3p2l4k3l03';
    this.oauthConsumerSecret = 'kd94hf93k423kf44';
    //this.baseURL = 'http://air.elasticfms.co.uk/mobileservices';
    //this.baseURL = 'https://air.advancedcomputersoftware.com/mobileservices';
    //this.baseURL = 'http://ghehrm03:5000/mobileservices';
    this.appName = "ADV_APPROVALS";
    this.appVersion = "1.0";
    this.clientVersion = "1.4.41";

    this.gatewayRuntimeToken = null;

    // Statuses
    this.loggedIn = false;
    this.hasHadData = false;
    this.pausedState = false;
    this.loginDisabled = false;
    this.registerDisabled = false;
    this.updateListRequired = false;
    this.updateListInProgress = false;
    this.modalDialogShown = false;
    this.clickTime = null;
    this.dataResetPerformed = false;
    this.mode = null;



    this.OTHER =  "Mobile";

    this.createDynamicClasses();
}
INTERNET_EXPLORER_DEVICE = "Internet Explorer";
INTERNET_EXPLORER_NAV = "msie";
OPERA_DEVICE = "Opera";
OPERA_NAV = "opera";
MOZILLA_DEVICE = "Mozilla";
MOZILLA_NAV = "mozilla";
CHROME_DEVICE = "Chrome";
CHROME_NAV = "chrome";
SAFARI_DEVICE = "Safari";
SAFARI_NAV = "safari";
CHROME_TEST = /chrome/.test(navigator.userAgent.toLowerCase());
SAFARI_TEST = /safari/.test(navigator.userAgent.toLowerCase());
MOZILLA_TEST = /mozilla/.test(navigator.userAgent.toLowerCase());
OPERA_TEST = /opera/.test(navigator.userAgent.toLowerCase());
INTERNET_EXPLORER_TEST = /msie/.test(navigator.userAgent.toLowerCase());
VERSION_NAV = "Version";

LIVE_MODE = "LIVE";
TEST_MODE = "TEST";
TRIAL_MODE = "TRIAL";


var UUID_PERSISTENT_KEY = "APPROVALS_UUID_STORE";
ApprovalsApp.prototype = {
    handleKeyboardShown: function()
    {
        $("input").on("keydown",
            function(e)
            {
                if(e.keyCode == 13) {
                    document.activeElement.blur();
                }
            }
        );
    },
    setMode: function(mode)
    {
        this.mode = mode;
        this.model.setMode(this.mode);
    },
    createDynamicClasses: function()
    {
        // Remove the local runtime access token
        this.gatewayRuntimeToken = null;

        this.loggedIn = false;
        this.hasHadData = false;
        this.pausedState = false;
        this.loginDisabled = false;
        this.registerDisabled = false;
        this.updateListRequired = false;
        this.updateListInProgress = false;
        this.modalDialogShown = false;
        this.model = new ApprovalsModel(this.persistentStore);
        this.model.loadDataFromPersistentStore();
        if(this.mode == "" || this.mode == null || this.mode == undefined)
        {
            this.mode = this.model.getMode();
            if(this.mode == "" || this.mode == null || this.mode == undefined)
            {
               this.setMode(LIVE_MODE);
            }
            else
            {
               this.setMode(this.model.getMode());
            }
        }
        if (this.mode == "TEST")
        {
            //this.baseURL = 'http://air.elasticfms.co.uk/mobileservices';
            //this.baseURL = 'https://air.advancedcomputersoftware.com/mobileservices';
            this.baseURL = 'http://ghair01.coa.local:9000/mobileservices';
        }
        else
        {
            //this.baseURL = 'http://air.elasticfms.co.uk/mobileservices';
            this.baseURL = 'https://air.advancedcomputersoftware.com/mobileservices';
            //this.baseURL = 'http://ghair01:9000/mobileservices';
        }
        if(this.model.extendedActivationKey === "extendedTrial")
        {
            this.mode = "TRIAL";
        }
        this.model.clearSendInProgress();
        this.view = new ApprovalsView(this.model);
        if (this.controller != null)
        {
            this.controller.destroy();
        }
        this.controller = new ApprovalsController(this.model, this.view);
        this.defaultErrorHandler = new DefaultErrorHandler();
        if (this.mode == "TRIAL")
        {
            this.routerService = new TrialRouterService(this.baseURL, this.appName, this.appVersion, this.clientVersion,
                this.oauthConsumerKey, this.oauthConsumerSecret, this.defaultErrorHandler);
        }
        else
        {
            this.routerService = new RouterService(this.baseURL, this.appName, this.appVersion, this.clientVersion,
                this.oauthConsumerKey, this.oauthConsumerSecret, this.defaultErrorHandler);
        }
    },
    clearDeviceData:function()
    {
        this.device = {};
        this.device.deviceVersion = null;
        this.device.deviceModel = null;
        this.device.devicePlatform = null;
        this.persistentStore.putPersistedData( UUID_PERSISTENT_KEY, "" );
    },
    getDeviceDetails: function()
    {
        // Go check to see if we have the uuid in the persistent store
        this.device = {};
        this.device.deviceUUID = this.getPersistedUUID();
        try
        {
            var mod = device.model;
            console.log(mod);
            this.device.deviceModel = device.model;
            if (device.platform == "Win32NT") {
                if (/Windows Phone/i.test(navigator.userAgent))
                {
                    this.device.devicePlatform = "Windows Phone";
                }
                else
                {
                    this.device.devicePlatform = "Windows";
                }
            }
            else {
                this.device.devicePlatform = device.platform;
            }
            this.device.deviceVersion = device.version;
        }
        catch(e)
        {
            this.device.deviceModel = "Computer";
            this.getPlatform();
            //this.device.deviceVersion = navigator.appVersion;
            //console.log("DeviceVersion "+this.device.deviceVersion);
        }
        console.log( "Device UUID " + this.device.deviceUUID );
    },
    getPersistedUUID: function() {
        // Try to get uuid from store
        var key = this.persistentStore.getPersistedData( UUID_PERSISTENT_KEY );
        console.log("Stored Device ID "+key);
        if (key == null)
        {
            key = "";
        }
        return key;
    },
    setPersistentUUID:function(deviceId)
    {
        this.device.deviceUUID = deviceId;
        this.persistentStore.putPersistedData( UUID_PERSISTENT_KEY, app.device.deviceUUID );
        app.getDeviceDetails();
    },
    onOffline: function()
    {
    },
    onOnline: function()
    {
    },
    onPause: function()
    {
        app.pausedState = true;
    },
    onResume: function()
    {
        app.pausedState = false;
    },
    displayFirstScreen: function()
    {
        console.log("displayFirstScreen()");
        // Just delegate to controller
        app.controller.showFirstPage();
    },
    handleReRegister: function()
    {
        this.view.showModalConfirmDialog(
            "Confirm", "This will remove your registration information",
            function()
            {
                app.handleReRegisterConfirmation()
            },
            function(){
                closeDialog();
            }
        );
    },
    handleCancelReRegister: function()
    {
        console.log("Register Canceled");
        closeDialog();
    },
    handleCancelReject: function()
    {
        app.controller.handleGoToItemPage(-1);
    },
    handleReRegisterConfirmation: function()
    {
        // Called from modal dialog so cannot use the normal this operator
        console.log( "ReRegister Click");
        app.wipeLocalStorage();
        app.restartApp();
    },
    restartApp: function(baseURL)
    {
        console.log("restartApp()");
        this.view.hideLoading();
        this.createDynamicClasses(baseURL);
        this.displayFirstScreen();
    },
    requiresOAuthAuthorisation: function()
    {
        // Need to remove OAuth details
        this.createDynamicClasses();
        this.displayFirstScreen();
    },
    wipeLocalStorage: function()
    {
        // Delete all store information
        this.persistentStore.putPersistedData( UUID_PERSISTENT_KEY, "" );
        app.getDeviceDetails();
        this.model.clearAllPersistentData();
    },
    wipeAuthenticationDetails: function()
    {
        // Clear the uuid from persistent store
        this.persistentStore.putPersistedData( UUID_PERSISTENT_KEY, "" );
        app.getDeviceDetails();
        // Just delete the local stored value for the activation key
        this.model.wipeAuthenticationDetails();
    },
    getIP: function ()
    {
        if (window.XMLHttpRequest)
        {
            xmlhttp = new XMLHttpRequest();
        }
        else
        {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET", "js/getip.jsp", false);
        xmlhttp.send();
        try
        {
            var JSONResponse = JSON.parse(xmlhttp.responseText);
            return JSONResponse.ip + "0"; // May need to change but probably not important
        }
        catch (error)
        {
           throw error;
        }
    },
    getPlatform: function ()
    {
        // Based on:
        // http://jsfiddle.net/pupunzi/dnJNS/
        var pos;
        var end;
        var rest = "";
        var posOfBrowser;
        var posOfVersion;
        console.log("USER_AGENT "+navigator.userAgent);
        if (navigator.userAgent.toLowerCase().indexOf(OPERA_NAV)!=-1)
        {
            pos = navigator.userAgent.toLowerCase().indexOf("opera");
            this.device.devicePlatform = this.OPERA_DEVICE;
            // Find version
            if (pos = navigator.userAgent.indexOf(OPERA_NAV))
            {
                rest = navigator.userAgent.substring(pos+(OPERA_NAV.length+1));
            }
            else
            {
                rest = navigator.userAgent.substring(pos+VERSION_NAV.length);
            }
            /*if (rest.indexOf(";")!=-1)
            {
                end = rest.indexOf(";");
            }
            else if (rest.indexOf(" ")!=-1)
            {
                end = rest.indexOf(" ");
            }
            this.device.deviceVersion = rest.substring(0,end);*/

        }
        else if (navigator.userAgent.toLowerCase().indexOf(INTERNET_EXPLORER_NAV)!=-1)
        {
            pos = navigator.userAgent.toLowerCase().indexOf(INTERNET_EXPLORER_NAV);
            this.device.devicePlatform = INTERNET_EXPLORER_DEVICE;
            //Move to version
            rest = navigator.userAgent.substring(pos+(INTERNET_EXPLORER_DEVICE.length+1));
            /*if (rest.indexOf(";")!=-1)
            {
                end = rest.indexOf(";");
            }
            else if (rest.indexOf(" ")!=-1)
            {
                end = rest.indexOf(" ");
            }
            this.device.deviceVersion = rest.substring(0,end);*/
        }
        else if (navigator.userAgent.toLowerCase().indexOf(CHROME_NAV)!=-1)
        {
            pos = navigator.userAgent.toLowerCase().indexOf(CHROME_NAV);
            this.device.devicePlatform = CHROME_DEVICE;
            // Move to version
            rest = navigator.userAgent.substring(pos+(CHROME_DEVICE.length+1));
            /*if (rest.indexOf(";")!=-1)
            {
                end = rest.indexOf(";");
            }
            else if (rest.indexOf(" ")!=-1)
            {
                end = rest.indexOf(" ");
            }
            this.device.deviceVersion = rest.substring(0,end);*/
        }
        else if (navigator.userAgent.toLowerCase().indexOf(SAFARI_NAV)!=-1)
        {
            pos = navigator.userAgent.toLowerCase().indexOf(SAFARI_NAV);
            this.device.devicePlatform = SAFARI_DEVICE;
            if ((pos = navigator.userAgent.indexOf(SAFARI_NAV))!=-1)
            {
                rest = navigator.userAgent.substring(pos+(SAFARI_NAV.length+1));
            }
            else
            {
                rest = navigator.userAgent.substring(pos+VERSION_NAV.length);
            }
            /*if (rest.indexOf(";")!=-1)
            {
                end = rest.indexOf(";")
            }
            else if (rest.indexOf(" ")!=-1)
            {
                end = rest.indexOf(" ");
            }
            this.device.deviceVersion = rest.substring(0,end);*/

        }
        else if (navigator.userAgent.toLowerCase().indexOf(MOZILLA_NAV)!=-1)
        {
            pos = navigator.userAgent.toLowerCase().indexOf(MOZILLA_NAV);
            this.device.devicePlatform = MOZILLA_DEVICE;
            rest = navigator.userAgent.substring(pos+(SAFARI_NAV.length+1));
        }
        else
        {
            this.device.devicePlatform = "Mobile";
        }
        if (rest.indexOf(";")!=-1)
        {
            end = rest.indexOf(";");
        }
        if (rest.indexOf(" ")!=-1)
        {
            end = rest.indexOf(" ");
        }
        this.device.deviceVersion = rest.substring(1,end);
    },
    clearOAuthDetails: function(){
        app.model.airGateway = null;
        oauth = null;
    }
}
function getPlatformName()
{
    //if ($.browser.msie)
    if (INTERNET_EXPLORER_TEST)
    {
        return this.INTERNET_EXPLORER_DEVICE;
    }
    //else if ($.browser.opera)
    else if (OPERA_TEST)
    {
        return this.OPERA_DEVICE;
    }
    //else if ($.browser.chrome)
    else if (CHROME_TEST)
    {
        return this.CHROME_DEVICE;
    }
    //else if ($.browser.safari)
    else if (SAFARI_TEST)
    {
        return this.SAFARI_DEVICE;
    }
    //else if ($.browser.mozilla)
    else if (MOZILLA_TEST)
    {
        return this.MOZILLA_DEVICE;
    }
    return "Mobile";
}
function isMobile()
{
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
}
function parseJSON(json, success)
{
    try
    {
        var response = JSON.parse(json);
    }
    catch(error)
    {
        //error.detail = "Response format error";
        //failure(error);
        handleResponseFormatError();
        //app.routerService.formatErrorHandler();
        return;
    }
    success(response);
}
function getParsedJSON(json)
{
    try
    {
        var response = JSON.parse(json);
    }
    catch(error)
    {
        handleResponseFormatError();
    }
    return response;
}
function closeDialog()
{
    $.mobile.changePage(window.location.hash);
}





