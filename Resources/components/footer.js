exports.get = function(defaultSelectedTab, subTab) {
	var _style = require('/components/styles/footer').get();
	
	var footerContainerView = Ti.UI.createView(_style.footerContainerView);
	
	var btnStyleFeedView = UI.createClickableView(_style.buttonView);
	var btnStyleFeed = Ti.UI.createLabel(Utils._.extend({}, _style.footerButton, {
	    backgroundImage: '/images/footer/stylefeed.png',
	    top: UI.top(8),
	    width: UI.width(21),
	    height: UI.height(21),
	    key: 'stylefeed'
	}));
	var lblStyleFeed = Ti.UI.createLabel(Utils._.extend({}, _style.buttonTitle, {
	    text: 'STYLFEED'
	}));
	btnStyleFeedView.add(btnStyleFeed);
	btnStyleFeedView.add(lblStyleFeed);
	
	var btnShopView = UI.createClickableView(_style.buttonView);
	var btnShop = Ti.UI.createLabel(Utils._.extend({}, _style.footerButton, {
	    backgroundImage: '/images/footer/shop.png',
	    width: UI.width(15.5),
	    height: UI.height(21),
	    key: 'shop'
	}));
	var lblShop = Ti.UI.createLabel(Utils._.extend({}, _style.buttonTitle, {
	    text: 'SHOP'
	}));
	btnShopView.add(btnShop);
	btnShopView.add(lblShop);
	
	var btnSellView = UI.createClickableView(_style.buttonView);
	var btnSell = Ti.UI.createLabel(Utils._.extend({}, _style.footerButton, {
	    backgroundImage: '/images/footer/sell.png',
	    width: UI.width(21),
	    height: UI.height(21),
	    key: 'sell'
	}));
	var lblSell = Ti.UI.createLabel(Utils._.extend({}, _style.buttonTitle, {
	    text: 'SELL'
	}));
	btnSellView.add(btnSell);
	btnSellView.add(lblSell);
	
	var btnSocialView = UI.createClickableView(_style.buttonView);
	var btnSocial = Ti.UI.createLabel(Utils._.extend({}, _style.footerButton, {
	    backgroundImage: '/images/footer/social.png',
	    width: UI.width(21),
	    height: UI.height(21),
	    key: 'social'
	}));
	var lblSocial = Ti.UI.createLabel(Utils._.extend({}, _style.buttonTitle, {
	    text: 'SOCIAL'
	}));
	var lblNotificationCount = Ti.UI.createLabel({
		backgroundColor: '#ef4e6d',
		top: 5,
		right: UI.right(0),
		width: Ti.UI.SIZE,
		height: UI.height(15), // Ti.UI.SIZE,
		font: {
			fontSize: UI.fontSize(10),
			fontFamily: constant.FONT.DEFAULT_FONT
		},
		color: '#fff',
		visible: true,
		borderRadius: UI.height(7.5)
	});
	btnSocialView.add(btnSocial);
	btnSocialView.add(lblSocial);
	btnSocialView.add(lblNotificationCount);
	
	if(Ti.App.Properties.hasProperty('notificationCount')) {
		if(Ti.App.Properties.getInt('notificationCount') > 0) {
			lblNotificationCount.text = '  ' + Ti.App.Properties.getInt('notificationCount') + '  ';
			lblNotificationCount.visible = true;
		}
	}
	
	var btnStyleFileView = UI.createClickableView(_style.buttonView);
	var btnStyleFile = Ti.UI.createLabel(Utils._.extend({}, _style.footerButton, {
	    backgroundImage: '/images/footer/stylefile.png',
	    width: UI.width(20),
	    height: UI.height(21),
	    key: 'stylefile'
	}));
	var lblStyleFile = Ti.UI.createLabel(Utils._.extend({}, _style.buttonTitle, {
	    text: 'STYLFILE'
	}));
	btnStyleFileView.add(btnStyleFile);
	btnStyleFileView.add(lblStyleFile);
	
	// if(!Utils.isUserLoggedIn()) {
		// btnSellView.touchEnabled = false;
		// btnSellView.opacity = 0.70;
		// btnSocialView.touchEnabled = false;
		// btnSocialView.opacity = 0.70;
		// btnStyleFileView.touchEnabled = false;
		// btnStyleFileView.opacity = 0.70;
	// }
	
	footerContainerView.add(btnStyleFeedView);
	footerContainerView.add(btnShopView);
	footerContainerView.add(btnSellView);
	footerContainerView.add(btnSocialView);
	footerContainerView.add(btnStyleFileView);
	
	
	var _footerButtons = [btnStyleFeedView, btnShopView, btnSellView, btnSocialView, btnStyleFileView];
	
	for(var i=0; i<_footerButtons.length; i++) {
		_footerButtons[i].addEventListener('click', function(e) {
			if(!Utils.isUserLoggedIn() && (this.children[0].key == 'sell' || this.children[0].key == 'social' || this.children[0].key == 'stylefile')) {
	    		UI.showLoginAlert();
	    		return;
			}
			for(var i=0; i<_footerButtons.length; i++) {
				_footerButtons[i].children[0].backgroundImage = '/images/footer/'+_footerButtons[i].children[0].key+'.png';
				_footerButtons[i].children[1].color = '#858585';
			}
			this.children[0].backgroundImage = '/images/footer/'+this.children[0].key+'-active.png';
			this.children[1].color = '#e0436d';
			
			Ti.App.fireEvent('onFooterTabSelect', {key: this.children[0].key});
		});
		
		if(_footerButtons[i].children[0].key == defaultSelectedTab) {
			_footerButtons[i].children[0].backgroundImage = '/images/footer/'+_footerButtons[i].children[0].key+'-active.png';
			if(!subTab) {
				var _index = i;
				setTimeout(function() {
					_footerButtons[_index].fireEvent('click');
				}, 500);
			}
		}
	}
	
	
	var _setSelectedTab = function(selectedTab) {
		for(var i=0; i<_footerButtons.length; i++) {
			_footerButtons[i].children[0].backgroundImage = '/images/footer/'+_footerButtons[i].children[0].key+'.png';
			_footerButtons[i].children[1].color = '#858585';
			
			if(_footerButtons[i].children[0].key == selectedTab) {
				_footerButtons[i].children[0].backgroundImage = '/images/footer/'+_footerButtons[i].children[0].key+'-active.png';
				_footerButtons[i].children[1].color = '#e0436d';
			}
		}
	};
	
	
	var _selectTab = function(tab) {
		for(var i=0; i<_footerButtons.length; i++) {
			if(_footerButtons[i].children[0].key == tab) {
				_footerButtons[i].fireEvent('click');
			}
		}
	};
	
	
	var _setNotificationCount = function(count) {
		if(count == 0) {
			return;
		}
		Ti.App.Properties.setInt('notificationCount', count);
		lblNotificationCount.text = '  ' + count + '  ';
		lblNotificationCount.visible = true;
	};
	
	
	var _getNotificationCount = function() {
		if(Ti.App.Properties.hasProperty('notificationCount')) {
			return Ti.App.Properties.getInt('notificationCount');
		}
		return 0;
	};
	
	
	var _increaseNotificationCount = function() {
		if(Ti.App.Properties.hasProperty('notificationCount')) {
			Ti.App.Properties.setInt('notificationCount', (Ti.App.Properties.getInt('notificationCount') + 1));
		}
		else {
			Ti.App.Properties.setInt('notificationCount', 1);
		}
		lblNotificationCount.text = '  ' + Ti.App.Properties.getInt('notificationCount') + '  ';
		lblNotificationCount.visible = true;
	};
	
	
	var _clearNotificationCount = function() {
		if(Ti.App.Properties.hasProperty('notificationCount')) {
			Ti.App.Properties.removeProperty('notificationCount');
		}
		lblNotificationCount.text = '  0  ';
		lblNotificationCount.visible = false;
	};
	
	
	var _resetSelectedTab = function() {
		for(var i=0; i<_footerButtons.length; i++) {
			_footerButtons[i].children[0].backgroundImage = '/images/footer/'+_footerButtons[i].children[0].key+'.png';
			_footerButtons[i].children[1].color = '#858585';
		}
	};

	
	var _getView = function() {
		return footerContainerView;
	};
	
	
	return {
		getView: _getView,
		setSelectedTab: _setSelectedTab,
		selectTab: _selectTab,
		resetSelectedTab: _resetSelectedTab,
		getNotificationCount: _getNotificationCount,
		increaseNotificationCount: _increaseNotificationCount,
		setNotificationCount: _setNotificationCount,
		clearNotificationCount: _clearNotificationCount
	};
};
