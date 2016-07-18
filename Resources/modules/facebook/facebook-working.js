exports.get = function(data, callback) {
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
    header.setTitle('Share to Facebook');
	
	var webView = Ti.UI.createWebView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		url : '/modules/facebook/facebook.html'
	});
	
	mainView.add(header.getView());
	mainView.add(webView);
	
	
	var _isLoaded = false;
	
	webView.addEventListener('load', function(e) {
		Loader.hide();
		if(!_isLoaded) {
			webView.evalJS("share('"+escape(JSON.stringify(data))+"');");
			_isLoaded = true;
		}
	});
	
	
	webView.addEventListener('beforeload', function(e) {
		Loader.show();
		// Ti.API.info(e.url);
		if(e.url.indexOf('http://stylflip.com/stylflip/fb/fb-success.php') > -1) {
			setTimeout(function() {
				Utils._.isFunction(callback) && callback({
					success: true
				});
			}, 1000);
			window.close();
		}
		if(e.url.indexOf('http://stylflip.com/stylflip/fb/fb-cancel.php') > -1) {
			window.close();
		}
	});
	
    
    var _removeFromMemory = function() {
    	_style = null;
        Window.clearMemory(mainView);
        mainView = null;
        _getView = null;
        _removeFromMemory = null;
    };
    
    
    var window = Window.create(exitOnClose=false, false, disableClick=true);
    Window.open(window); 
    
    window.addEventListener('open', function() {
    	window.add(mainView);
    });
    
    window.addEventListener('close', function() {
    	_removeFromMemory();
    });
};

