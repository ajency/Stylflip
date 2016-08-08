var social = {};

var googlePlus = require('/libs/googleAuth');
var googleAuth = new googlePlus({
	clientId : '114881040830-fa6at1ckph3suu2t3a9sqgppgrhso3ud.apps.googleusercontent.com',
	clientSecret : 'msU5rZbICejIKdumdEPV6nr_',
	propertyName : 'googleToken',
	quiet: false,
	// scope : ['https://www.googleapis.com/auth/tasks', 'https://www.googleapis.com/auth/tasks.readonly']
	scope: ['profile', 'https://www.googleapis.com/auth/plus.login']
});

/*
 * Twitter config
 */
var twitter = require('/libs/twitter').Twitter({
    consumerKey: "1QdXs37W0jrDB6bz7jLwYZI43",
    consumerSecret: "MJIBONgwyWgmtC1LbZhMPIRtyLdyPWLh0QVteAOfc7c8k8MXFJ",
    accessTokenKey: Ti.App.Properties.getString('twitterAccessTokenKey', ''),
    accessTokenSecret: Ti.App.Properties.getString('twitterAccessTokenSecret', '')
}); 

/*
 * Facebook config
 */
var fb = require('facebook');
// fb.appid = 1486437388326591;
// fb.permissions = ['publish_actions'];
fb.permissions = ['email'];

var _messageToFeed, _shareCallback, _objectToFeed;

/*
 * Share post on Facebook wall
 */
social.shareOnfacebook = function(data, shareCallback) {
	if(!Ti.Network.online) {
        alert('Internet connection appears to be offline');
        return;
    }
    
	require('/modules/facebook/facebook').get(data, shareCallback);
	
	return;
	
    Loader.show('Sharing on Facebook...');
        
    _messageToFeed = message;
    _shareCallback = shareCallback;
    
    if(fb.loggedIn) {
        var data = {
            message: _messageToFeed
        };    
        fb.requestWithGraphPath('me/feed', data, "POST", function(e) {
        	Loader.hide();
        	
            if(e.success) {
                Utils._.isFunction(_shareCallback) && _shareCallback({success: true});
                _messageToFeed = null;
                _shareCallback = null;
            }
            else {
                Utils._.isFunction(_shareCallback) && _shareCallback({success: false, errorTitle: constant.ALERT.TITLE.WHOOPSIE, errorMessage: 'Failed to post on facebook wall'});
                _messageToFeed = null;
                _shareCallback = null;
            }
        });
    }                               
    else {
        fb.authorize();
    }       
};


fb.addEventListener('login', function(e) { 
    if(e.success) {
    	if(_messageToFeed) {
            social.shareOnfacebook(_messageToFeed, _shareCallback);
        }
        else {
        	fb.requestWithGraphPath('me', {}, 'GET', function(e) {
			    if (e.success) {
			        Ti.App.fireEvent('onFBLogin', {success: true, data: e.result});
			    } 
			    else if (e.error) {
			    	Ti.App.fireEvent('onFBLogin', {success: false, errorTitle: constant.ALERT.TITLE.WHOOPSIE, errorMessage: e.error});
			    } 
			    else {
			    	Ti.App.fireEvent('onFBLogin', {success: false, errorTitle: constant.ALERT.TITLE.WHOOPSIE, errorMessage: 'Unknown response'});
			    }
			});
        }
    }
    else if(e.error) {
    	if(_messageToFeed) {
            Utils._.isFunction(_shareCallback) && _shareCallback({success: false, errorTitle: constant.ALERT.TITLE.WHOOPSIE, errorMessage: e.error});
	        _messageToFeed = null;
	        _shareCallback = null;
        }
        else {
        	Ti.App.fireEvent('onFBLogin', {success: false, errorTitle: constant.ALERT.TITLE.WHOOPSIE, errorMessage: e.error});
        }
    }
    
    if(e.cancelled) { 
    	if(_messageToFeed) {
            Utils._.isFunction(_shareCallback) && _shareCallback({success: false, errorTitle: constant.ALERT.TITLE.WHOOPSIE, errorMessage: e.error});
	        _messageToFeed = null;
	        _shareCallback = null;
        }
        else {
        	Ti.App.fireEvent('onFBLogin', {cancel: true});
        }
    } 
}); 

fb.addEventListener('logout', function(e) {
    Ti.App.fireEvent('onFBLogout', {success: true});
});


social.facebook = function(event) {
    if(event == 'login') {
    	if(fb.loggedIn) {
    		fb.requestWithGraphPath('me', {}, 'GET', function(e) {
			    if (e.success) {
			        Ti.App.fireEvent('onFBLogin', {success: true, data: e.result});
			    } 
			    else if (e.error) {
			    	Ti.App.fireEvent('onFBLogin', {success: false, errorTitle: constant.ALERT.TITLE.WHOOPSIE, errorMessage: e.error});
			    } 
			    else {
			    	Ti.App.fireEvent('onFBLogin', {success: false, errorTitle: constant.ALERT.TITLE.WHOOPSIE, errorMessage: 'Unknown response'});
			    }
			});
    	}
    	else {
    		fb.authorize();
    	}
    }
    else if(event == 'logout') {
		fb.logout();
		Ti.App.Properties.removeProperty('fbLoggedIn');
    }
    else {
    	Ti.App.fireEvent('onFBLogin', {success: false, errorTitle: constant.ALERT.TITLE.WHOOPSIE, errorMessage: 'Invalid event passed'});
    }
};



/*
 * Google+ config
 */
