exports.get = function(tabSelected, feedOrProductId, feedOrProductUserId) {
	Analytics.trackScreen({
		screenName: 'Tag Friends'
	});
	
	var _style = require('/styles/social').get();

	var _pageIndex = 0;
	
	var mainView = Ti.UI.createView({
	    width: Ti.UI.FILL,
	    height: Ti.UI.FILL,
	    layout: 'vertical'
	});
	
	var header = require('/components/header').get({
		showMenu: false,
    	enableButtons: false,
    	enableBackButton: true
	});
	var contentView = Ti.UI.createView(Utils._.extend({}, _commonStyle.contentScrollView, {
    	top: 0,
    	bottom: 0,
        layout: 'vertical'
    }));
    var footer = require('/components/footer').get(defaultSelectedTab=tabSelected, subTab=true);
    
    header.enableFilter(false);
    header.setTitle('Tag Friends');
    
    mainView.add(header.getView());
    mainView.add(contentView);
    mainView.add(footer.getView());	
	
	
	var _currentSelectedTab;

    /*
     * Create a person details row
     */
    function _createPeopleRow(userDetails) {
    	var profileView = Ti.UI.createView(Utils._.extend({}, _style.profileView, {
			height: UI.height(50)
	    }));
	
		var imgProfilePic = Ti.UI.createImageView(Utils._.extend({}, _style.imgProfilePic, {
			image: Utils.getProfileImageURL(userDetails.profilePicURL)
	    }));
	    
	    userDetails.isTagged = userDetails.isTagged == 1 ? true : false;
	    
	    if(userDetails.userId != Utils.loggedInUserId()) {
	    	var btnTag = UI.createButton(Utils._.extend({}, _commonStyle.tagButton, {
	    		backgroundImage: userDetails.isTagged ? '/images/common/tag-active.png' : '/images/common/tag.png',
				right: UI.right(10),
				isTagged: userDetails.isTagged
		    }));
	    }
		
	    var lblUsernameView = Ti.UI.createView(_style.lblUsernameView);
	    var lblUsername = Ti.UI.createLabel(Utils._.extend({}, _style.lblUsername, {
			text: Utils.ellipsis(userDetails.username, 35)
	    }));
	    lblUsernameView.add(lblUsername);
	    if(Utils.getBoolean(userDetails.isFeatured)) {
	    	var imgFeaturedUser = Ti.UI.createImageView(_style.imgFeaturedUser);
	    	lblUsernameView.add(imgFeaturedUser);
	    }
	    
	    var lblLocation = Ti.UI.createLabel(Utils._.extend({}, _style.lblLocation, {
			text: userDetails.city?userDetails.city:'-'
	    }));
	    
	    profileView.add(imgProfilePic);
	    if(userDetails.userId != Utils.loggedInUserId()) {
	    	profileView.add(btnTag);
	    }
	    profileView.add(lblUsernameView);
	    profileView.add(lblLocation);
	    
	    btnTag.addEventListener('click', function() {
	    	if(this.isTagged) {
	    		return;
	    	}
	    	var _requestArgs = {
		        showLoader: true,
		        url: tabSelected == 'stylefeed' ? 'stylfeed.php' : 'product.php',
		        method: 'post',
		        serverArgs: {
		        	action: this.isTagged ? 'untagUser' : 'tagUser',
		        	userId: Utils.loggedInUserId(),
		        	taggedUserId: userDetails.userId
		        }
		    };
		    
		    if(tabSelected == 'stylefeed') {
		    	_requestArgs.serverArgs.feedId = feedOrProductId;
		    }
		    else {
		    	_requestArgs.serverArgs.productId = feedOrProductId;
		    }
		    
	        /*
	         * Hit web service
	         */
	        HttpClient.getResponse({
	        	requestArgs: _requestArgs,
	        	success: function(response) {
		            btnTag.isTagged = !btnTag.isTagged;
		            if(btnTag.isTagged) {
		            	btnTag.backgroundImage = '/images/common/tag-active.png';
		            }
		            else {
		            	btnTag.backgroundImage = '/images/common/tag.png';
		            }
	        	},
	        	error: function(error) {
	                UI.showAlert(error.errorMessage);
	        	}
	        });
	    });
	    
		return profileView;
    };

	
	/*
	 * Button bar click callback
	 */
	var _buttonBarClickCallback = function(isRefresh) {
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
	        	loggedInUserId: Utils.loggedInUserId(),
	        	userId: Utils.loggedInUserId(),
	            pageIndex: _pageIndex
	        }
	    };
	    
	    if(tabSelected == 'stylefeed') {
	    	_requestArgs.serverArgs.feedId = feedOrProductId;
	    }
	    else {
	    	_requestArgs.serverArgs.productId = feedOrProductId;
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
            		listView.setData([UI.createNoDataView()], false);
            		return;
            	}
            	
            	Loader.show();
	            
	        	for(var i=0; i<_peopleData.length; i++) {
	        		if(feedOrProductUserId != _peopleData[i].userId) {
	        			_listData.push(_createPeopleRow(_peopleData[i]));
	   					_listData.push(Ti.UI.createView(Utils._.extend({}, _commonStyle.hrLine, {
							top: 0
					    })));
	        		}
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
	               		_buttonBarClickCallback(true);
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
		_buttonBarClickCallback();
	});
	
	listView.addEventListener('pullToRefresh', function() {
		_buttonBarClickCallback(true);
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
		_buttonBarClickCallback(true);
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
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        removeFromMemory: _removeFromMemory
    };
};
