var OAuthGateway = function(oauthOptions) {
    this.oauth = OAuth(oauthOptions);
    this.gatewayRuntimeToken = null;
}

OAuthGateway.prototype = {
    setGatewayRuntimeToken: function(gatewayToken) {
        this.getwayRuntimeToken = gatewayToken;
    },
    get: function( url, success, failure) {
        this.oauth.request({
            'method': 'GET',
            'url': url,
            'success':
            function (response)
            {
               parseJSON(response.text,success);
            },
            'failure': function(error) { console.log( "Low level error ", error ); failure(error); },
            'headers': {
                'Accept': 'application/json',
                'ADV_gatewayToken': this.getwayRuntimeToken,
                'ADV_async': true
            }
        });
    },
	getSync: function( url, success, failure) {
        this.oauth.request({
		    'async':false,
            'method': 'GET',
            'url': url,
            'success':
            function (response)
            {
               parseJSON(response.text,success);
            },
            'failure': function(error) { console.log( "Low level error ", error ); failure(error); },
            'headers': {
                'Accept': 'application/json',
                'ADV_gatewayToken': this.getwayRuntimeToken
            }
        });
    },
    post: function( url, data, success, failure) {
        this.oauth.request({
            'method': 'POST',
            'url': url,
            'data': JSON.stringify(data),
            'success':
            function (response)
            {
               parseJSON(response.text,success);
            },
            'failure': function(error) { console.log( "Low level error ", error ); failure(error); },
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ADV_gatewayToken': this.getwayRuntimeToken,
                'ADV_async': true
            }
        });
    },
    postSync: function( url, data, success, failure) {
        console.log("url", url);
        this.oauth.request({
            'async':false,
            'method': 'POST',
            'url': url,
            'data': JSON.stringify(data),
            'success':
            function (response)
            {
               console.log("OAuthGatewayResponse", response);
               console.log("success",success);
               console.log("ResponseText",response.text);
               parseJSON(response.text,success);
            },
            'failure': function(error) { console.log( "Low level error ", error ); failure(error); },
            'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'ADV_gatewayToken': this.getwayRuntimeToken
                       //,'ADV_async': true
            }
       });
    },
	put: function( url, data, success, failure) {
        this.oauth.request({
            'method': 'PUT',
            'url': url,
            'data': JSON.stringify(data),
            'success':
            function (response)
            {
               parseJSON(response.text,success);
            },
            'failure': failure,
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ADV_gatewayToken': this.getwayRuntimeToken,
				'ADV_async': true
            }
        });
    },
	putSync: function( url, data, success, failure) {
        //app.tracker += ", OAuthGateway putSync";
        this.oauth.request({
            'async':false,
            'method': 'PUT',
            'url': url,
            'data': JSON.stringify(data),
            'success':
            function (response)
            {
               parseJSON(response.text,success);
            },
            'failure': failure,
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ADV_gatewayToken': this.getwayRuntimeToken
				//,'ADV_async': true
            }
        });
    }
}