social.getUserGooglePlusDetails = function(accessToken, callback) {
	var xhrList = Ti.Network.createHTTPClient({
		onload : function(e) {
			try {
				var responseData = JSON.parse(this.responseText);
				callback({success: true, data: responseData});
			} 
			catch(e) {
				callback({success: false, errorTitle: constant.ALERT.TITLE.WHOOPSIE, errorMessage: 'An unexpected error occured'});
			}
		},
		onerror : function(e) {
			callback({success: false, errorTitle: constant.ALERT.TITLE.WHOOPSIE, errorMessage: 'An unexpected error occured'});
		},
		timeout : 5000
	});
	xhrList.open("GET", 'https://www.googleapis.com/plus/v1/people/me?access_token=' + accessToken);
	xhrList.send();	
};


social.googlePlus = function(event) {
	var googlePlusWindow = Window.create(exitOnClose=false, false, disableClick=true);
	var googlePlusLoginView = googleAuth.authorize(googlePlusWindow, function(e) {
		if(e.success) {
			social.getUserGooglePlusDetails(e.accessToken, function(e) {
				googlePlusWindow.close();
				setTimeout(function() {
					Ti.App.fireEvent('onGoogleLogin', e);
				}, 1000);
			});
		}
		else {
			Ti.App.fireEvent('onGoogleLogin', e);
		}
	});
	googlePlusWindow.add(googlePlusLoginView);
    Window.open(googlePlusWindow);
    googlePlusWindow.addEventListener('android:back', function() {
    	googlePlusWindow.close();
    });
    googlePlusWindow.addEventListener('close', function() {
    	Loader.hide();
    });
};


/*
 * Sharing tweet on twitter
 */
var _isTwitterLoggedIn = false;

social.shareOnTwitter = function(obj, shareCallback) {
    if(!Ti.Network.online) {
        alert('Internet connection appears to be offline');
        return;
    }
    
    _objectToFeed = obj;
    _shareCallback = shareCallback;
    
    if(_isTwitterLoggedIn) {
        Loader.show('Sharing on Twitter...');
        var path = 'https://api.twitter.com/1.1/statuses/update.json';
        var params = {};
        var headers = {};
        params.status = _objectToFeed.text;
        
        // headers = {
            // // 'Content-Type': 'multipart/form-data'
        // };

        twitter.request(path, params, headers, 'POST', function (e) {
            Loader.hide();
            if (e.success) {
                Utils._.isFunction(_shareCallback) && _shareCallback({success: true});
                _objectToFeed = null;
                _shareCallback = null;
            } 
            else {
                Utils._.isFunction(_shareCallback) && _shareCallback({success: false, errorTitle: constant.ALERT.TITLE.WHOOPSIE, errorMessage: 'Failed to tweet'});
                _objectToFeed = null;
                _shareCallback = null;   
            }
        });
    }
    else {
        twitter.authorize();
    }
};  


/*
 * Twitter login event listener
 */
twitter.addEventListener('login', function (e) {
    if (e.success) {
        Ti.App.Properties.setString('twitterAccessTokenKey', e.accessTokenKey);
        Ti.App.Properties.setString('twitterAccessTokenSecret', e.accessTokenSecret);
        
        _isTwitterLoggedIn = true;
        if(_objectToFeed) {
        	social.shareOnTwitter(_objectToFeed, _shareCallback);
        }
    } 
    else {
    	if(_objectToFeed) {
    		Utils._.isFunction(_shareCallback) && _shareCallback({success: false, errorTitle: constant.ALERT.TITLE.WHOOPSIE, errorMessage: 'Login failed'});
	        _objectToFeed = null;
	        _shareCallback = null;   
    	}
    }
});


social.shareOnWhatsApp = function(message) {
	message = message ? message.replace(/&/g, 'and') : '';
	
	if(osname == 'android') {
		var intent = Ti.Android.createIntent({
		    action: Ti.Android.ACTION_SEND,
		    packageName: 'com.whatsapp',
		    type: 'text/plain'
		});
		
		intent.putExtra(Ti.Android.EXTRA_TEXT, message.replace(/&/g, 'and'));
		
		Ti.Android.currentActivity.startActivityForResult(intent, function(e) {
		    if(e.error) {
		        var alertDialog = UI.createAlertDialog({
		            title: 'Whoopsie',
		            message: 'WhatsApp not installed',
		            buttonNames: ['Dismiss']
		        });
		        alertDialog.show();
		        alertDialog = null;
		    }
		});
	}
	else {
		Ti.Platform.openURL('whatsapp://send?text=' + message);
	}
};


social.shareViaSMS = function(message) {
	if(osname == 'android') {
		var intent = Ti.Android.createIntent({
            action: Ti.Android.ACTION_VIEW,
            type:   'vnd.android-dir/mms-sms'
        });
        intent.putExtra('sms_body', message);
        Ti.Android.currentActivity.startActivityForResult(intent, function(e) {
            // Ti.API.info(e.resultCode);
        });
	}
	else {
		var module = require('com.omorandi');
	    var smsDialog = module.createSMSDialog();
	    
	    if (!smsDialog.isSupported()) {
	        var a = Ti.UI.createAlertDialog({title: 'warning', message: 'the required feature is not available on your device'});
	        a.show();
	    }
	    else {
	        smsDialog.recipients = [];
	        smsDialog.messageBody = message;
	
	        smsDialog.addEventListener('complete', function(e){
	            if (e.result == smsDialog.SENT) {
	            }
	            else if (e.result == smsDialog.FAILED) {
	            }
	            else if (e.result == smsDialog.CANCELLED) {
	            }
	        });
	
	        smsDialog.open({animated: true});
	    }
	}
};


social.shareViaEmail = function(obj, message) {
	var emailDialog = Ti.UI.createEmailDialog({
		toRecipients: [],
		subject: obj.subject,
		messageBody: 'Hi,\n' + obj.body
	});
	emailDialog.open();
	emailDialog = null;
};

social.fb = fb;

module.exports = social;


