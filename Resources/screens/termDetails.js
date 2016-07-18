exports.get = function(pageTitle, pageUrl, header) {
	var mainView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		layout: 'vertical'
	});
	
	if(header) {
		Analytics.trackScreen({
			screenName: pageTitle
		});
		
		var header = require('/components/header').get({
			showMenu: false,
	    	enableButtons: false,
	    	enableBackButton: true
		});
	    header.setTitle(Utils.toEachWordUppercase(pageTitle));
	}
	
	var webView = Ti.UI.createWebView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		url : pageUrl
	});
	
	if(header) {
		mainView.add(header.getView());
	}
	mainView.add(webView);
	
	
	// Loader.show();
	
	webView.addEventListener('load', function(e) {
		// Loader.hide();
	});
	
	webView.addEventListener('beforeload', function(e) {
		// Loader.show();
	});
	
    
    var _getView = function() {
        return mainView;
    };
    
    
    Window.getCurrentWindow().addEventListener('close', function() {
    	_removeFromMemory();
    });
    
    var _removeFromMemory = function() {
    	_style = null;
        Window.clearMemory(mainView);
        mainView = null;
        _getView = null;
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        removeFromMemory: _removeFromMemory
    };
};

