exports.get = function(menus) {
	var mainView = Ti.UI.createView({
		backgroundColor: '#fff',
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		layout: 'vertical'
	}); 
	
	var _arrViews = [];
	
	for(var i = 0; i < menus.length; i++) {
		var accordionView = UI.createClickableView(Utils._.extend({}, _commonStyle.accordionView, {
			top: i == 0 ? UI.top(20) : -1,
			url: constant.DOMAIN + 'htmls/' + menus[i].url,
			title: menus[i].title
	    }));
	    var accordionLabel = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
	    	text: menus[i].title
	    }));
	    var imgRightArrow = Ti.UI.createImageView(_commonStyle.rightArrow);
	    accordionView.add(accordionLabel);
	    accordionView.add(imgRightArrow);
	    
        mainView.add(accordionView);
        
        _arrViews.push(accordionView);
	}
    
    for(var i = 0; i < _arrViews.length; i++) {
    	_arrViews[i].addEventListener('click', function() {
    		var window = Window.create(exitOnClose=false, false, disableClick=true);
			var details = require('/screens/termDetails').get(this.title, this.url, true);
	        window.add(details.getView());
	        Window.open(window); 
    	});
    }
	
    
    var _getView = function() {
        return mainView;
    };
    
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
