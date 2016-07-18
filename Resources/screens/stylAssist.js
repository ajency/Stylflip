exports.get = function() {
	var mainView = Ti.UI.createView({
		backgroundColor: '#fff',
		width: Ti.UI.FILL,
		height: Ti.UI.FILL
	}); 
	
	var webView = Ti.UI.createWebView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		url : constant.DOMAIN + 'htmls/stylAssist.html'
	});
	mainView.add(webView);	  
	
	
    var _getView = function() {
        return mainView;
    };
    
    var _removeFromMemory = function() {
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

