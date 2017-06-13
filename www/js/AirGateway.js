var AirGateway = function(baseURL,oauthConsumerKey,oauthConsumerSecret,appName,appVersion, clientVersion) {
    this.baseURL = baseURL;
    this.oauthConsumerKey = oauthConsumerKey;
    this.oauthConsumerSecret = oauthConsumerSecret;
    this.appName = appName;
    this.appVersion = appVersion;
    this.clientVersion = clientVersion;
    this.oauthGateway = null;
    this._initGateway();
}

var registrationSuccess, registrationFailure;
var oauth;

AirGateway.prototype = {
    _initGateway: function(oauthOptions) {
        console.log("airGateway.initGateway-Options:",oauthOptions );
        var options = {
            realm: '',
            async: false,
            requestTokenUrl: this.baseURL + '/oauth/requestToken',
            authorizationUrl: this.baseURL + '/oauth/authorization',
            accessTokenUrl: this.baseURL + '/oauth/accessToken',
            consumerKey: this.oauthConsumerKey,
            consumerSecret: this.oauthConsumerSecret
        };

        this.oauthGateway = new OAuthGateway(options);
        oauth = this.oauthGateway.oauth;
    },
    setGatewayRuntimeToken: function(gatewayToken) {
        console.log( "airGateway._setGatewayRuntimeToken");
        this.oauthGateway.setGatewayRuntimeToken(gatewayToken);
    },
    fetchRequestToken: function(activationKey,success,failure) {
        console.log( "gateway._fetchRequestToken");
        registrationSuccess = success;
        registrationFailure = failure;
        this.oauthGateway.oauth.fetchRequestToken(
            function (response)
            {
                // Now get the access token
                console.log( "fetchRequestToken: " + response);
                console.log( "setting verifier: " + activationKey );
                oauth.setVerifier( activationKey );
                oauth.fetchAccessToken( registrationSuccess, registrationFailure );
            }
            , function(error) {
                console.log( "Fetch request token failed " + error );
                registrationFailure(error);
            } );
    },
    authenticate: function( accessPin, deviceModel, platform, platformVersion, uuid, success, failure, dataResetPerformed ) {
        console.log("Model "+deviceModel+" Pin "+accessPin+" DeviceID "+uuid );
        var values = { GatewayRequest: {
            'accessPin' : accessPin,
            'deviceId': uuid, // This should be the phone identifier
            'appId': this.appName,
            'appVersion': this.appVersion,
            'clientVersion': this.clientVersion,
            'devicePlatform': platform,
            'devicePlatformVersion': platformVersion,
            'deviceModel': deviceModel,
            'dataResetPerformed': dataResetPerformed
        } };
        console.log("authenticationValues ", values);
        console.log("baseURL ", this.baseURL);
        this.oauthGateway.postSync( this.baseURL + "/gateway/authenticate"+"?rand="+new Date().getTime(), values, success, failure );
    },
    registerDevice: function( activationKey, accessPin, deviceModel, platform, platformVersion, uuid, success, failure )
    {
        // We should already be oauth authenticated, so make the call
        // {"accessPin":"123456","uuid":"112233445566778899","appId":"FPM_APPROVE","appVersion":"1.0"}
        console.log("Key "+activationKey+" Model "+deviceModel+" Pin "+accessPin+" DeviceID "+uuid );
        var values = { GatewayRequest: {
            'activationKey' : activationKey,
            'accessPin' : accessPin,
            'deviceId': uuid, // This should be the phone identifier
            'appId': this.appName,
            'appVersion': this.appVersion,
            'clientVersion': this.clientVersion,
            'devicePlatform': platform,
            'devicePlatformVersion': platformVersion,
            'deviceModel': deviceModel
        } };
        console.log("registrationValues ", values);
        console.log("baseURL ", this.baseURL);
        this.oauthGateway.postSync( this.baseURL + "/gateway/register"+"?rand="+new Date().getTime(), values, success, failure );
    },
    postTransactions: function( txIds, success, failure )
    {
        var values = { GatewayRequest: {
            'transactionIds':txIds
        } };
        console.log("baseURL ", this.baseURL);
        this.oauthGateway.postSync( this.baseURL + "/gateway/txstatus"+"?rand="+new Date().getTime(), values, success, failure );
    }
}

