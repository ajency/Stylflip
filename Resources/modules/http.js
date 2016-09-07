var BASE_URL = constant.BASE_URL;

var _responseObject = {};

var HttpClient = {};

var Cloud = require("ti.cloud"), CloudPush = null;
Cloud.debug = true;

var TiDeviceToken = "";
var loginCreds = {};

var subscribeCloudCb = function(e){
	if(e.success){
		Ti.API.info(constant.APP + " $$$$$$$$$$$$$$$$$$$$$$$$$ cloud subscription success");
	}
	else{
		Ti.API.info(constant.APP + " $$$$$$$$$$$$$$$$$$$$$$$$$ cloud subscription failed error: " + (e.error && e.message) ? e.message : JSON.stringify(e) );
	}
};

var subscribeCloudChannel = function(){
	Cloud.PushNotifications.subscribe({
		channel: 'alert',
		device_token: TiDeviceToken,
		type: osname
	},subscribeCloudCb);
};

var unsubScribeCloudCb = function(e){
	if (e.success) {
        Ti.API.info(constant.APP + " unsubscribed from notifications");

        Cloud.Users.logout(function (e) {
		    if (e.success) {
		        Ti.API.info(constant.APP + ' Success: Logged out');

		        if(osname === 'android'){
		        	CloudPush.removeEventListener('callback', CloudPushCb);
					CloudPush.removeEventListener('trayClickLaunchedApp', trayClickLaunchCb);
					CloudPush.removeEventListener('trayClickFocusedApp', trayClickFocusCb);
		        }

		    } else {
		        Ti.API.info(constant.APP + ' Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		    }
		});

    } else {
        Ti.API.info(constant.APP + ' unsubscribe Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
    }
};

var deregisterForTiNotifications = function(){
	if(TiDeviceToken){
		Cloud.PushNotifications.unsubscribe({
		    channel: 'alert',
		    device_token: TiDeviceToken
		}, unsubScribeCloudCb);
	}
};

var cloudLoginCb = function(e){
	if(e.success){
		subscribeCloudChannel();
	}
	else{
		Ti.API.info(constant.APP + " $$$$$$$$$$$$$$$$$$$$ message: " + ( e.error && e.message ) ? e.message : JSON.stringify(e) );
	}
};


var createCloudUser = function(creds){
	Cloud.Users.create({
	    email: creds.email,
	    first_name: creds.firstname,
	    last_name: creds.lastname,
	    password: creds.password,
	    password_confirmation: creds.password
	}, function (e) {
	    if (e.success) {
	        var user = e.users[0];
	        Ti.API.info(constant.APP + ' Success:\n' +
	            'id: ' + user.id + '\n' +
	            'sessionId: ' + Cloud.sessionId + '\n' +
	            'first name: ' + user.first_name + '\n' +
	            'last name: ' + user.last_name);
	        
	    } else {
	        Ti.API.info(constant.APP + ' Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	    loginCloudUser({email: creds.email, password: creds.password});
	});
};

// var _checkCloudUser = function(){
// 	Cloud.Users.show({
// 	    user_id: loginCreds.email
// 	}, function (e) {
// 	    if (e.success) {
// 	        var user = e.users[0];
// 	        alert('Success:\n' +
// 	            'id: ' + user.id + '\n' +
// 	            'first name: ' + user.first_name + '\n' +
// 	            'last name: ' + user.last_name);
// 	    } else {
// 	        alert('Error:\n' +
// 	            ((e.error && e.message) || JSON.stringify(e)));
// 	    }
// 	});
// };

var loginCloudUser = function(creds){
	Cloud.Users.login({
		// login: "appc_app_user_dev",
		// password: "W83yrPwA8YyvjehWOx"
		login: creds.email,
		password: creds.password
	}, cloudLoginCb);
};

var TiDeviceTokenSuccess = function(e){
	TiDeviceToken = e.deviceToken;
	Ti.API.info(constant.APP + " $$$$$$$$$$$$$$$$$$$$$ retreived device token successfully deviceToken: [ " + TiDeviceToken + " ]");
	// loginCloudUser({email: "ashika2@ajency.in", password: "#Ashika123"});
	var accountName = loginCreds.email.split('@');
	accountName = accountName[0];

	createCloudUser({firstname: accountName, lastname: accountName, password: loginCreds.password, email: loginCreds.email});
	// _checkCloudUser();
};

var TiDeviceTokenError = function(e){
	Ti.API.info(constant.APP + " $$$$$$$$$$$$$$$$$$$$$$$ device token retrieve faled error: [" + e.error + "]");
};

var CloudPushCb = function(evt) {
	Ti.API.info(constant.APP + " ############ message recieved payload: " + evt.payload);
    //alert(evt);
    //alert(evt.payload);
};

var trayClickLaunchCb = function (evt) {
    Ti.API.info('Tray Click Launched App (app was not running)');
    //alert('Tray Click Launched App (app was not running');
};

var trayClickFocusCb = function (evt) {
    Ti.API.info('Tray Click Focused App (app was already running)');
    //alert('Tray Click Focused App (app was already running)');
};

var registerForTiNotifications = function(){
	loginCreds = Utils.getLoginCreds();

	if(!loginCreds.email){
		Ti.API.info(constant.APP + " ############# NO VALID EMAIL FOUND TO REGISTER FOR TI NOTIFICATIONS #################");
		return;
	}

	if(osname === 'android'){

		CloudPush = require("ti.cloudpush");
		CloudPush.debug = true;
		CloudPush.enabled = true;
		CloudPush.showTrayNotificationsWhenFocused = true;
		CloudPush.focusAppOnPush = false;

		CloudPush.retrieveDeviceToken({
			success: TiDeviceTokenSuccess,
			error: TiDeviceTokenError
		});

		CloudPush.addEventListener('callback', CloudPushCb);
		CloudPush.addEventListener('trayClickLaunchedApp', trayClickLaunchCb);
		CloudPush.addEventListener('trayClickFocusedApp', trayClickFocusCb);

	}
	else{
		Ti.API.info(constant.APP + " os: [" + osname + "] not currently supported");
	}
};


HttpClient.registerForTiNotifications = registerForTiNotifications;
HttpClient.deregisterForTiNotifications = deregisterForTiNotifications;

HttpClient.apiCall = function(params, method, api, successCallback, errorCallback) {
	// if(Ti.Network.online) {
	if(!Ti.Network.online) {	
		_responseObject = {
			sucess: false,
			isNetworkError: 1,
			errorTitle: constant.ALERT.TITLE.DAGNABBIT,
			errorMessage: constant.ALERT.MESSAGE.INTERNET_CONNECTION,
			serverURL: BASE_URL+api,
			serverArgs: params
		};
		Utils._.isFunction(errorCallback) && errorCallback(_responseObject);
	}
	else {
		if(params.showLoader) {
			Loader.show(params.loaderMsg?params.loaderMsg:'Loading...');
		}
		else {
			params.showLoader = false;
		}
		// creating instance of http client
		var _httpClient = Ti.Network.createHTTPClient();
		_httpClient.httpClient = _httpClient;
		
		_httpClient.showLoader = params.showLoader;
		// setting timeout for http client
		_httpClient.setTimeout = (60 * 3) * 1000; 		
		//	Set custom properties
		_httpClient.params = params;				
		// opening http client
		_httpClient.open(method == undefined ? 'POST' : method.toUpperCase(), BASE_URL+api);
	 
	 	// setting request header
		// _httpClient.setRequestHeader("key", "value");
	  
		if(params != undefined && params.serverArgs != undefined) {
			// sending params to server
			_httpClient.send(params.serverArgs);
		}
		else {
			// sending no params to server
			_httpClient.send();
		}
		
	  	// http onload method
		_httpClient.onload = function() {
			Titanium.API.info(constant.APP + " http api call message recived");
			Titanium.API.info(this.responseText);

			// Ti.App.fireEvent('app:apicallSuccess',{params: params});
			
			if(this.showLoader) {
				Loader.hide();				
			}
			
			var responseText;
			
			if(this.responseText != undefined && this.responseText != null && this.responseText.indexOf('multicast_id') > -1) {
				// var arr = this.responseText.split('}]}');
				// responseText = arr[1];
				var arr = this.responseText.split('{"multicast_id"');
				responseText = arr[0];
			}		
			else {
				responseText = this.responseText;
			}
			
			// if(this.params.serverArgs.action == 'listing') {
				// Ti.API.info();
				// var ad = UI.createAlertDialog({
					// message: responseText
				// });
				// ad.show();
				// return;
			// }
			
			var _responseData = JSON.parse(responseText);

			if(_responseData.success) {
			    _responseObject = {
                    success: true,
                    isNetworkError: 0,
                    data: _responseData.data,
                    serverURL: BASE_URL+api,
                    serverArgs: this.params
                };
                
                if(params.cache) {
                	Cache.saveData(api, params.serverArgs, responseText);
                }

                
                Utils._.isFunction(successCallback) && successCallback(_responseObject);
			}
			else {
			    _responseObject = {
                    success: false,
                    isNetworkError: 0,
                    data: _responseData,
                    errorTitle: constant.ALERT.TITLE.WHOA,
                    errorMessage: (_responseData.data && _responseData.data.error)?_responseData.data.error:constant.ALERT.MESSAGE.SERVER_ERROR,
                    serverURL: BASE_URL+api,
                    serverArgs: this.params
                };
                
                Utils._.isFunction(errorCallback) && errorCallback(_responseObject);
			}
			
			// Ti.API.info("RESPONSE => " + JSON.stringify(_responseObject));
			
			this.httpClient = null;
		}; 
	  	
	  	// http onerror method
		_httpClient.onerror = function(e) {
			if(this.showLoader) {
				Loader.hide();				
			}
			
			_responseObject = {
				success: false,
				isNetworkError: 1,
				errorTitle: constant.ALERT.TITLE.WHOOPSIE,
				errorMessage: (e.type == 'error')?e.error:constant.ALERT.MESSAGE.SOMETHING_WENT_WRONG,
				serverURL: BASE_URL+api,
				serverArgs: this.params
			};
			
			// Ti.API.info("RESPONSE => " + JSON.stringify(_responseObject));
			
			Utils._.isFunction(errorCallback) && errorCallback(_responseObject);  
			
			this.httpClient = null;    
		};
	}	
};

HttpClient.getResponse = function(config) {
	//	Blur currently focused text field
	Ti.API.info(constant.APP + " ##################### BLURRING FOCUSED TEXTFIELD ##################");
	UI.focusedTextField && UI.focusedTextField.blur();
	
	var params = config.requestArgs;
	var method = config.requestArgs.method ? config.requestArgs.method : 'post';
	var api = config.requestArgs.url;
	var successCallback = config.success;
	var errorCallback = config.error;
	// params.cache = true;
	Titanium.API.info(constant.APP + " getting response data from server");
	if(params.cache) {
		// if(params.showLoader) {
			// Loader.show(params.loaderMsg?params.loaderMsg:'Loading...');
		// }
		Cache.getData({
			url: api,
			requestArgs: params.serverArgs,
			success: function(responseData) {
				// if(params.showLoader) {
					// Loader.hide();
				// }
				
				Titanium.API.info(responseData);
				if(JSON.parse(responseData).data.length == 0) {
					HttpClient.apiCall(params, method, api, successCallback, errorCallback);
					return;
				}
			    _responseObject = {
		            success: true,
		            isNetworkError: 0,
		            data: JSON.parse(responseData).data,
		            serverURL: BASE_URL + api,
		            serverArgs: params
		        };

		        // Ti.App.fireEvent('app:apicallSuccess',{params: params});
		        Utils._.isFunction(successCallback) && successCallback(_responseObject);
			},
			error: function() {
				// if(params.showLoader) {
					// Loader.hide();
				// }
				HttpClient.apiCall(params, method, api, successCallback, errorCallback);
			}
		});
	}
	else {
		HttpClient.apiCall(params, method, api, successCallback, errorCallback);
	}
};


Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
Ti.Geolocation.purpose = "";
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 5;

HttpClient.getCurrentLocation = function(callback) {
    if(Ti.Geolocation.locationServicesEnabled === false) {
        alert(constant.ALERT.MESSAGE.GPS_OFF);
        callback({success: false});
    }
    else {
        Ti.Geolocation.getCurrentPosition(function(e) {
            if(e.success){
                callback({success: true, latitude: e.coords.latitude, longitude: e.coords.longitude});               
            }
            else{
                // alert("Location is currently unavailable.");
                callback({success: false});
            }                   
        });         
    }
};


HttpClient.registerForPushNotification = function(data) {
	if(osname == 'android') {
		var gcm = require('net.iamyellow.gcmjs');
		gcm.registerForPushNotifications({
			success: function(e) {
				if(Utils.isUserRegisteredForPushNotifications()) {
					// if(Ti.App.Properties.hasProperty('pendingData')) {
						// var _pendingData = Ti.App.Properties.getObject('pendingData');
						// if(_pendingData.hasOwnProperty('itemId') && _pendingData.hasOwnProperty('screen')) {
							// Utils._.isFunction(data.onNotificationReceived) && data.onNotificationReceived({
								// inBackground: true,
								// data: _pendingData
							// });
							// Ti.App.Properties.removeProperty('pendingData');
						// }
					// }
					return;
				}
				deviceTokenSuccess(e);
			},
			error: deviceTokenError,
			callback: function(e) { 
				// when a gcm notification is received WHEN the app IS IN FOREGROUND
				e.inBackground = false;
				Utils._.isFunction(data.onNotificationReceived) && data.onNotificationReceived(e);
			},
			unregister: function (e) {
				// Ti.API.info('******* unregister, ' + e.deviceToken);
			},
			data: function(e) {
				// Ti.API.info('DATA => ' + JSON.stringify(e));
			}
		});
	}
	else {
		// Check if the device is running iOS 8 or later
		if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
			// Wait for user settings to be registered before registering for push notifications
		    Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
		        // Remove event listener once registered for push notifications
		        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
		        Ti.Network.registerForPushNotifications({
		            success: deviceTokenSuccess,
		            error: deviceTokenError,
		            callback: function(e) {
						//	On notification clicked
						Utils._.isFunction(data.onNotificationReceived) && data.onNotificationReceived(e);
					}
		        });
		    });
		    Ti.App.iOS.registerUserNotificationSettings({
			    types: [
		            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
		            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
		            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
		        ]
		    });
		}
		// For iOS 7 and earlier
		else {
		    Ti.Network.registerForPushNotifications({
		        // Specifies which notifications to receive
		        types: [
		            Ti.Network.NOTIFICATION_TYPE_BADGE,
		            Ti.Network.NOTIFICATION_TYPE_ALERT,
		            Ti.Network.NOTIFICATION_TYPE_SOUND
		        ],
		        success: deviceTokenSuccess,
		        error: deviceTokenError,
		        callback: function(e) {
					//	On notification clicked
					Utils._.isFunction(data.onNotificationReceived) && data.onNotificationReceived(e);
				}
		    });
		}
	}
};



/*
 * On new notification
 */
function receivePush(e) {
	if(osname == 'android') {
		//	when user clicks on the notification from drawer
		// Ti.API.info(e);
	}
    else {
    	// Ti.API.info(e);
    }
}

/*
 * On device token success
 */
function deviceTokenSuccess(e) {
	if(Utils.isUserRegisteredForPushNotifications()) {
		return;
	}

    var _requestArgs = {
        url: 'user.php',
        method: 'post',
    	serverArgs: {
        	action: 'registerForPushNotification',
        	userId: Utils.loggedInUserId(),
        	deviceToken: e.deviceToken,
        	osname: osname == 'android' ? 'android' : 'ios'
       	}
    };
    
    /*
     * Hit web service
     */
    HttpClient.getResponse({
    	requestArgs: _requestArgs,
    	success: function(response) {
    		// Ti.API.info('SUCCESSFULLY REGISTERED');
    		Ti.App.Properties.setBool('isUserRegisteredForPushNotifications', true);
    	},
    	error: function(error) {
    		// Ti.API.info('FAILED TO REGISTER');
    		try {
    			if(!error.isNetworkError) {
	    			deviceTokenSuccess(e);
	    		}
    		}
    		catch(e) {}
    	}
    });
}

/*
 * On Device token error
 */
function deviceTokenError(e) {
    // Ti.API.info('Failed to register for push notifications! ' + e.error);
}

/*
 * Deregister user from push notifications
 */
HttpClient.deregisterForPushNotification = function(userId) {
	var _requestArgs = {
        url: 'user.php',
        method: 'post',
    	serverArgs: {
        	action: 'logout',
        	userId: userId
       	}
    };
    
    /*
     * Hit web service
     */
    HttpClient.getResponse({
    	requestArgs: _requestArgs,
    	success: function(response) {
    		// Ti.API.info('SUCCESSFULLY DEREGISTERED');
    		Ti.App.Properties.removeProperty('isUserRegisteredForPushNotifications');
    	},
    	error: function(error) {
    		// Ti.API.info('FAILED TO DEREGISTER');
    	}
    });
};


module.exports = HttpClient;
