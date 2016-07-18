exports.get = function(config) {
	var scrollableView = config.scrollableView ? config.scrollableView : undefined;
	var _pageLength = config.scrollableView ? config.scrollableView.views.length : 0;
	
	var mainView = Ti.UI.createView({
		backgroundColor: 'transparent',
		width: Ti.UI.FILL,
		height: config.height != undefined ? config.height : UI.height(20)
	});
	
	if(config.top != undefined) {
		mainView.top = config.top;
	}
	
	if(config.bottom != undefined) {
		mainView.bottom = config.bottom;
	}
	
	var transparentView = Ti.UI.createView({
		backgroundColor: config.backgroundColor ? config.backgroundColor : '#000',
		width: Ti.UI.FILL,
		height: config.height != undefined ? config.height : UI.height(20),
		opacity: 0.50
	});
	var dotsView = Ti.UI.createView({
		width: Ti.UI.SIZE,
		height: Ti.UI.FILL,
		layout: 'horizontal'
	});
	mainView.add(transparentView);
	mainView.add(dotsView);
	
	if(scrollableView) {
		var _arrControls = [], _lastSelectedPageIndex = scrollableView.currentPage;
		
		scrollableView.addEventListener('scrollend', function(e) {
			_arrControls[_lastSelectedPageIndex].backgroundColor = '#fff';
			_arrControls[e.currentPage].backgroundColor = '#ef4e6d';
			_lastSelectedPageIndex = e.currentPage;
		});
		
		for(var i=0; i<_pageLength; i++) {
			var control = Ti.UI.createView({
				backgroundColor: i == scrollableView.currentPage ? '#ef4e6d' : '#fff',
				left: UI.left(10),
				top: (mainView.height - UI.height(8)) / 2,
				width: UI.width(8),
				height: UI.height(8),
				borderRadius: UI.height(4)
			});
			if(i == _pageLength - 1) {
				control.right = UI.right(10);
			}
			_arrControls.push(control);
			dotsView.add(control);
		}
	}
	
	
	var _getView = function() {
		return mainView;
	};
	
    
    var _removeFromMemory = function() {
    	config = null;
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