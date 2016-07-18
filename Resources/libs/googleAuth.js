/*
 * Google account authentfication library / module
 * by Miroslav Magda, blog.ejci.net,
 *
 *
 * Copyright 2012 Miroslav Magda
 *
 * All code is open source and dual licensed under GPL and MIT. Check the individual licenses for more information.
 */

/*
 * Google authentification for Titanium
 * based on: https://developers.google.com/accounts/docs/OAuth2InstalledApp#formingtheurl
 * Check also https://code.google.com/apis/console/
 */

var GoogleAuth = function(o) {
	var _version = '0.3.2';
	o = (o) ? o : {};
	var _opt = {
		clientId : (o.clientId) ? o.clientId : null,
		clientSecret : (o.clientSecret) ? o.clientSecret : null,
		propertyName : (o.propertyName) ? o.propertyName : 'googleToken',
		url : 'https://accounts.google.com/o/oauth2/auth',
		scope : (o.scope) ? o.scope : ['https://www.googleapis.com/auth/tasks'],
		closeTitle : (o.closeTitle) ? o.closeTitle : 'Close',
		winTitle : (o.winTitle) ? o.winTitle : 'Google+ Login',
		errorText : (o.errorText) ? o.errorText : 'Can not authorize user!',
		winColor : (o.winColor) ? o.winColor : '#000',
		quiet : ( typeof (o.quiet) === 'undefined') ? true : o.quiet
	};
	var log = function() {
	};
	log.error = function(t) {
		if (!_opt.quiet) {
		}
	}
	log.info = function(t) {
		if (!_opt.quiet) {
		}
	}
	log.debug = function(t) {
		if (!_opt.quiet) {
		}
	}
	log.trace = function(t) {
		if (!_opt.quiet) {
		}
	}//UTILS

	var win;

	var _prop = {}
	_prop.accessToken = null;
	_prop.refreshToken = null;
	_prop.tokenType = null;
	_prop.expiresIn = 0;

	var prop = {};
	prop = getProps();

	if (prop.expiresIn >= (new Date()).getTime()) {
		//	Valid access code
		_prop = prop;
	}/*else {
	 log.info('GoogleAuth: Access code not valid. Refreshing...');
	 _prop = prop;
	 refreshToken();
	 }*/
	function getProps() {
		var p = {};
		p.accessToken = Ti.App.Properties.getString(_opt.propertyName + '.accessToken');
		p.refreshToken = Ti.App.Properties.getString(_opt.propertyName + '.refreshToken');
		p.tokenType = Ti.App.Properties.getString(_opt.propertyName + '.tokenType');
		p.expiresIn = Ti.App.Properties.getString(_opt.propertyName + '.expiresIn');
		return p;
	}

	function authorize(googlePlusWindow, cb) {
		cb = (cb) ? cb : function() {
		};
		
		var mainView = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			layout: 'vertical'
		});
		
	    var header = require('/components/header').get({
			showMenu: false,
	    	enableButtons: false,
	    	enableBackButton: true
		});
	    header.setTitle('Google+ Login');
    	
		var webview = Ti.UI.createWebView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			url : prepareUrl()
		});
		
		mainView.add(header.getView());
		mainView.add(webview);
		
	    webview.addEventListener('beforeload', function(e) {
            // Loader.show(undefined, noScreenBlock=true);
        });
		
		var c = 0;
		webview.addEventListener('load', function(e) {
		    // Loader.hide();
		    
			c++;
			var accessDenied = webview.evalJS('document.getElementById("access_denied").value;');
			if (accessDenied != '') {
				// log.debug('GoogleAuth: Access denied!');
				Ti.App.Properties.setString(_opt.propertyName + '.accessToken', '');
				Ti.App.Properties.setString(_opt.propertyName + '.refreshToken', '');
				Ti.App.Properties.setString(_opt.propertyName + '.tokenType', '');
				Ti.App.Properties.setString(_opt.propertyName + '.expiresIn', 0);
				_prop.accessToken = null;
				_prop.refreshToken = null;
				_prop.tokenType = null;
				_prop.expiresIn = 0;
				// cb({success: false, errorMessage: 'Access denied!'});
			}
			else if (c > 10) {
				//some error (to many requests :) )
				// log.debug('GoogleAuth: To many redirects...');
				cb({success: false, errorMessage: 'To many redirects...'});
			}
			else {
				var code = webview.evalJS('document.getElementById("code").value;');
				if (code != '') {
					// log.debug('GoogleAuth: Access granted!');
					//log.info('Code: ' + code);
					getToken(code, cb);
				}
			}
		});
		
		return mainView;
	}

	function deAuthorize(cb) {
		cb = (cb) ? cb : function() {
		};

		// log.debug('GoogleAuth: User logging out...');
		if (isAuthorized()) {
			var logoutWin = Ti.UI.createWindow({
				backgroundColor : 'white',
				barColor : _opt.winColor,
				modal : true,
				title : _opt.winTitle
			});

			var close = Ti.UI.createButton({
				title : _opt.closeTitle
			});
			logoutWin.rightNavButton = close;

			close.addEventListener('click', function() {
				webview = null;
				logoutWin.close();
			});
			var webview = Titanium.UI.createWebView({
				width : '100%',
				height : '100%',
				//opacity : 0,
				url : 'https://accounts.google.com/Logout'
			});
			logoutWin.add(webview);
			webview.addEventListener('load', function(e) {
				var t = setTimeout(function() {
					webview = null;
					logoutWin.close();
					cb();
					//w.remove(webview);
				}, 500);
				Ti.App.Properties.setString(_opt.propertyName + '.accessToken', '');
				Ti.App.Properties.setString(_opt.propertyName + '.refreshToken', '');
				Ti.App.Properties.setString(_opt.propertyName + '.tokenType', '');
				Ti.App.Properties.setString(_opt.propertyName + '.expiresIn', 0);
				_prop.accessToken = null;
				_prop.refreshToken = null;
				_prop.tokenType = null;
				_prop.expiresIn = 0;
			});
			logoutWin.open();
		}
	}

	/**
	 * Refresh token
	 */
	function refreshToken(cbSuccess, cbError) {
		// log.info('GoogleAuth: Access code not valid. Refreshing...');
		cbSuccess = (cbSuccess) ? cbSuccess : function() {
		};
		cbError = (cbError) ? cbError : function() {
		};
		var xhr = Ti.Network.createHTTPClient({
			// function called when the response data is available
			onload : function(e) {
				//log.info("Received text: " + this.responseText);
				var resp = JSON.parse(this.responseText);
				resp.expires_in = parseFloat(resp.expires_in, 10) * 1000 + (new Date()).getTime();
				Ti.App.Properties.setString(_opt.propertyName + '.accessToken', resp.access_token);
				Ti.App.Properties.setString(_opt.propertyName + '.tokenType', resp.token_type);
				Ti.App.Properties.setString(_opt.propertyName + '.expiresIn', resp.expires_in);
				_prop.accessToken = resp.access_token;
				_prop.tokenType = resp.token_type;
				_prop.expiresIn = resp.expires_in;
				// log.debug(_prop);
				//win.close();
				cbSuccess();
			},
			// function called when an error occurs, including a timeout
			onerror : function(e) {
				// log.info(e.error);
				// log.info(e.responseText);
				cbError();
				//ERROR
				Titanium.UI.createAlertDialog({
					title : 'Error',
					message : _opt.errorText
				});
				cbError();
				//authorize();

			},
			timeout : 5000 /* in milliseconds */
		});
		// Prepare the connection.
		xhr.open("POST", _opt.url);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		var d = {
			client_id : _opt.clientId,
			client_secret : _opt.clientSecret,
			refresh_token : _prop.refreshToken,
			grant_type : 'refresh_token'
		};
		// Send the request.
		xhr.send(d);
	}

	/**
	 * Get TOKEN
	 */
	function getToken(code, cb) {
		cb = (cb) ? cb : function() {
		};
		var xhr = Ti.Network.createHTTPClient({
			// function called when the response data is available
			onload : function(e) {
				//log.info("Received text: " + this.responseText);
				var resp = JSON.parse(this.responseText);
				// log.info(resp.expires_in);
				resp.expires_in = parseFloat(resp.expires_in, 10) * 1000 + (new Date()).getTime();
				// log.info(resp.expires_in);
				Ti.App.Properties.setString(_opt.propertyName + '.accessToken', resp.access_token);
				Ti.App.Properties.setString(_opt.propertyName + '.refreshToken', resp.refresh_token);
				Ti.App.Properties.setString(_opt.propertyName + '.tokenType', resp.token_type);
				Ti.App.Properties.setString(_opt.propertyName + '.expiresIn', resp.expires_in);
				_prop.accessToken = resp.access_token;
				_prop.refreshToken = resp.refresh_token;
				_prop.tokenType = resp.token_type;
				_prop.expiresIn = resp.expires_in;
				// log.debug(_prop);
				//alert('success');
				//callback
				cb({success: true, accessToken: _prop.accessToken});
			},
			// function called when an error occurs, including a timeout
			onerror : function(e) {
				//log.info(e.error);
				//log.info(e.responseText);
				//TODO: show some error message
				cb({success: false, errorMessage: _opt.errorText});
			},
			timeout : 5000 /* in milliseconds */
		});
		// Prepare the connection.
		xhr.open("POST", 'https://accounts.google.com/o/oauth2/token');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		var d = {
			code : code,
			client_id : _opt.clientId,
			client_secret : _opt.clientSecret,
			redirect_uri : 'urn:ietf:wg:oauth:2.0:oob',
			grant_type : 'authorization_code'
		};
		// Send the request.
		xhr.send(d);
	}

	/**
	 * Prepare url from options
	 */
	function prepareUrl() {
		//encodeURIComponent(_opt.scope.join('+'))
		var scope = [];
		for (var i = 0; i < _opt.scope.length; i++) {
			scope[i] = encodeURIComponent(_opt.scope[i]);
		}
		var url = _opt.url + '?' + 'approval_prompt=force&scope=' + scope.join('+') + '&' + 'redirect_uri=urn:ietf:wg:oauth:2.0:oob' + '&' + 'response_type=code' + '&' + 'client_id=' + _opt.clientId + '&' + 'btmpl=mobile' + '';
		// log.debug(url);
		return url;
	}

	function isAuthorized(cbSuccess, cbError) {
		cbSuccess = (cbSuccess) ? cbSuccess : function() {
		};
		cbError = (cbError) ? cbError : function() {
		};
		_prop = getProps();
		// log.debug('Properties: ' + JSON.stringify(_prop));
		if (_prop.accessToken != null && _prop.accessToken != '') {
			if (_prop.expiresIn < (new Date()).getTime()) {
				refreshToken(cbSuccess, cbError);
			} else {
				cbSuccess();
			}
			return true;
		} else {
			cbError();
		}

		return false;
	}

	function getAccessToken() {
		return _prop.accessToken;
	}

	return {
		isAuthorized : isAuthorized,
		deAuthorize : deAuthorize,
		getAccessToken : getAccessToken,
		refreshToken : refreshToken,
		authorize : authorize,
		version : _version
	};
};

module.exports = GoogleAuth;
