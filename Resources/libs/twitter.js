var exports = exports || this;
exports.Twitter = (function(global) {
  var K = function(){}, isAndroid = Ti.Platform.osname === "android", jsOAuth = require('/libs/jsOAuth-1.3.3');
  
  /**
   * Twitter constructor function
   *
   *     var client = Twitter({
   *       consumerKey: "INSERT YOUR KEY HERE",
   *       consumerSecret: "INSERT YOUR SECRET HERE"      
   *     });
   *
   * Can be used with or without `new` keyword.
   *
   * @constructor
   * @requires jsOAuth: http://github.com/bytespider/jsOAuth
   * @param options {Object} Configuration object
   * @param options.consumerKey {String} Application consumer key
   * @param options.consumerSecret {String} Application consumer secret
   * @param options.accessTokenKey {String} (optional) The user's access token key
   * @param options.accessTokenSecret {String} (optional) The user's access token secret
   * @param [options.windowTitle="Twitter Authorization"] {String} (optional) The title to display in the authentication window
   */
  var Twitter = function(options) {
    var self;
    
    if (this instanceof Twitter) {
      self = this;
    } else {
      self = new K();
    }
    
    if (!options) { options = {}; }
    self.windowTitle = options.windowTitle || "Twitter Authorization";
    self.windowClose = options.windowClose || "Close";
    self.windowBack = options.windowBack || "Back";
    self.consumerKey = options.consumerKey;
    self.consumerSecret = options.consumerSecret;
    self.authorizeUrl = "https://api.twitter.com/oauth/authorize";
    self.accessTokenKey = options.accessTokenKey;
    self.accessTokenSecret = options.accessTokenSecret;
    self.authorized = false;
    self.listeners = {};
    
    if (self.accessTokenKey && self.accessTokenSecret) {
      self.authorized = true;
    }

    options.requestTokenUrl = options.requestTokenUrl || "https://api.twitter.com/oauth/request_token";
    self.oauthClient = jsOAuth.OAuth(options);
    
    return self;
  };
  
  K.prototype = Twitter.prototype;
  
  function createAuthWindow() {
    var self = this,
        oauth = this.oauthClient,
        webViewWindow = Window.create(exitOnClose=false, false, disableClick=true),
        mainView = Ti.UI.createView({
        	width: Ti.UI.FILL,
        	height: Ti.UI.FILL,
        	layout: 'vertical'
        }),
        webView = Ti.UI.createWebView({
		    width: Ti.UI.FILL,
		    height: Ti.UI.FILL 	
        });

    this.webView = webView;
    
    var header = require('/components/header').get({
		showMenu: false,
    	enableButtons: false,
    	enableBackButton: true
	});
    header.setTitle('Twitter Login');
    
    mainView.add(header.getView());
    mainView.add(webView);
    
    webViewWindow.add(mainView);
    
    Window.open(webViewWindow); 

    webView.addEventListener('beforeload', function(e) {
        Loader.show(undefined, noScreenBlock=true);
    });

    webView.addEventListener('load', function(event) {
      // If we're not on the Twitter authorize page
      if (event.url.indexOf(self.authorizeUrl) === -1) {
        Loader.show(undefined, noScreenBlock=true);
      } else {
        // Grab the PIN code out of the DOM
        var pin = event.source.evalJS("document.getElementById('oauth_pin').getElementsByTagName('code')[0].innerText");
        
        if (!pin) {
          // We're here when:
          // - "No thanks" button clicked
          // - Bad username/password

          Loader.hide();
        } else {
          Loader.hide();
          
          oauth.accessTokenUrl = "https://api.twitter.com/oauth/access_token?oauth_verifier=" + pin;
          
          oauth.fetchAccessToken(function(data) {
          	// if (isAndroid) { // we have to wait until now to close the modal window on Android: http://developer.appcelerator.com/question/91261/android-probelm-with-httpclient
              webViewWindow.close();
            // }
            
            setTimeout(function() {
            	self.fireEvent('login', {
	              success: true,
	              error: false,
	              accessTokenKey: oauth.getAccessTokenKey(),
	              accessTokenSecret: oauth.getAccessTokenSecret()
	            });
	            self.authorized = true;
            }, 1000);
			// var returnedParams = oauth.parseTokenRequest(data.text);
          }, function(data) {
          	// if (isAndroid) { // we have to wait until now to close the modal window on Android: http://developer.appcelerator.com/question/91261/android-probelm-with-httpclient
              webViewWindow.close();
            // }
            
            setTimeout(function() {
            	self.fireEvent('login', {
	              success: false,
	              error: "Failure to fetch access token, please try again.",
	              result: data
	            });
            }, 1000);
          });
        }
      }
    });
    
  }
  
  /*
   * Requests the user to authorize via Twitter through a modal WebView.
   */
  Twitter.prototype.authorize = function() {
    var self = this;
    
    if (this.authorized) {
      // TODO: verify access tokens are still valid?
      
      // We're putting this fireEvent call inside setTimeout to allow
      // a user to add an event listener below the call to authorize.
      // Not totally sure if the timeout should be greater than 1. It
      // seems to do the trick on iOS/Android.
      setTimeout(function() {
        self.fireEvent('login', {
          success: true,
          error: false,
          accessTokenKey: self.accessTokenKey,
          accessTokenSecret: self.accessTokenSecret
        });
      }, 1);
    } else {
      createAuthWindow.call(this);

      this.oauthClient.fetchRequestToken(
        function(requestParams) {
          var authorizeUrl = self.authorizeUrl + requestParams;
          self.webView.url = authorizeUrl;
        },
        function(data) {
          self.fireEvent('login', {
            success: false,
            error: "Failure to fetch access token, please try again.",
            result: data
          });
        }
      );
    }
  };
  
  /*
   * Make an authenticated Twitter API request.
   * 
   * @param {String} path the Twitter API path without leading forward slash. For example: `1/statuses/home_timeline.json`
   * @param {Object} params  the parameters to send along with the API call
   * @param {String} [httpVerb="GET"] the HTTP verb to use
   * @param {Function} callback
   */
  Twitter.prototype.request = function(path, params, headers, httpVerb, callback) {
    var self = this, oauth = this.oauthClient, url;

    if (path.match(/^https?:\/\/.+/i)) {
        url = path;
    } else {
        url = 'https://api.twitter.com/' + path;
    }

    oauth.request({
      method: httpVerb,
      url: url,
      data: params,
      headers: headers,
      success: function(data) {
        callback.call(self, {
          success: true,
          error: false,
          result: data
        });
      },
      failure: function(data) { 
        callback.call(self, {
          success: false,
          error: "Request failed",
          result: data
        });
      }
    });
  };
  
  Twitter.prototype.logout = function(callback){
  	var self = this;
  	
  	this.oauthClient.setAccessToken('', '');
    this.accessTokenKey = null;
    this.accessTokenSecret = null;
    this.authorized = false;
    
    callback();
  };
  
  /*
   * Add an event listener
   */
  Twitter.prototype.addEventListener = function(eventName, callback) {
    this.listeners = this.listeners || {};
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(callback);
  };
  
  /*
   * Fire an event
   */
  Twitter.prototype.fireEvent = function(eventName, data) {
    var eventListeners = this.listeners[eventName] || [];
    for (var i = 0; i < eventListeners.length; i++) {
      eventListeners[i].call(this, data);
    }
  };
  
  return Twitter;
})(this);
