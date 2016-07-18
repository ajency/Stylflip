exports.get = function(arrViews, leftMargin, clickCallback) {
	var _style = require('/components/styles/scrollingImagesView').get();
	
    var _buttonWidth = 0;
    var _scrollingViewWidth = UI.width(300);
    var _scrollingViewHeight = arrViews && arrViews.length > 0 && arrViews[0].height ? arrViews[0].height : UI.height(100);
    
    var mainView = Ti.UI.createView({
    	width: UI.width(310),
    	height: _scrollingViewHeight
    });
	
	var btnPrev = UI.createClickableView({
		left: 0,
		width: UI.width(32.5),
		height: Ti.UI.FILL
	});
	
	var imgPrev = Ti.UI.createImageView({
		backgroundImage: '/images/common/arrow-left.png',
		width: UI.width(7.5),
		height: UI.height(12)
	});
	
	btnPrev.add(imgPrev);
	
    var scrollingView = Ti.UI.createScrollView(Utils._.extend({}, _style.scrollingView, {
		width: UI.width(245),
		height: _scrollingViewHeight,
		contentWidth: (arrViews.length * arrViews[0].width) + ((arrViews.length - 1) * leftMargin), // 'auto',
		contentHeight: _scrollingViewHeight,
		scrollType: 'horizontal',
		isHolder: true
    }));
    if(osname != 'android') {
    	scrollingView.disableBounce = true;
    }
    
    var btnNext = UI.createClickableView({
		right: 0,
		width: UI.width(32.5),
		height: Ti.UI.FILL
	});
	
	var imgNext = Ti.UI.createImageView({
		backgroundImage: '/images/common/arrow-right.png',
		width: UI.width(7.5),
		height: UI.height(12)
	});
	
	btnNext.add(imgNext);
	
	UI.disableButton(btnPrev, {opacity: 0.5});
	if(scrollingView.contentWidth <= scrollingView.width) {
		UI.disableButton(btnNext, {opacity: 0.5});
	}
	
	mainView.add(btnPrev);
	mainView.add(scrollingView);
	mainView.add(btnNext);
	

	function _renderView(posX) {
		for(var i=0; i<scrollingView.children.length; i++) {
			var _point = scrollingView.children[i].convertPointToView({x: scrollingView.children[i].left, y: 0 }, scrollingView);
			if(_point.x > (0 - parseInt(scrollingView.children[i].width)) && _point.x < parseInt(scrollingView.width)) {
				scrollingView.children[i].image = scrollingView.children[i].strImagePath;
			}
			else {
				scrollingView.children[i].image = null;
			}
			// Ti.API.info(i + ' => ' + _point.x + ' => ' + (0 - parseInt(scrollingView.children[i].width)) + ' => ' + parseInt(scrollingView.width) + ' => ' + scrollingView.children[i].image);
		}
	}
	
	scrollingView.addEventListener('scroll', function(e) {
		_renderView(e.x);
		
		if(e.x <= 0) {
			UI.disableButton(btnPrev, {opacity: 0.5});
		}
		else if(e.x >= maxScrollX) {
			UI.disableButton(btnNext, {opacity: 0.5});
		}
		else {
			UI.enableButton(btnPrev, {opacity: 1});
			UI.enableButton(btnNext, {opacity: 1});
		}
	});
		
	var scrollX = 0;
	var maxScrollX = (leftMargin * (arrViews.length - 1)) + (arrViews[0].width * arrViews.length) - scrollingView.width;
	var scrollXStep = arrViews[0].width + leftMargin;
	
	btnPrev.addEventListener('click', function() {
		scrollX -= scrollXStep;
		if(scrollX < 0) {
			scrollX = 0;
		}
		if(scrollX == 0) {
			UI.disableButton(btnPrev, {opacity: 0.5});
		}
		else {
			UI.enableButton(btnPrev, {opacity: 1});
		}
		UI.enableButton(btnNext, {opacity: 1});
		scrollingView.scrollTo(scrollX, 0);
		_renderView(scrollX); 
	});
	
	btnNext.addEventListener('click', function() {
		scrollX += scrollXStep;
		if(scrollX > maxScrollX) {
			scrollX = maxScrollX;
		}			
		if(scrollX == maxScrollX) {
			UI.disableButton(btnNext, {opacity: 0.5});
		}
		else {
			UI.enableButton(btnNext, {opacity: 1});
		}
		UI.enableButton(btnPrev, {opacity: 1});
		scrollingView.scrollTo(scrollX, 0);
		_renderView(scrollX);
	});

    
    if(arrViews) {
    	for(var i=0; i<arrViews.length; i++) {
    		arrViews[i].left = i > 0 ? leftMargin : 0;
    		if(i > 0) {
    			arrViews[i].leftPos = arrViews[i-1].leftPos + arrViews[i-1].width + leftMargin;
    		}
    		else {
    			arrViews[i].leftPos = 0;
    		}
    		if(arrViews[i].image) {
    			arrViews[i].strImagePath = arrViews[i].image;
    		}
			if(arrViews[i].leftPos > scrollingView.width) {
				arrViews[i].image = null;
			}
			// Ti.API.info(i + ' => ' + arrViews[i].leftPos + ' => ' + scrollingView.width + ' => ' + arrViews[i].image);
		    scrollingView.add(arrViews[i]);
	    }
	    
	    if(clickCallback) {
	    	scrollingView.addEventListener('click', function(e) {
	    		if(this.isHolder) {
	    			clickCallback(e.source);
	    		}
		    });
	    }
    }
    
    
    var _setTop = function(top) {
        mainView.top = top?top:0;
    };
    
    
    var _setBackgroundColor = function(bgColor) {
    	if(bgColor) {
    		mainView.backgroundColor = bgColor;
    	}
    };
    
    
    var _getView = function() {
        return mainView;
    };
    
    var _removeFromMemory = function() {
    	_style = null;
        Window.clearMemory(buttonsView);
        buttonsView = null;
        _setTop = null;
        _setBackgroundColor = null;
        _getView = null;
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        removeFromMemory: _removeFromMemory,
        setTop: _setTop,
        setBackgroundColor: _setBackgroundColor
    };
};

