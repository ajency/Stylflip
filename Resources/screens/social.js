exports.get = function(footerInstance) {
	var _style = require('/styles/social').get();
	
	var _pageIndex = 0;
	
	var mainView = Ti.UI.createView(_style.mainView); 
	
	var _currentView;
	
	var listView = require('/components/listView').get();
	
	listView.addEventListener('scrolledToBottom', function() {
		if(_currentView == 'NOTIFICATIONS') {
			_loadNotificationsView();
		}
		else if(_currentView == 'PEOPLE') {
			_loadPeopleView();
		}
	});
	
	listView.addEventListener('pullToRefresh', function() {
		if(_currentView == 'NOTIFICATIONS') {
			_loadNotificationsView(true);
		}
		else if(_currentView == 'PEOPLE') {
			_loadPeopleView(true);
		}
	});
	
	listView.addEventListener('load', function() {
		Loader.hide();
	});
	
	listView.addEventListener('click', function(e) {
		if(_currentView == 'NOTIFICATIONS') {
			try {
				Analytics.trackEvent({
			  		category: "Notifications (Social)",
			  		action: "click",
			  		label: e.row.data.type,
			  		value: 1
				});
				var window = Window.create();
				switch(e.row.data.type) {
		            case 'productTag':
		            	var screenToLoad = require('/screens/productDetails').get(tabSelected='social', e.row.data.productId);
		            break;
		                
		            case 'feedTag':
		            	var screenToLoad = require('/screens/feedDetails').get('social', e.row.data.feedId);
		            break;
		                
		            case 'productApproved':
		            	var screenToLoad = require('/screens/productDetails').get(tabSelected='social', e.row.data.productId);
		            break;
		                
		            case 'productRejected':
		            	var screenToLoad = require('/screens/productDetails').get(tabSelected='social', e.row.data.productId);
		            break;
		                
		            case 'follow':
		            	var screenToLoad = require('/screens/stylefile').get('social', e.row.data.taggingUserId);
		            break;
		                
		            case 'likeWardrobeItem':
		            	var screenToLoad = require('/screens/stylefile').get('social', e.row.data.taggingUserId);
		            break;
		                
		            case 'feedLike':
		            	var screenToLoad = require('/screens/feedDetails').get('social', e.row.data.feedId);
		            break;
		                
		            case 'productLike':
		            	var screenToLoad = require('/screens/productDetails').get('social', e.row.data.productId);
		            break;
		                
		            case 'feedComment':
	            		var screenToLoad = require('/screens/feedDetails').get('social', e.row.data.feedId);
		            break;
		                
		            case 'productComment':
		            	var screenToLoad = require('/screens/productDetails').get(tabSelected='social', e.row.data.productId);
		            break;
		                
		            case 'productPurchase':
		            	var screenToLoad = require('/screens/productDetails').get(tabSelected='social', e.row.data.productId);
		            break;
		        }
	        	window.add(screenToLoad.getView());
	        	Window.open(window);
			}
			catch(e) {}
       }
	});
	
	
	/*
	 * Button bar
	 */
	var buttonBar = require('/components/buttonBar').get({
		backgroundColor: '#f4f4f4',
		top: 0,
		width: UI.width(320),
		buttons: [{title: 'PEOPLE', selected: footerInstance.getNotificationCount() == 0}, {title: 'NOTIFICATIONS', selected: footerInstance.getNotificationCount() > 0}],
		// buttons: [{title: 'PEOPLE', selected: false}, {title: 'NOTIFICATIONS', selected: true}],
		selectedButtonStyle: _style.selectedButton,
		unselectedButtonStyle: _style.unselectedButton,
	});
	
	buttonBar.addEventListener('click', function(e) {
		_currentView = e.title;
		listView.setData([]);
		if(_currentView == 'NOTIFICATIONS') {
			_loadNotificationsView(true);
		}
		else if(_currentView == 'PEOPLE') {
			_loadPeopleView(true);
		}
	});
	
   	// listView.setRowSpacing(1);
   	
   	mainView.add(buttonBar.getView());
	mainView.add(listView.getView());
	
    
    function _loadNotificationsView(isRefresh) {
    	if(isRefresh) {
    		footerInstance.clearNotificationCount();
    		_pageIndex = 0;
    		listView.setData([]);
    	}
    	
		var _requestArgs = {
	        showLoader: true,
	        url: 'social.php',
	        method: 'post',
	        serverArgs: {
	        	action: 'showNotifications',
	        	userId: Utils.loggedInUserId(),
	            pageIndex: _pageIndex
	        }
	    };
	    
        /*
         * Hit web service
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
	            var _notifications = response.data;
	            var _listData = [];
	            
	            if(_notifications.length == 0 && _pageIndex == 0) {
            		listView.setData([UI.createNoDataView()], false);
            		return;
            	}
            	
            	Loader.show();
	            
		    	for(var i=0; i<_notifications.length; i++) {
		    		var notificationView = Ti.UI.createView({
		    			backgroundColor: '#fff',
		    			width: Ti.UI.FILL,
		    			height: Ti.UI.SIZE,
		    			data: _notifications[i]
		    		});
		    		
		    		// var imgProfilePic = Ti.UI.createImageView(Utils._.extend({}, _style.imgProfilePic, {
						// defaultImage: '/images/common/notification-icon.jpg',
						// image: Utils.getNotificationImageURL(_notifications[i].image),
						// left: UI.left(10),
						// top: UI.top(10),
						// width: UI.width(40),
						// height: UI.height(40),
						// borderRadius: UI.width(20)
				    // }));
				    
				    var imgProfilePic = UI.createRoundedImageView(Utils._.extend({}, _style.imgProfilePic, {
						defaultImage: '/images/common/notification-icon.jpg',
						image: Utils.getNotificationImageURL(_notifications[i].image),
						left: UI.left(10),
						top: UI.top(10),
						width: UI.width(40),
						height: UI.height(40),
						borderRadius: UI.width(20)
				    }));
				    
				    
				    
				    var activityRow = Ti.UI.createView(_style.activityRow);
				    var lblActivity = Ti.UI.createLabel(Utils._.extend({}, _style.lblActivity, {
						// text: 'Your friend @XYZ tagged you to check out mno\'s closet. She just sold 5 more items.'
				    	text: _notifications[i].message
				    }));
				    var lblTimestamp = Ti.UI.createLabel(Utils._.extend({}, _style.lblActivity, {
				    	top: UI.top(0),
						text: _notifications[i].timestamp,
						color: '#858585'
				    }));
					activityRow.add(lblActivity);	
					activityRow.add(lblTimestamp);	
				    
				    notificationView.add(imgProfilePic);
				    notificationView.add(activityRow);
				    
				    _listData.push(notificationView);
				    _listData.push(Ti.UI.createView(_commonStyle.hrLine));
		    	}
		    	
				if(isRefresh) {
					listView.setData(_listData);
					Ti.App.fireEvent('app:apicallSuccess',{params: _requestArgs});
				}
				else {
					listView.appendData(_listData);
				}
				
				if(_listData.length > 0) {
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
	               		_loadNotificationsView(true);
	               	})], false);
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
     * load 'PEAOPLE' tab data
     */
    function _loadPeopleView(isRefresh) {
    	if(isRefresh) {
    		_pageIndex = 0;
    		listView.setData([]);
    	}
    	
		var _requestArgs = {
	        showLoader: true,
	        url: 'social.php',
	        method: 'post',
	        serverArgs: {
	        	action: 'showPeople',
	        	userId: Utils.loggedInUserId(),
	            pageIndex: _pageIndex
	        }
	    };
	    
	    if(_socialSearchText != undefined) {
    		_requestArgs.serverArgs.searchText = _socialSearchText;
	    }
	    
        /*
         * Hit web service
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
	            var _peopleData = response.data;
	            var _listData = [];
	            
	            if((_peopleData.length == 0 && _pageIndex == 0) || (_peopleData.length == 1 && _pageIndex == 0 && Utils.loggedInUserId() == _peopleData[0].userId)) {
            		listView.setData([UI.createNoDataView()], false);
            		return;
            	}
            	
            	Loader.show();
            	
	            
	        	for(var i=0; i<_peopleData.length; i++) {
	        		if(Utils.loggedInUserId() != _peopleData[i].userId) {
	        			_listData.push(_createPeopleRow(_peopleData[i]));
   						_listData.push(Ti.UI.createView(_commonStyle.hrLine));
	        		}
				}
				
				if(isRefresh) {
					listView.setData(_listData);
					Ti.App.fireEvent('app:apicallSuccess',{params: _requestArgs});
				}
				else {
					listView.appendData(_listData);
				}
				
				if(_listData.length > 0) {
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
	               		_loadPeopleView(true);
	               	})], false);
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
    
    
    var _loadUserProfile = function(userId, followCallback) {
        var window = Window.create();
        var userProfile = require('/screens/stylefile').get('social', userId, followCallback);
        window.add(userProfile.getView());
        Window.open(window);
    };
    
    
    var _getView = function() {
        return mainView;
    };
    
    var _searchData = function(searchText) {
    	_socialSearchText = searchText;
    	/*if(_currentView == 'NOTIFICATIONS') {
			_loadNotificationsView(true);
		}
		else*/ if(_currentView == 'PEOPLE') {
			_loadPeopleView(true);
		}
    };
    
    var _removeFromMemory = function() {
    	_style = null;
        Window.clearMemory(mainView);
        mainView = null;
        _getView = null;
        _searchData = null;
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        searchData: _searchData,
        removeFromMemory: _removeFromMemory
    };
};

