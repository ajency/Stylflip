exports.get = function(rightView) {
	var _style = require('/components/styles/leftMenu').get();
	var LEFT_MENU_WIDTH = UI.width(245);	
	var OVERLAY_OPACITY = 0.50;
	var ANIMATION_DURATION = 350;
	var currentWindow = Window.getCurrentWindow();
	
	var _leftMenuOptions = [
		{image: '/images/leftMenu/invite-friends.png', width: UI.width(36), height: UI.height(36), title: 'invite friends', key: 'inviteFriends', enabled: Utils.isUserLoggedIn()},
		{image: '/images/leftMenu/orders.png', width: UI.width(36), height: UI.height(36), title: 'my orders', key: 'myOrders', enabled: Utils.isUserLoggedIn()},
		{image: '/images/leftMenu/sales.png', width: UI.width(30), height: UI.height(30), title: 'my sales', key: 'mySales', enabled: Utils.isUserLoggedIn()},
		{image: '/images/leftMenu/sfpromise.png', width: UI.width(36), height: UI.height(36), title: 'the StylFlip promise', key: 'stylFlipPromise', enabled: true},
		// {image: '/images/leftMenu/terms.png', width: UI.width(36), height: UI.height(36), title: 'terms of service', key: 'termsOfService', enabled: true},
		{image: '/images/leftMenu/styl-assist.png', width: UI.width(28), height: UI.height(28.5), title: 'help & support', key: 'helpAndSupport', enabled: true, subOptions: [
			/*{title: 'FAQ\'s', key: 'faq'}, 
			{title: 'StylFlip guides', key: 'stylFlipGuides'}, 
			{title: 'shipping & delivery policy', key: 'shippingAndDeliveryPolicy'},
			{title: 'returns & cancellellations policy', key: 'returnsAndCancellationsPolicy'},
			{title: 'about StylFlip', key: 'aboutStylFlip'},
			{title: 'contact us', key: 'contactUs'}*/
		]},
		{image: '/images/leftMenu/terms.png', width: UI.width(28), height: UI.height(28.5), title: 'legal information', key: 'legalInformation', enabled: true, subOptions: [
			/*{title: 'terms & conditions', key: 'termsAndConditions'},
			{title: 'privacy policy', key: 'privacyPolicy'}*/
		]},
		{image: '/images/leftMenu/rate-us.png', width: UI.width(36), height: UI.height(36), title: 'rate us', key: 'rateUs', enabled: true},
		{image: Utils.isNotificationOn() ? '/images/leftMenu/toggle-on.png' : '/images/leftMenu/toggle-off.png', width: UI.width(26*1.3), height: UI.height(15*1.3), title: 'notifications', key: 'notifications', enabled: Utils.isUserLoggedIn()},
		{title: Utils.isUserLoggedIn() ? 'LOG OUT' : 'LOG IN', key: 'logout', enabled: true}
	];
	
	var leftView = Ti.UI.createView(Utils._.extend({}, _style.leftView, {
        left: -LEFT_MENU_WIDTH,
		width: LEFT_MENU_WIDTH,
		isMoving: false
    }));	
    
    
    /*
     * Header view
     */
    var leftMenuHeader = require('/components/header').get();
    leftMenuHeader.setTitle('Menu');
	leftView.add(leftMenuHeader.getView());
    
	var leftMenuOptionsView = Ti.UI.createScrollView(Utils._.extend({}, _style.leftMenuOptionsView, {
        width: LEFT_MENU_WIDTH
    }));	
    

	for(var i=0; i<_leftMenuOptions.length; i++) {
		var optionView = UI.createClickableView(Utils._.extend({}, _style.optionView, {
	        key: _leftMenuOptions[i].key,
	        title: _leftMenuOptions[i].title,
	        hint: _leftMenuOptions[i].hint,
	        opacity: _leftMenuOptions[i].enabled ? 1 : 0.5,
	        enabled: _leftMenuOptions[i].enabled,
	        touchEnabled: _leftMenuOptions[i].enabled
	    }));
	    
		var imgOption = Ti.UI.createImageView(Utils._.extend({}, _style.imgOption, {
			image: _leftMenuOptions[i].image,
			width: _leftMenuOptions[i].width/1.3,
			height: _leftMenuOptions[i].height/1.3
	    }));
	    
	    if(_leftMenuOptions[i].key == 'mySales') {
	    	imgOption.left = UI.left(25);
	    }
		
		var lblOption = Ti.UI.createLabel(Utils._.extend({}, _style.lblOption, {
			text: _leftMenuOptions[i].title
	    }));
	    
	    if(!_leftMenuOptions[i].image) {
	    	lblOption.left = UI.left(15);
	    }
	    
	    optionView.addEventListener('click', function() {
	    	if(this.subView) {
	    		this.subView.height = this.subView.height == 0 ? Ti.UI.SIZE : 0;
	    		return;
	    	}
	    	if(this.key == 'notifications') {
	    		Ti.API.info(constant.APP + " $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ LEFTMENU OPTIONS CLICKED ###############################");
	    		Utils.toggleNotification();
	    		if(this.children[0].image == '/images/leftMenu/toggle-on.png') {
	    			this.children[0].image = '/images/leftMenu/toggle-off.png';
	    		}
	    		else {
	    			this.children[0].image = '/images/leftMenu/toggle-on.png';
	    		}
	    		return;
	    	}
	    	if(this.key == 'rateUs') {
	    		if(osname == 'android') {
	    			Ti.Platform.openURL('https://play.google.com/store/apps/details?id=com.under1r.StylFlip');
	    		}
	    		else {
	    			Ti.Platform.openURL('https://itunes.apple.com/in/app/stylflip/id1072334629?mt=8');
	    		}
	    		_hide();
	    		return;
	    	}
	    	_hide();
    		Ti.App.fireEvent('onOptionSelect', {key: this.key, title: this.title, hint: this.hint});
	    });
		
		optionView.add(imgOption);
		optionView.add(lblOption);
		
		leftMenuOptionsView.add(optionView);
		
		if(_leftMenuOptions[i].hasOwnProperty('subOptions') && _leftMenuOptions[i].subOptions.length > 0) {
			var subOptionsView = Ti.UI.createView({
				width: Ti.UI.FILL,
				height: 0,
				layout: 'vertical'
			});
			for(var j=0; j<_leftMenuOptions[i].subOptions.length; j++) {
				var lblOption = UI.createClickableLabel(Utils._.extend({}, _style.lblOption, {
					text: _leftMenuOptions[i].subOptions[j].title,
					top: j == 0 ? UI.top(5) : UI.top(15),
					font: {
						fontSize: UI.fontSize(12),
						fontFamily: constant.FONT.DEFAULT_FONT
					},
					key: _leftMenuOptions[i].subOptions[j].key
			    }));
			    lblOption.addEventListener('click', function() {
			    	_hide();
    				Ti.App.fireEvent('onOptionSelect', {key: this.key, title: this.text, hint: ''});
			    });
			    subOptionsView.add(lblOption);
			}
			
			leftMenuOptionsView.add(subOptionsView);
			optionView.subView = subOptionsView;
		}
		
		var dividerLine = Ti.UI.createView(Utils._.extend({}, _style.dividerLine, {
			width: LEFT_MENU_WIDTH - UI.left(15)
	    }));
		leftMenuOptionsView.add(dividerLine);
	}
	
	leftView.add(leftMenuOptionsView);
	
	
	var overlayView = Ti.UI.createView(_style.overlayView);
    
    
    var _getView = function() {
    	return leftView;
    };
	
	
	var _hideCallback;
	
	var _show = function(hideCallback) {
		if(leftView.isMoving) {
			return;
		}
		
		leftView.isMoving = true;
		
		currentWindow.add(overlayView);
		
		_hideCallback = hideCallback;
		// if(!rightView.left || (rightView.left && rightView.left == 0)) {
			// rightView.left = 0;
		// }
		
		currentWindow.add(leftView);
		
		overlayView.opacity = 0;
		
        overlayView.animate({
            left: LEFT_MENU_WIDTH,
            opacity: OVERLAY_OPACITY,
            duration: ANIMATION_DURATION
        }, function(e) {
            overlayView.left = LEFT_MENU_WIDTH;
            if(osname != "android") {
            	overlayView.opacity = OVERLAY_OPACITY;
            }
            e.source = null;
        });
		
		leftView.animate({
			left: 0,
			duration: ANIMATION_DURATION
		}, function(e) {
			leftView.left = 0;
			e.source = null;
			leftView.isMoving = false;
		});
		
		// rightView.animate({
			// left: LEFT_MENU_WIDTH,
			// duration: ANIMATION_DURATION
		// }, function(e) {
			// rightView.left = LEFT_MENU_WIDTH;
			// e.source = null;
		// });
	};
	
	
	var _hide = function() {
		if(leftView.isMoving) {
			return;
		}
		
		leftView.isMoving = true;
		
		overlayView.opacity = OVERLAY_OPACITY;
		
		overlayView.animate({
            left: 0,
            opacity: 0,
            duration: ANIMATION_DURATION
        }, function(e) {
        	if(osname != "android") {
    			overlayView.opacity = 0;
        	}
            currentWindow.remove(overlayView);
            overlayView.left = 0;
            overlayView.removeEventListener('click', _hide);
            overlayView = null;
            currentWindow = null;
            e.source = null;
        });
		
		leftView.animate({
			left: -LEFT_MENU_WIDTH,
			duration: ANIMATION_DURATION
		}, function(e) {
			leftView && (leftView.left = -LEFT_MENU_WIDTH);
			e.source = null;
			leftView.isMoving = false;
		});
		
		// rightView.animate({
			// left: 0,
			// duration: ANIMATION_DURATION
		// }, function(e) {
			// rightView.left = 0;
			// LEFT_MENU_WIDTH = null;
			// // leftView.removeEventListener('click', _hide);
			// leftView = null;
			// rightView = null;
			// _show = null;
			// _hide = null;
			// Utils._.isFunction(_hideCallback) && _hideCallback();
			// _hideCallback = null;
			// e.source = null;
		// });
	};
	
	var _dragStarted = false;
	var _currentX, _isDragged = false;
	var _startX, _offsetX = 1;
	var _isMoving = false;
	
	var _startDragging = function(posX) {
		if(!_dragStarted) {
			// currentWindow.add(overlayView);
			currentWindow.add(leftView);
			rightView.left = 0;
			_startX = parseInt(posX);
		}
		else {
			var coordinates = parseInt(posX) - _startX;
		    if(coordinates > 20 || coordinates < -20){
		        _isMoving = true;
		    }
		    if(_isMoving == true && coordinates <= LEFT_MENU_WIDTH && coordinates >= 0) {
		        // This will smooth the animation and make it less jumpy
		        rightView.animate({
		            left: coordinates,
		            duration: 20
		        });
		        rightView.left = coordinates;
		        
		        leftMenu.animate({
		            left: rightView.left - LEFT_MENU_WIDTH,
		            duration: 20
		        });
		        leftMenu.left = rightView.left - LEFT_MENU_WIDTH;
		    }
		}
		
		_dragStarted = true;
	};
	
	var _endDragging = function(dragEndCallback) {
		_dragStarted = false;
		_isMoving = false;
	    
	    if(rightView.left >= LEFT_MENU_WIDTH/2 && rightView.left < LEFT_MENU_WIDTH) {
	        _show();
	    }
	    else {
	        _hide();
	    }
		Utils._.isFunction(dragEndCallback) && dragEndCallback();
	};
	
	overlayView.addEventListener('click', _hide);
	// leftView.addEventListener('click', _hide);
	
	return {
		show: _show,
		hide: _hide,
		getView: _getView,
		startDragging: _startDragging,
		endDragging: _endDragging
	};
};
