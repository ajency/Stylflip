exports.get = function(tabToLoad) {
	Analytics.trackUser({
	  userId: Utils.isUserLoggedIn() ? Utils.loggedInUserId() : "0",
	  category: osname,
	  action: "Log in"
	});
	
    var _style = require('/styles/dashboard').get();
    
    var _isSearchBarVisible = false;
    var _notificationCountToBeDecreased = false;
    
    var _clearSearchField = function(){
    	Ti.API.info(constant.APP + " ################# CLEARING SEARCH FIELD ####################");
	    searchBar.setHidden(true);
	   	searchBar.setText('');
	    header.setSearchActive(false);
	    _isSearchBarVisible = false;
		try {
			currentView.searchData();
			_showSearchBar();
		}
		catch(e) {}
    };

    Ti.App.addEventListener('app:searchbarfocus',function(e){
    	if(e.type === 'add'){
    		addSearchChange();
    	}
    	else if(e.type === 'rem'){
    		remSearchChange();
    	}
    });

    var addSearchChange = function(){
    	if(UI.currentTextFieldFocused){
    		UI.currentTextFieldFocused.addEventListener('change',_searchBarChangeCallback);
    	}
    	else{
    		Ti.API.info(constant.APP + " ############ ADD NO CURRENT SEARCH TEXT FIELD FOCUSED ################");
    	}
    };

    var remSearchChange = function(){
    	if(UI.currentTextFieldFocused){
    		UI.currentTextFieldFocused.removeEventListener('change',_searchBarChangeCallback);
    		UI.currentTextFieldFocused = null;
    	}
    	else{
    		Ti.API.info(constant.APP + " ############ REM NO CURRENT SEARCH TEXT FIELD FOCUSED ################");
    	}
    }

    var _searchBarChangeCallback = function(){
		Ti.API.info(constant.APP + " #################### SEARCH BAR KEYPRESSED ###################");
		if(UI.currentTextFieldFocused){
			var headerView = header.getView();
			Ti.API.info(" searchBarVisiblbe: " + searchBar.visible + " headerVisible: " + headerView.visible + " UI.currentTextFieldFocused.value: " + UI.currentTextFieldFocused.value);
			if(headerView.visible){
				if((UI.currentTextFieldFocused.value).trim() !== '') {
					Ti.API.info(constant.APP + " #################### CLOSE ICON VISIBLE ###################");
					btnSearch.backgroundImage = '/images/header/closeicon.png';
				}
				else{
					Ti.API.info(constant.APP + " #################### SEARCH-ACTIVE ICON VISIBLE ###################");
					btnSearch.backgroundImage = '/images/header/search-active.png';
				}
			}
		}
	};

	var _searchIconClickCallback = function(e) {
		Ti.API.info(constant.APP + " <<<<<<<<<<<<<<<<<<< SEARCH BAR PROCEDURE >>>>>>>>>>>>>>>>>>>");
	    // var alertDialog = UI.createAlertDialog({
	    // 	title: constant.ALERT.TITLE.DONE_SEARCHING,
	    // 	message: 'Are you sure you want to clear your search?',
	    // 	buttonNames: ['YES', 'NO']
	    // });

	    // alertDialog.addEventListener('click', function(e) {
	    // 	if(e.index == 0) {
	    // 		_clearSearchField();
	    // 		try {
	    // 			currentView.searchData();
	    // 		}
	    // 		catch(e) {}
	    // 	}
	    // 	else if(e.index == 1) {
	    // 		Ti.API.info(constant.APP + " ################# SEARCH FIELD UNALTERED ####################");
	    // 		searchBar.setHidden(true);
	    // 		_isSearchBarVisible = false;
	    // 	}
	    // });
	    
		if(e.show) {
			Ti.API.info(constant.APP + " ################## SEARCH BAR SHOWN ##################");
			searchBar.setHidden(false);
			_isSearchBarVisible = true;

			// addSearchChange();
		}
		else {
			Ti.API.info(constant.APP + " ################# SEARCH BAR HIDE PROCEDURE ###################")
			switch(_currentKey) {
				case 'stylefeed':
					if(_isSearchBarVisible && _feedSearchText) {
						// alertDialog.show();
						_clearSearchField();
						return;
					}
					else if(!_isSearchBarVisible && _feedSearchText) {
						searchBar.setHidden(false);
						_isSearchBarVisible = true;
						return;
					}
				break;	
				case 'shop':
					if(_isSearchBarVisible && _shopSearchText) {
						// alertDialog.show();
						_clearSearchField();
						return;
					}
					if(!_isSearchBarVisible && _shopSearchText) {
						searchBar.setHidden(false);
						_isSearchBarVisible = true;
						return;
					}
				break;
				case 'social':
					if(_isSearchBarVisible && _socialSearchText) {
						// alertDialog.show();
						_clearSearchField();
						return;
					}
					else if(!_isSearchBarVisible && _socialSearchText) {
						searchBar.setHidden(false);
						_isSearchBarVisible = true;
						return;
					}
				break;
			}
			searchBar.setHidden(true);
			header.setSearchActive(false); //change the search icon
			_isSearchBarVisible = false;

			// remSearchChange();
		}
	}; //end _searchIconClickCallback
    
	var mainView = Ti.UI.createView(_style.mainView);
	
    var header = require('/components/header').get({
    	showMenu: true,
    	rightView: mainView,
    	enableButtons: false,
    	enableBackButton: false,
    	searchIconClickCallback: _searchIconClickCallback
    });
    
    var contentView = Ti.UI.createView(Utils._.extend({}, _commonStyle.contentView, {
        top: 0
    }));
    
    var searchStatusView = Ti.UI.createView({
    		backgroundColor: '#fff',
			top: UI.top(0),
		    width: Ti.UI.FILL,
		    height: UI.height(30),
		    // zIndex: 48,
		    opacity: 0.0,
		    borderColor: '#888888' 
    });

    var searchStatusLabel = Ti.UI.createLabel({
    	text: "",
    	font: {
    		fontSize: UI.fontSize(14),
    		fontFamily: constant.FONT.DEFAULT_FONT
    	}
    });

    searchStatusView.add(searchStatusLabel);

    contentView.add(searchStatusView);


    var searchBar = require('/components/searchBar').get();
	searchBar.setHintText('Search for Products, People, Updates...');
	header.getHeaderView().add(searchBar.getView());
    
	var footer = require('/components/footer').get(defaultSelectedTab=tabToLoad?tabToLoad:'stylefeed', subTab=false);
    
    mainView.add(header.getView());
    mainView.add(contentView);
    mainView.add(footer.getView());
    
    var btnSearch = header.getbtnSearch();
	// var searchTextArea = searchBar.getTextSearch();

    //	Enable header and icons and searchbar
    header.enableHeaderIcons(true);
	searchBar.setHidden(true);
    
    
	var currentView, includeView, tmpView, includeTimeout, _currentKey;
	
	searchBar.addEventListener('search', function(e) {
		try {
			currentView.searchData(e.text);
			_showSearchBar(e.text);
		}
		catch(e) {}
	});
	
	header.addEventListener('filter', function(e) {
		try {
			header.setFilterActive(Object.keys(e).length > 0);
			currentView.filterData(e);
		}
		catch(e) {}
	});
	
	/*
	 * Left view Option select listener
	 */
	var _onOptionSelect = function(e) {
		if(includeTimeout) {
			clearTimeout(includeTimeout);
			includeTimeout = undefined;
		}
		
		includeTimeout = setTimeout(function() {
			//	Close all windows if more than one are opened
			// Window.closeAll();
			
			Analytics.trackScreen({
				screenName: Utils.toEachWordUppercase(e.title)
			});
			
			if(e.key == 'logout') {
				//	Deregister user for push notification
        		HttpClient.deregisterForPushNotification(Utils.loggedInUserId());
        		
				Ti.App.Properties.removeProperty('userId');
				Ti.App.Properties.removeProperty('loginType');
				
				Ti.App.Properties.removeProperty('notificationCount');
				
				Ti.App.Properties.removeProperty('isAppOpenedForTheFirstTime');
				
				_postedByFilters = [], _sortByFilters = [], _brandsFilters = [], _categoriesFilters = [], _subCategoriesFilters = [], _sizesFilters = [], _conditionsFilters = [], _priceRangeFilters = [];
				_feedFilters = undefined, _shopFilters = undefined;
				_feedSearchText = undefined, _shopSearchText = undefined, _socialSearchText = undefined, _peopleSearchText = undefined, _notificationSearchText = undefined;
				
				Social.facebook('logout');
				
				_removeFromMemory();
				
				var currentWindow = Window.getCurrentWindow();
				
				var window = Window.create(exitOnClose=true, toBeOpened=osname=='android');
				var login = require('/screens/login').get();
		        window.add(login.getView());
		        Window.open(window);  
		        
		        /*
		         * Clear memory on login window open
		         */
		        window.addEventListener('open', function() {
		        	if(osname == 'android') {
		        		Window.clearMemory(currentWindow);
        				currentWindow = null;
		        	}
		        	else {
		        		currentWindow.close();
		        	}
		        });
			}
			else {
				if(_currentKey != e.key) {
					if(currentView) {
						contentView.remove(includeView);
						tmpView = currentView;
						includeView = null;
					}
					
					header.enableFilter(false);
					header.enableSearch(false);
					header.enableCompose(false);
					header.setTitle(Utils.toEachWordUppercase(e.title));
					
					footer.resetSelectedTab();
					
					switch(e.key) {
						case 'myOrders':
						case 'mySales':
							currentView = require('/screens/myOrders').get(e.key);
						break;
						
						// case 'faq':
						// case 'stylFlipGuides':
						// case 'shippingAndDeliveryPolicy':
						// case 'returnsAndCancellationsPolicy':
						// case 'aboutStylFlip':
						// case 'contactUs':
						case 'stylFlipPromise':
						// case 'termsOfService':
						// case 'termsAndConditions':
						// case 'privacyPolicy':
							currentView = require('/screens/termDetails').get(e.title, constant.DOMAIN + 'htmls/' + e.key + '.htm');
						break;
						
						case 'helpAndSupport':
							currentView = require('/screens/helpAndSupport').get([
								{title: 'FAQ\'s', url: 'faq.htm'},
								{title: 'StylFlip guides', url: 'stylFlipGuides.htm'},
								{title: 'Shipping and delivery policy', url: 'shippingAndDeliveryPolicy.htm'},
								{title: 'Return and cancellations policy', url: 'returnsAndCancellationsPolicy.htm'},
								{title: 'About StylFlip', url: 'aboutStylFlip.htm'},
								{title: 'Contact us', url: 'contactUs.htm'}
							]);
						break;
						
						case 'legalInformation':
							currentView = require('/screens/helpAndSupport').get([
								{title: 'Terms & conditions', url: 'termsAndConditions.htm'},
								{title: 'Privacy policy', url: 'privacyPolicy.htm'}
							]);
						break;
						
						default:
							currentView = require('/screens/'+e.key).get();
						break;			
					}
					
				    includeView = currentView.getView();
			    	contentView.add(includeView);
			    	
			    	if(tmpView) {
						tmpView.removeFromMemory();	
						tmpView = null;
					}
			    }
			}
			
			_currentKey = e.key;
	    	
			clearTimeout(includeTimeout);
			includeTimeout = undefined;
		}, 500);		
	}; //_onOptionSelect
	
	Ti.App.addEventListener('onOptionSelect', _onOptionSelect);
	
	// Ti.App.fireEvent('onOptionSelect', {title: 'SOCIAL', key: 'social'});
	
	var _showSearchBar = function(searchText, showSearchStatus){
		if(searchText){
			searchBar.setHidden(false);
			_isSearchBarVisible = true;
		}
		else{
			searchBar.setHidden(true);
			_isSearchBarVisible = false;
		}

		if(showSearchStatus){
			searchStatusView.opacity = 1.0;
			searchStatusLabel.text = 'Showing search results for "' + searchText + '"';
			if(includeView){
				includeView.top = UI.top(30);
			}
		}
		else{
			searchStatusView.opacity = 0.0;
			searchStatusLabel.text = "No search results";
			if(includeView){
				includeView.top = UI.top(0);
			}
		}
	};

	// Ti.App.fireEvent('app:apicallSuccess',{params});
	Ti.App.addEventListener('app:apicallSuccess',function(e){
		Ti.API.info(constant.APP + " ################### API SUCCESS CALLBACK ###################");
		var searchText = e.params && e.params.serverArgs && e.params.serverArgs.searchText ? e.params.serverArgs.searchText : "";
		if(searchText){
			Ti.API.info(constant.APP + " ################### SEARCH TEXT FOUND ###################");
			_showSearchBar(searchText,true);
		}
	});

	/*
	 * Tab select listener
	 */
	var _onFooterTabSelect = function(e, allowDuplicate) {
		console.log(constant.APP + " _onFooterTabSelect entered");
		if(_isSearchBarVisible) {
			searchBar.setHidden(true);
			_isSearchBarVisible = false;
		}
		header.resetTitle();
		searchBar.setText('');
		header.setCurrentFilterType(e.key);
		if(e.key == 'stylefeed') {
			Analytics.trackScreen({
				screenName: 'StylFeed'
			});
		}
		else if(e.key == 'stylefile') {
			Analytics.trackScreen({
				screenName: 'StylFile'
			});
		}
		else {
			Analytics.trackScreen({
				screenName: Utils.toFirstUppercase(e.key)
			});
		}

		UI.disableUpdateOnResume = true;

		switch(e.key) {
			case 'stylefeed':
				searchBar.setText(_feedSearchText != undefined ? _feedSearchText : '');
				header.setSearchActive(_feedSearchText); //change search icon
				header.setFilterActive(_feedFilters && Object.keys(_feedFilters).length > 0);
				header.enableFilter(true);
				header.enableSearch(true);
				header.enableCompose(true);
				
				_showSearchBar(_feedSearchText);

			break;
			case 'shop':
				searchBar.setText(_shopSearchText != undefined ? _shopSearchText : '');
				header.setSearchActive(_shopSearchText);
				header.setFilterActive(_shopFilters && Object.keys(_shopFilters).length > 0);
				header.enableFilter(true);
				header.enableSearch(true);
				header.enableCompose(false);

				_showSearchBar(_shopSearchText);
			break;
			case 'sell':
				header.enableFilter(false);
				header.enableSearch(false);
				header.enableCompose(false);

				_showSearchBar();
			break;
			case 'social':
				searchBar.setText(_socialSearchText != undefined ? _socialSearchText : '');
				header.setSearchActive(_socialSearchText);
				header.enableFilter(false);
				header.enableSearch(true);
				header.enableCompose(false);

				_showSearchBar(_socialSearchText);
			break;
			case 'stylefile': _showSearchBar();
			case 'stylefile_push':
			case 'shop_push':
			case 'stylefeed_push':
				header.enableFilter(false);
				header.enableSearch(false);
				header.enableCompose(false);
			break;
		}
		
		switch(e.key) {
			case 'stylefile_push':
				footer.setSelectedTab('stylefile');
			break;
			case 'shop_push':
				footer.setSelectedTab('shop');
			break;
			case 'stylefeed_push':
				footer.setSelectedTab('stylefeed');
			break;
			default:
				footer.setSelectedTab(e.key);
			break;
		}
		
		//	Close all windows if more than one are opened
		Window.closeAll(function() {
			if(_currentKey != e.key || allowDuplicate) {
				Cache.deleteData(); //uncomment this debug
				// console.log("no delete cache");

				if(currentView) {
					contentView.remove(includeView);
					tmpView = currentView;
					includeView = null;
				}
				_currentKey = e.key;
				
				switch(e.key) {
					case 'stylefile_push':
						currentView = require('/screens/'+('stylefile')).get('stylefile', Utils.getPushItemId());
					break;
					case 'shop_push':
						currentView = require('/screens/productDetails').get(tabSelected='shop', Utils.getPushItemId(), function(e) {
				        	if(e.type == 'purchase') {
								var alertDialog = UI.createAlertDialog({
					                title: constant.ALERT.TITLE.SUCCESS, 
					                message: 'Your order "' + e.orderNumber + '" has been placed. You will receive a confirmation email shortly.'
					            });
					            alertDialog.show();
					            alertDialog = null;
				        	}
				        });
					break;
					case 'stylefeed_push':
						currentView = require('/screens/feedDetails').get(tabSelected='stylefeed', Utils.getPushItemId());
					break;
					default:
						currentView = require('/screens/'+(e.key)).get(e.key == 'social' ? footer : undefined);
					break;
				}
				
			    includeView = currentView.getView();
		    	contentView.add(includeView);
		    	
		    	if(tmpView) {
					tmpView.removeFromMemory();	
					tmpView = null;
				}
			}
		});
	}; //end _onFooterTabSelect
	
	
	if(osname == 'android') {
		var _checkAndLoadNotificationView = function(e, loadDefaultTab) {
			setTimeout(function() {
				var _pendingData = Utils.getPendingData();
				
				if(_pendingData) {
					_notificationCountToBeDecreased = true;
					
					Utils.setPushItemId(_pendingData.itemId);
					switch(_pendingData.screen) {
						case 'stylFile':
							_onFooterTabSelect({key: 'stylefile_push'}, true);
						break;
						
						case 'shopDetails':
							_onFooterTabSelect({key: 'shop_push'}, true);
						break;
						
						case 'feedDetails':
							_onFooterTabSelect({key: 'stylefeed_push'}, true);
						break;
					}
				}
				else if(loadDefaultTab) {
					_onFooterTabSelect(e);
				}
			}, 100);
		};
	
		Ti.App.addEventListener('checkAndLoadNotificationView', _checkAndLoadNotificationView);
	}
	
	
	var _onFooterTabEventListener = function(e) {
		console.log(constant.APP + " _onFooterTabEventListener entered");
		if(osname == 'android') {
			if(!_isAppLoaded) {
				_checkAndLoadNotificationView(e, true);
				_isAppLoaded = true;
			}
			else {
				_onFooterTabSelect(e);
			}
		}
		else {
			if(!_isAppLoaded) {
				setTimeout(function() {
					if(Utils.getPushItemId() > 0) {
						return;
					}
					_onFooterTabSelect(e);
				}, 100);
				_isAppLoaded = true;
			}
			else {
				_onFooterTabSelect(e);
			}
		}
	}; //end _onFooterTabEventListener
	
	
	Ti.App.addEventListener('onFooterTabSelect', _onFooterTabEventListener);
		
	
	var _registerForPushNotification = function() {
		if(!Utils.isUserLoggedIn()) {
			return;
		}
		//	Register user for push notification
	    HttpClient.registerForPushNotification({
	    	onNotificationReceived: function(e) {
	    		if(osname == 'android') {
	    			if(e.inBackground) {
	    			}
	    			else {
	    				//	Increase notification count
	    				footer.increaseNotificationCount();
	    			}
	    		}
	    		else {
	    			if(e.inBackground) {
						Utils.setPushItemId(e.data.itemId);
						switch(e.data.screen) {
							case 'stylFile':
								_onFooterTabSelect({key: 'stylefile_push'}, true);
							break;
							
							case 'shopDetails':
								_onFooterTabSelect({key: 'shop_push'}, true);
							break;
							
							case 'feedDetails':
								_onFooterTabSelect({key: 'stylefeed_push'}, true);
							break;
						}
	    			}
	    			else {
	    				//	Increase notification count
	    				footer.increaseNotificationCount();
	    			}
	    		}
	    	}
	    });
	}; //end _registerForPushNotification
	
	_registerForPushNotification();
	
	Ti.App.addEventListener('registerForPushNotification', _registerForPushNotification);
	
	
	var _deRegisterForPushNotification = function() {
		HttpClient.deregisterForPushNotification(Utils.loggedInUserId());
	};
	
	Ti.App.addEventListener('deRegisterForPushNotification', _deRegisterForPushNotification);
	
	
	/*
	 *  Get unread notifications count from the server
	 */
	var _getUnreadNotificationCount = function() {
		if(!Utils.isUserLoggedIn()) {
			return;
		}
		
		var _requestArgs = {
	        showLoader: false,
	        url: 'social.php',
	        method: 'post',
	        serverArgs: {
	        	action: 'getUnreadNotificationsCount',
	        	userId: Utils.loggedInUserId()
	        }
	    };
	    
        /*
         * Hit web service
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
	            footer.setNotificationCount(_notificationCountToBeDecreased ? (parseInt(response.data.unreadCount) > 0 ? parseInt(response.data.unreadCount) - 1 : 0) : response.data.unreadCount);
        	},
        	error: function(error) {}
        });
	}; //end _getUnreadNotificationCount
	
	_getUnreadNotificationCount();
	
	var _getView = function() {
		return mainView;	
	};
	
	var _removeFromMemory = function() {
		Ti.App.removeEventListener('onOptionSelect', _onOptionSelect);
		_onOptionSelect = null;
		Ti.App.removeEventListener('onFooterTabSelect', _onFooterTabEventListener);
		_onFooterTabSelect = null;
		_onFooterTabEventListener = null;
		Ti.App.removeEventListener('registerForPushNotification', _registerForPushNotification);
		_registerForPushNotification = null;
		Ti.App.removeEventListener('checkAndLoadNotificationView', _checkAndLoadNotificationView);
		_checkAndLoadNotificationView = null;
		Ti.App.removeEventListener('deRegisterForPushNotification', _deRegisterForPushNotification);
		_deRegisterForPushNotification = null;
		Ti.App.removeEventListener('removeFromMemory', _removeFromMemory);
		_removeFromMemory = null;
	};
	
	Ti.App.addEventListener('removeFromMemory', _removeFromMemory);
	
	
	return {
		getView: _getView
	};
};

