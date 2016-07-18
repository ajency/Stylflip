exports.get = function(tabSelected, userId, username) {
	Analytics.trackScreen({
		screenName: 'User Follows'
	});
	
	var _style = require('/styles/social').get();
	
	var _pageIndex = 0;
	var _searchText;
	var _isFollowSearchVisible = false;
	
	var _searchIconClickCallback = function(e) {
		// _searchText = undefined;
		// searchBar.setText('');
		// if(e.show) {
			// searchBar.setHidden(false);
		// }
		// else {
			// searchBar.setHidden(true);
		// }
		
		var alertDialog = UI.createAlertDialog({
	    	title: constant.ALERT.TITLE.DONE_SEARCHING,
	    	message: 'Are you sure you want to clear your search?',
	    	buttonNames: ['YES', 'NO']
	    });
	    alertDialog.addEventListener('click', function(e) {
	    	if(e.index == 0) {
	    		searchBar.setHidden(true);
	    		header.setSearchActive(false);
	    		searchBar.setText('');
	    		_isFollowSearchVisible = false;
	    		_searchText = undefined;
	    		_loadData(true);
	    	}
	    	if(e.index == 1) {
	    		searchBar.setHidden(true);
	    		header.setSearchActive(false);
	    		_isFollowSearchVisible = false;
	    	}
	    });
	    
	    if(e.show) {
	    	searchBar.setHidden(false);
			_isFollowSearchVisible = true;
	    }
	    else {
	    	if(_searchText) {
				alertDialog.show();
				return;
			}
	    	searchBar.setHidden(true);
			header.setSearchActive(false);
			_isFollowSearchVisible = false;
	    }
	};
	
	var mainView = Ti.UI.createView({
	    width: Ti.UI.FILL,
	    height: Ti.UI.FILL,
	    layout: 'vertical'
	});
	
	var header = require('/components/header').get({
		showMenu: false,
    	enableButtons: false,
    	enableBackButton: true,
    	searchIconClickCallback: _searchIconClickCallback
	});
	header.enableSearch(true);
	
    var contentView = Ti.UI.createView(Utils._.extend({}, _commonStyle.contentScrollView, {
    	top: 0,
    	bottom: 0,
        layout: 'vertical'
    }));
    var footer = require('/components/footer').get(defaultSelectedTab=tabSelected, subTab=true);
    
    header.enableFilter(false);
    
    mainView.add(header.getView());
    mainView.add(contentView);
    mainView.add(footer.getView());	
    
    
    var searchBar = require('/components/searchBar').get();
	searchBar.setHintText('Search for Products, People, Updates...');
	searchBar.setHidden(true);
	header.getHeaderView().add(searchBar.getView());
	
	searchBar.addEventListener('search', function(e) {
		_searchText = e.text;
    	_loadData(true);
	});
	
	
	var _currentSelectedTab;
	
	
	/*
     * Follow button callback
     */
    function _onFollow(isFollowing, lblFollowersCount, btnFollowUnfollow) {
    	Analytics.trackEvent({
	  		category: isFollowing ? "Unfollow (Social)" : "Follow (Social)",
	  		action: "click",
	  		label: "-",
	  		value: 1
		});
		if(isFollowing) {
	    	lblFollowersCount.text = (parseInt(lblFollowersCount.text) + 1) + ' ' + (osname=='android'?' ':'');
	    }
	    else {
	    	lblFollowersCount.text = (parseInt(lblFollowersCount.text) - 1) + ' ' + (osname=='android'?' ':'');
	    }
	    btnFollowUnfollow.changeButtonStyle(isFollowing);
    };
    
    /*
     * Load user profile
     */
    var _loadUserProfile = function(userId, followCallback) {
        var window = Window.create();
        var userProfile = require('/screens/stylefile').get('social', userId, followCallback);
        window.add(userProfile.getView());
        Window.open(window);
    };
	

    /*
     * Create a person details row
     */
    function _createPeopleRow(userDetails) {
    	var  profileView = Ti.UI.createView(_style.profileView);
	
		var imgProfilePic = UI.createRoundedImageView(Utils._.extend({}, _style.imgProfilePic, {
			image: Utils.getProfileImageURL(userDetails.profilePicURL)
	    }));
	    userDetails.isFollowing = Utils.getBoolean(userDetails.isFollowing);
		var btnFollowUnfollow = UI.createFollowButton(Utils._.extend({}, (userDetails.isFollowing == 1 ? _commonStyle.unfollowButton : _commonStyle.followButton), {
			top: UI.top(5),
			right: UI.right(10),
			isFollowing: userDetails.isFollowing
	    }), userDetails.userId, function(e) {
		    _onFollow(e.following, lblFollowersCount, btnFollowUnfollow);
	    });
	    
	    var lblUsernameView = Ti.UI.createView(_style.lblUsernameView);
	    var lblUsername = Ti.UI.createLabel(Utils._.extend({}, _style.lblUsername, {
			text: Utils.ellipsis(userDetails.username, 25)
	    }));
	    lblUsernameView.add(lblUsername);
	    if(Utils.getBoolean(userDetails.isFeatured)) {
	    	var imgFeaturedUser = Ti.UI.createImageView(_style.imgFeaturedUser);
	    	lblUsernameView.add(imgFeaturedUser);
	    }
	    
	    var lblLocation = Ti.UI.createLabel(Utils._.extend({}, _style.lblLocation, {
			text: userDetails.city?userDetails.city:'-'
	    }));
	    
	    var listedView = Ti.UI.createView(_style.listedView);
	    var lblListed = Ti.UI.createLabel(Utils._.extend({}, _style.lblListed, {
			text: 'LISTED: '
	    }));
	    var lblListedCount = Ti.UI.createLabel(Utils._.extend({}, _style.lblListedCount, {
			text: userDetails.listed + ' ' + (osname=='android'?' ':'')
	    }));
	    var lblVSeparator = Ti.UI.createView(_style.lblVSeparator);
	    var lblSold = Ti.UI.createLabel(Utils._.extend({}, _style.lblListed, {
			text: '  SOLD: '
	    }));
	    var lblSoldCount = Ti.UI.createLabel(Utils._.extend({}, _style.lblListedCount, {
			text: userDetails.sold + (osname=='android'?' ':'')
	    }));
	    listedView.add(lblListed);
	    listedView.add(lblListedCount);
	    listedView.add(lblVSeparator);
	    listedView.add(lblSold);
	    listedView.add(lblSoldCount);
	    
	    var followView = Ti.UI.createView(Utils._.extend({}, _style.listedView, {
			top: UI.top(65)
	    }));
	    var lblFollowers = Ti.UI.createLabel(Utils._.extend({}, _style.lblListed, {
			text: 'FOLLOWERS: '
	    }));
	    var lblFollowersCount = Ti.UI.createLabel(Utils._.extend({}, _style.lblListedCount, {
			text: userDetails.followers + ' ' + (osname=='android'?' ':'')
	    }));
	    var lblVSeparator = Ti.UI.createView(_style.lblVSeparator);
	    var lblFollowing = Ti.UI.createLabel(Utils._.extend({}, _style.lblListed, {
			text: '  FOLLOWING: '
	    }));
	    var lblFollowingCount = Ti.UI.createLabel(Utils._.extend({}, _style.lblListedCount, {
			text: userDetails.following + (osname=='android'?' ':'')
	    }));
	    followView.add(lblFollowers);
	    followView.add(lblFollowersCount);
	    followView.add(lblVSeparator);
	    followView.add(lblFollowing);
	    followView.add(lblFollowingCount);
	    
	    profileView.add(imgProfilePic);
	    profileView.add(btnFollowUnfollow);
	    profileView.add(lblUsernameView);
	    profileView.add(lblLocation);
	    profileView.add(listedView);
	    profileView.add(followView);
	    
	    imgProfilePic.addEventListener('click', function() {
	    	_loadUserProfile(userDetails.userId, function(e) {
	    		_onFollow(e.following, lblFollowersCount, btnFollowUnfollow);
	    	});
	    });
	    
	    lblUsername.addEventListener('click', function() {
	    	_loadUserProfile(userDetails.userId, function(e) {
	    		_onFollow(e.following, lblFollowersCount, btnFollowUnfollow);
	    	});
	    });
	    
	    if(userDetails.products.length > 0) {
	    	var _arrViews = [];
	    	for(var i=0; i<userDetails.products.length; i++) {
	    		_arrViews.push(Ti.UI.createImageView({
	    			image: Utils.getFullURL(userDetails.products[i].productImage),
	    			width: UI.width(75),
	    			height: UI.height(75),
	    			backgroundColor: '#80a5ab',
	    			productId: userDetails.products[i].productId
	    		}));
	    	}
	    	var scrollingView = require('/components/scrollingImagesView').get(_arrViews, leftMargin=UI.left(10), function(e) {
	    		if(e.productId) {
	    			//	Goto details view
			        var window = Window.create(exitOnClose=false);
			        var productDetails = require('/screens/productDetails').get(tabSelected='social', e.productId, function(e) {
			        	if(e.type == 'purchase') {
			        		Window.closeAll(function() {
			        			if(e.success) {
			        				
			        			}
			        			else {
			        				var alertDialog = UI.createAlertDialog({
						                title: constant.ALERT.TITLE.WHOOPSIE, 
						                message: e.errorMessage
						            });
						            alertDialog.show();
					            	alertDialog = null;
			        			}
							});
			        	}
			        });
			        window.add(productDetails.getView());
			        Window.open(window); 
	    		}
	    	});
			scrollingView.setTop(UI.top(80));
			profileView.add(scrollingView.getView());
	    }
	    else {
	    	profileView.height = profileView.height - UI.height(75);
	    }
		
		return profileView;
    };

	
	/*
	 * Button bar click callback
	 */
	var _loadData = function(isRefresh) {
		if(isRefresh) {
			_pageIndex = 0;
			listView.setData([]);
		}
		
		var _requestArgs = {
	        showLoader: true,
	        url: 'social.php',
	        method: 'post',
	        serverArgs: {
	        	action: _currentSelectedTab == 'FOLLOWING' ? 'followings' : 'followers',
	        	userId: userId,
	        	loggedInUserId: Utils.loggedInUserId(),
	            pageIndex: _pageIndex
	        }
	    };
	    
	    if(_searchText != undefined) {
    		_requestArgs.serverArgs.searchText = _searchText;
	    }
	    
        /*
         * Hit web service
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
	            var _peopleData = response.data;
	            var _listData = [];
	            
	            if(_peopleData.length == 0 && _pageIndex == 0) {
	            	if(Utils.loggedInUserId() == userId) {
	            		listView.setData([UI.createNoDataView({
	            			text: _currentSelectedTab == 'FOLLOWING' ? 'You have no following yet' : 'You have none following them yet'
	            		})], false);
	            	}
	            	else {
	            		listView.setData([UI.createNoDataView({
	            			text: _currentSelectedTab == 'FOLLOWING' ? username + ' has none following them yet' : username + ' has no followers yet'
	            		})], false);
	            	}
            		return;
            	}
            	
            	Loader.show();
	            
	        	for(var i=0; i<_peopleData.length; i++) {
					_listData.push(_createPeopleRow(_peopleData[i]));
   					_listData.push(Ti.UI.createView(_commonStyle.hrLine));
				}
				
				if(isRefresh) {
					listView.setData(_listData);
				}
				else {
					listView.appendData(_listData);
				}
				
				if(_peopleData.length > 0) {
					_pageIndex++;
					listView.showLazyLoadingRow();
				}
				else {
					listView.hideLazyLoadingRow();
				}
        	},
        	error: function(error) {
                if(isRefresh) {
        			listView.setData([UI.createErrorView(error.errorMessage, function() {
	               		_loadData(true);
	               	})], true);
        		}
        		else {
        			UI.showAlert(error.errorMessage);
        		}
                setTimeout(function() {
                	if(_pageIndex > 0) {
	                	listView.showLazyLoadingRow();
	                }
                }, 500);
        	}
        });
	};
	
	var listView = require('/components/listView').get();
	
	listView.addEventListener('scrolledToBottom', function() {
		_loadData();
	});
	
	listView.addEventListener('pullToRefresh', function() {
		_loadData(true);
	});
	
	listView.addEventListener('load', function() {
		Loader.hide();
	});
	
	
	/*
	 * Button bar
	 */
	var buttonBar = require('/components/buttonBar').get({
		backgroundColor: '#f4f4f4',
		top: 0,
		width: UI.width(320),
		buttons: [{title: 'FOLLOWING', selected: true}, {title: 'FOLLOWERS'}],
		selectedButtonStyle: _style.selectedButton,
		unselectedButtonStyle: _style.unselectedButton,
	});
	
	buttonBar.addEventListener('click', function(e) {
		_currentSelectedTab = e.title;
		_loadData(true);
	});
	
	
   	// listView.setRowSpacing(1);
   	
   	contentView.add(buttonBar.getView());
	contentView.add(listView.getView());
	
    
    var _getView = function() {
        return mainView;
    };
    
    var _removeFromMemory = function() {
    	_style = null;
        Window.clearMemory(mainView);
        mainView = null;
        _getView = null;
        _searchText = null;
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        removeFromMemory: _removeFromMemory
    };
};
