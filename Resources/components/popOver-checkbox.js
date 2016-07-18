exports.get = function(config) {
	var _style = require('/components/styles/buttonBar').get();
	
    var _clickCallback, _isHeightExceeding = false;
    var _type = config.type ? config.type : 'plain';
    
	var mainView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Ti.UI.FILL
	});
	
	mainView.addEventListener('click', function(e) {
		_hide();
	});
	
	_isHeightExceeding = config.options.length * UI.height(40) > config.height;
	
	if(_isHeightExceeding) {
		var optionsView = Ti.UI.createScrollView({
			backgroundColor: '#fff',
			width: config.width != undefined ? config.width : UI.width(100),
			height: config.height,
			showVerticalScrollIndicator: true,
			layout: 'vertical',
			bubbleParent: false,
			borderColor: config.borderColor != undefined ? config.borderColor : 'transparent',
			borderWidth: config.borderWidth != undefined ? config.borderWidth : 0
		});
	}
	else {
		var optionsView = Ti.UI.createView({
			backgroundColor: '#fff',
			width: config.width != undefined ? config.width : UI.width(100),
			height: (config.height != undefined ? config.height : UI.height(80)) - 1,
			layout: 'vertical',
			bubbleParent: false,
			borderColor: config.borderColor != undefined ? config.borderColor : 'transparent',
			borderWidth: config.borderWidth != undefined ? config.borderWidth : 0
		});
	}
	
	optionsView.addEventListener('click', function(e) {
		alert(e.source.index);
		if(e.source.index != undefined) {
			Utils._.isFunction(_clickCallback) && _clickCallback({option: config.options[e.source.index], index: e.source.index});
		}
	});
	
	if(config.options != undefined) {
		for(var i=0; i<config.options.length; i++) {
			var optionView = UI.createClickableView(Utils._.extend({}, (config.optionStyle ? config.optionStyle : {}), {
				left: osname == 'android' ? UI.left(10) : 0,
				top: i == 0 ? 0 : -1,
				width: optionsView.width,
				height: _isHeightExceeding ? UI.height(40) : config.height / config.options.length,
				index: i,
				bubbleParent: true
		    }));
			var option = UI.createButton(Utils._.extend({}, _commonStyle.smallButton, (config.optionStyle ? config.optionStyle : {}), {
				title: config.options[i].title || config.options[i],
				left: osname == 'android' ? UI.left(10) : 0,
				width: Ti.UI.SIZE,
				bubbleParent: true,
				textAlign: 'left',
    			borderWidth: 0,
    			index: i,
    			bubbleParent: true
		    }));
		    var imgSelected = Ti.UI.createImageView({
		    	image: '/images/sell/form-check-off.png',
		    	right: UI.right(10),
		    	width: UI.width(15),
		    	height: UI.height(15),
		    	index: i,
    			bubbleParent: true
		    });
		    optionView.add(option);
		    optionView.add(imgSelected);
			optionsView.add(optionView);
		}
	}
	
	mainView.add(optionsView);
	
	
	/*
	 * Positioning logic
	 */
	if(config.sourceView) {
		var _optionsViewHeight = optionsView.toImage().height;
		// config.sourceView.borderColor = '#f4f4f4';
		var _point = (config.sourceView).convertPointToView({x: (config.sourceView).left != undefined ? (config.sourceView).left : 0, y: (config.sourceView).top != undefined ? (config.sourceView).top : 0 }, Window.getCurrentWindow());
		if(config.handleOffScreen != undefined && config.handleOffScreen == true && _point.y + _optionsViewHeight > UI.platformHeight - UI.height(50)) {
			_point.y = _point.y - _optionsViewHeight - config.sourceView.rect.height;
		}
		optionsView.left = _point.x - config.width + (config.sourceView).rect.width;
		optionsView.top = _point.y + (config.sourceView).rect.height - ((config.sourceView).top != undefined ? (config.sourceView).top : 0);
	}
	
	
	var _addEventListener = function(type, listener) {
		switch(type) {
			case 'click':
				_clickCallback = listener;
			break;
		}
	};
    
    var _show = function() {
    	Window.getCurrentWindow().add(mainView);
    };
    
    var _hide = function() {
    	// config.sourceView.borderColor = 'transparent';
    	Window.getCurrentWindow().remove(mainView);
    	_removeFromMemory();
    };
    
    var _removeFromMemory = function() {
    	_style = null;
    	config = null;
        Window.clearMemory(mainView);
        mainView = null;
        _show = null;
        _hide = null;
        _removeFromMemory = null;
    };
    
    return {
        show: _show,
        hide: _hide,
        addEventListener: _addEventListener,
        removeFromMemory: _removeFromMemory,
    };
};