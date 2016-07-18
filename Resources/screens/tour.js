exports.get = function() {
    var _style = require('/styles/login').get();
    
    var tourView = Ti.UI.createView({
    	width: Ti.UI.FILL,
    	height: Ti.UI.FILL
    }); 
    
    
    var _arrImageViews = [], _pageControls = [];
    
    for(var i=1; i<=6; i++) {
    	var imageView = Ti.UI.createImageView({
    		image: '/images/tour/screen'+i+'.jpg',
    		width: Ti.UI.FILL,
    		height: Ti.UI.FILL
    	});
    	_arrImageViews.push(imageView);
    }
    
    
	var scrollableView = Ti.UI.createScrollableView({
		views: _arrImageViews,
		height: Ti.UI.SIZE,
		disableBounce: true
	});
	var pagingControlView = Ti.UI.createView({
		bottom: UI.bottom(80),
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		layout: 'horizontal'
	});
	for(var i=0; i<6; i++) {
		var imgPage = Ti.UI.createImageView({
			// image: i == 0 ? '/images/common/scroll-act.png' : '/images/common/scroll-inact.png',
			backgroundColor: i == 0 ? '#fff' : 'transparent',
			left: i == 0 ? 0 : UI.left(10),
			width: UI.width(8),
			height: UI.height(8),
			borderColor: '#fff',
			borderWidth: 1,
			borderRadius: UI.width(4)
		});
		_pageControls.push(imgPage);
		pagingControlView.add(imgPage);
	}
	
	var btnStartFlipping = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: '  START FLIPPING  ',
        backgroundColor: '#fff',
        bottom: UI.bottom(20),
        width: Ti.UI.SIZE,
        height: UI.height(35),
        font: {
            fontSize: UI.fontSize(16),
            fontFamily: constant.FONT.ABEATBYKAI
        },
        borderRadius: UI.width(17.5)
    }));
	
	tourView.add(scrollableView);
	tourView.add(pagingControlView);
	tourView.add(btnStartFlipping);
	
	
	scrollableView.addEventListener('scrollend', function(e) {
		for(var i=0; i<_pageControls.length; i++) {
			// _pageControls[i].image = '/images/common/scroll-inact.png';
			_pageControls[i].backgroundColor = 'transparent';
		}
		// _pageControls[e.currentPage].image = '/images/common/scroll-act.png';
		_pageControls[e.currentPage].backgroundColor = '#fff';
	});
	
	
	btnStartFlipping.addEventListener('click', function() {
        var currentWindow = Window.getCurrentWindow();
        var lastChild = currentWindow.children[currentWindow.children.length-1];
        
        currentWindow.remove(lastChild);
        Window.clearMemory(lastChild);
        
	 	var login = require('/screens/login').get();
		currentWindow.add(login.getView());
	});
    
    
    var _getView = function() {
        return tourView;
    };
    
    
    var _removeFromMemory = function() {
        Window.clearMemory(tourView);
        tourView = null;
        _getView = null;
        _removeFromMemory = null;
    };
    
    
    return {
        getView: _getView,
        removeFromMemory: _removeFromMemory
    };
};

