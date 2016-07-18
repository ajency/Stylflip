exports.get = function(isBackButton) {
	var mainView = Ti.UI.createView({
		backgroundColor: 'transparent',
		top: UI.top(0),
		height: UI.height(40),
		layout: 'vertical'
	});
	
	if(isIOS7Plus) {
	    mainView.height = UI.height(60);
	    
        var statusBar = Ti.UI.createView({
            backgroundColor: '#6A6A6A',
            top: UI.top(0),
            height: UI.height(20)
        });
        
        mainView.add(statusBar);
	}

    var headerView = Ti.UI.createView({
        backgroundColor: '#6A6A6A',
        top: UI.top(0),
        height: UI.height(40)
    });
    
	var lblHeaderTitle = Ti.UI.createLabel({
		font: {
			fontSize: UI.fontSize(18),
			fontFamily: constant.FONT.DEFAULT_FONT
		},
		color: '#fff'
	});
	headerView.add(lblHeaderTitle);
	
	if(isBackButton /* && Ti.Platform.osname != 'android' */) {
		var backButtonView = Ti.UI.createView({
			left: UI.left(0),
			width: UI.width(50),
			height: UI.height(50)			
		});
		
		var btnBack = UI.createButton({
			backgroundImage: '/images/btn-back.png',
			left: UI.left(10),
			width: UI.width(23),
			height: UI.height(18)
		});	
		
		backButtonView.add(btnBack);	
		
		backButtonView.addEventListener('click', function() {
		    Loader.hide();
			Window.getCurrentWindow().close();
		});
		
		headerView.add(backButtonView);
	}
	
	mainView.add(headerView);
	
	var _setTitle = function(headerTitle) {
		if(headerTitle && headerTitle.trim().length > 0) {
			lblHeaderTitle.text = headerTitle;
		}
	};

	var _getView = function() {
		return mainView;
	};
	
	return {
		getView: _getView,
		setTitle: _setTitle
	};
};
