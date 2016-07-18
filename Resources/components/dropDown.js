exports.get = function(config) {
	var _style = require('/components/styles/dropDown').get();
	
	var _options = config && config.options ? config.options : [];
	var _selectionCallback;
	var _viewStyle = config && config.style ? config.style : undefined;
	
	var mainView = Ti.UI.createView(Utils._.extend({}, (_viewStyle ? _viewStyle : {}), {
		isOptionsViewAdded: false
    }));
	
	var lblOptionTitle = Ti.UI.createLabel({
    	text: 'Select Size',
    	left: UI.left(10),
    	width: Ti.UI.SIZE,
    	height: Ti.UI.FILL
    });
    var imgDropDown = Ti.UI.createImageView({
    	right: UI.left(25),
    	width: UI.width(20),
    	height: UI.height(20),
    	borderColor: 'green'
    });
    mainView.add(lblOptionTitle);
    mainView.add(imgDropDown);
    
    
    var optionsView = Ti.UI.createScrollView({
    	width: Ti.UI.FILL,
    	height: UI.height(100),
    	layout: 'vertical',
    });
    
    for(var i = 0; i<10; i++) {
    	var btnOption = UI.createButton({
    		title: 'Option ' + (i+1)
    	});
    	optionsView.add(btnOption);
    }
    
    mainView.addEventListener('click', function() {
    	if(this.isOptionsViewAdded) {
    		mainView.remove(optionsView);
    	}
    	else {
    		mainView.add(optionsView);
    	}
    	this.isOptionsViewAdded = !this.isOptionsViewAdded;
    });
	
	
	var _getView = function() {
		return mainView;
	};
	
	var _addEventListener = function(type, listener) {
		switch(type) {
			case 'select':
				_selectionCallback = listener;
			break;
		}
	};
	
	/*
	 * Clear all variables and functions from memory
	 */
	var _removeFromMemory = function() {
		Window.clearMemory(mainView);
		mainView = null;
		_getView = null;
		_addEventListener = null;
		_removeFromMemory = null;
	};
	
	return {
		getView: _getView,
		addEventListener: _addEventListener,
		removeFromMemory: _removeFromMemory
	};
};
