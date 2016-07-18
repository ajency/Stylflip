exports.get = function(tabSelected, feedId, callback) {
	Analytics.trackScreen({
		screenName: 'Feed Details'
	});
	
	var _style = require('/styles/stylefeed').get();
	
	var mainView = Ti.UI.createView({
	    width: Ti.UI.FILL,
	    height: Ti.UI.FILL,
	    layout: 'vertical'
	});
	
	if(Utils.getPushItemId() == 0) {
		var header = require('/components/header').get({
			showMenu: false,
	    	enableButtons: false,
	    	enableBackButton: true
		});
	    header.enableFilter(false);
	    header.enableSearch(false);
	}
    
    var contentView = Ti.UI.createScrollView(Utils._.extend({}, _commonStyle.contentScrollView, {
    	top: 0,
    	bottom: 0,
        layout: 'vertical'
    }));
    var footer = require('/components/footer').get(defaultSelectedTab=tabSelected, subTab=true);
    
    if(Utils.getPushItemId() == 0) {
    	mainView.add(header.getView());
    }
    mainView.add(contentView);
    if(Utils.getPushItemId() == 0) {
    	mainView.add(footer.getView());
    }
    
    
	var listView = require('/components/listView').get();
	contentView.add(listView.getView());
    
	/*
	 * List view load listener
	 */
	listView.addEventListener('load', function(e) {
		Loader.hide();
	});
	
    
	/*
	 * Load other user's profile
	 */
	var _loadUserProfile = function(userId) {
		if(userId == Utils.loggedInUserId()) {
    		return;
    	}
        var window = Window.create(exitOnClose=false);
    	var userProfile = require('/screens/stylefile').get(tabSelected, userId);
	 	window.add(userProfile.getView());
        Window.open(window);
	};
	
	
	
		/*
	 * Load product details
	 */
	var _loadProductDetails = function(productId) {
        var window = Window.create(exitOnClose=false);
        var productDetails = require('/screens/productDetails').get(tabSelected='social', productId, function(e) {
        	if(e.type == 'purchase') {
        		Window.closeAll(function() {
        			if(e.success) {
        				// var alertDialog = UI.createAlertDialog({
			                // title: constant.ALERT.TITLE.SUCCESS, 
			                // message: 'Your order "' + e.orderNumber + '" has been placed. You will receive a confirmation email shortly.'
			            // });
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
	};


	/*
	 * Create a single feed row
	 */
	var _createFeedRow = function(feedData) {
		var feedRow = Ti.UI.createView(_style.feedRow);
		
		var profileView = Ti.UI.createView(_style.profileView);
		profileView.userId = feedData.userId;
		var imgProfilePic = UI.createRoundedImageView(Utils._.extend({}, _style.imgProfilePic, {
			image: Utils.getProfileImageURL(feedData.profilePicURL),
			userId: feedData.userId
	    }));
		var lblUsername = Ti.UI.createLabel(Utils._.extend({}, _style.lblUsername, {
			text: feedData.username == '' ? 'Anonymous' : feedData.username // 'Username'
	    }));
	    
		var lblTimeAndLocation = Ti.UI.createLabel(Utils._.extend({}, _style.lblTimeAndLocation, {
			text: (feedData.timestamp?feedData.timestamp:'-') + (feedData.userLocation ? ' | ' + (feedData.userLocation?feedData.userLocation:'-') : '')
	    }));
		
		// if(Utils.loggedInUserId() != feedData.userId) {
			var btnReportView = Ti.UI.createView(_style.btnHidePost);
			var btnReport = UI.createButton({
				backgroundImage: '/images/stylFeed/down-arrow.png',
				width: UI.width(13),
				height: UI.height(8)
		    });
		    btnReportView.add(btnReport);
		    
		    btnReportView.isFollowing = feedData.isFollowing=='1'||feedData.isFollowing==1||feedData.isFollowing==true;
		    
		    btnReportView.addEventListener('click', function(e) {
		    	if(!Utils.isUserLoggedIn()) {
		    		UI.showLoginAlert();
		    		return;
		    	}
		    	var _options, _menuHeight;
		    	if(Utils.loggedInUserId() == feedData.userId) {
		    		_options = ['Delete post'];
		    	}
		    	else {
		    		_options = [btnReportView.isFollowing ? 'Unfollow user' : 'Follow user', 'Report this post'];
		    	}
		    	var reportOptionsView = require('/components/popOver').get({
		    		// optionStyle: {
		    			// backgroundColor: '#fff',
		    			// borderColor: '#bfbfbf',
		    			// borderWidth: 1
		    		// },
		    		width: UI.width(130),
		    		height: UI.height(40 * _options.length),
		    		sourceView: this,
		    		options: _options,
		    		borderColor: '#bfbfbf',
		    		borderWidth: 1
		    		// handleOffScreen: true
		    	});
		    	reportOptionsView.show();
		    	reportOptionsView.addEventListener('click', function(e) {
		    		reportOptionsView.hide();
		    		switch(e.index) {
		    			case 0:
		    				if(e.option == 'Delete post') {
		    					var alertDialog = UI.createAlertDialog({
					        		title: 'Confirm?',
					        		message: 'Are you sure you want to delete post?',
					        		buttonNames: ['Ok', 'Cancel']
					        	});
					        	alertDialog.show();
					        	alertDialog.addEventListener('click', function(e) {
					        		if(e.index == 0) {
					        			var _requestArgs = {
									        showLoader: true,
									        url: 'stylfeed.php',
									        method: 'post',
									        serverArgs: {
									        	action: 'deletePost',
									            userId: Utils.loggedInUserId(),
									            feedId: feedData.feedId
									        }
									    };
									    
								        /*
								         * Hit web service
								         */
								        HttpClient.getResponse({
								        	requestArgs: _requestArgs,
								        	success: function(response) {
									            if(response.data.status == '1') {
										    		feedRow.hide();
										    		Window.clearMemory(feedRow);
									            }
								        	},
								        	error: function(error) {
								                var alertDialog = UI.createAlertDialog({
								                    title: error.errorTitle, 
								                    message: error.errorMessage
								                });
								                alertDialog.show();
								                alertDialog = null;
								        	}
								        });
					        		}
							        alertDialog = null;
						       });
		    				}
		    				else {
		    					Analytics.trackEvent({
							  		category: "Follow (StylFeed)",
							  		action: "click",
							  		label: ""+btnReportView.isFollowing+"",
							  		value: 1
								});

		    					var _requestArgs = {
							        showLoader: true,
							        url: 'social.php',
							        method: 'post',
							        serverArgs: {
							        	action: btnReportView.isFollowing ? 'unfollow' : 'follow',
							            userId: Utils.loggedInUserId(),
							            followedUserId: feedData.userId
							        }
							    };
							    
						        /*
						         * Hit web service
						         */
						        HttpClient.getResponse({
						        	requestArgs: _requestArgs,
						        	success: function(response) {
							            if(response.data.status == '1') {
									    	btnReportView.isFollowing = !btnReportView.isFollowing;
							            }
						        	},
						        	error: function(error) {
						                var alertDialog = UI.createAlertDialog({
						                    title: error.errorTitle,
						                    message: error.errorMessage
						                });
						                alertDialog.show();
						                alertDialog = null;
						        	}
						        });
		    				}
		    			break;
		    			case 1:
		    				var _options = ["This is not my Style", "This shouldn't be on Stylflip", "This is spam"];
			    			var alertDialog = UI.createAlertDialog({
						    	title: 'Hide This Post',
						    	options: _options,
						    	buttonNames: ['OK', 'CANCEL']
						    });
						    alertDialog.addEventListener('click', function(e) {
						    	if(e.index == 0 && e.selectedOption != undefined) {
						    		var _requestArgs = {
								        showLoader: true,
								        url: 'stylfeed.php',
								        method: 'post',
								        serverArgs: {
								        	action: 'hidePost',
								            userId: Utils.loggedInUserId(),
								            feedId: feedData.feedId,
								            reason: _options[e.selectedOption]
								        }
								    };
								    
							        /*
							         * Hit web service
							         */
							        HttpClient.getResponse({
							        	requestArgs: _requestArgs,
							        	success: function(response) {
								            if(response.data.status == '1') {
								            	var alertDialog = UI.createAlertDialog({
											    	title: constant.ALERT.TITLE.THANK_YOU,
											    	message: "Thanks for your feedback. Keep Flippin'"
											    });
											    alertDialog.show();
											    alertDialog = null;
									    		feedRow.hide();
									    		Window.clearMemory(feedRow);
								            }
							        	},
							        	error: function(error) {
							                var alertDialog = UI.createAlertDialog({
							                    title: error.errorTitle,
							                    message: error.errorMessage
							                });
							                alertDialog.show();
							                alertDialog = null;
							        	}
							        });
						    	}
						    });
						    alertDialog.show();
						    alertDialog = null;
		    			break;
		    		}
		    	});
		    });
	   	// }
	    
	    profileView.add(imgProfilePic);
	    profileView.add(lblUsername);
	    profileView.add(lblTimeAndLocation);
	    // if(Utils.loggedInUserId() != feedData.userId) {
	    	profileView.add(btnReportView);
	    // }
	    
	    profileView.addEventListener('click', function() {
	    	if(this.userId == Utils.loggedInUserId()) {
	    		return;
	    	}
	    	Analytics.trackEvent({
		  		category: "Username (StylFeed)",
		  		action: "click",
		  		label: "-",
		  		value: 1
			});
	    	_loadUserProfile(this.userId);
	    });
	    
	    
		var lblStatus = Ti.UI.createLabel(Utils._.extend({}, _style.lblStatus, {
			text: feedData.feedTitle // 'Status message goes here...'
	    }));
	    
	    if(feedData.photo != '') {
	    	var imgProductView = Ti.UI.createView(Utils._.extend({}, _style.imgProduct, {
		    	top: UI.top(5),
				width: UI.width(300),
				borderColor: '#b3b3b3',
				borderWidth: 0
		    }));
			var imgProduct = Ti.UI.createImageView(Utils._.extend({}, _style.imgProduct, {
				defaultImage: '/images/common/default-feed.jpg',
				image: Utils.getFullURL(feedData.photo),
				width: Ti.UI.FILL,
				height: Ti.UI.FILL
		    }));
		    imgProductView.add(imgProduct);
		    
		    if(feedData.productId > 0) {
		    	imgProductView.addEventListener('click', function() {
			    	_loadProductDetails(feedData.productId);
			    });
		    }
	    }
	    
	    feedData.isLiked = feedData.isLiked=='1'||feedData.isLiked==1||feedData.isLiked==true?true:false;
	    
	    var commentsView = Ti.UI.createView(_style.commentsView);
	    var btnLike = UI.createButton(Utils._.extend({}, _commonStyle.likeButton, {
	    	backgroundImage: feedData.isLiked?'/images/common/like-active.png':'/images/common/like.png',
	    	left: 0,
	    	top: 0,
	    	bubbleParent: false,
	    	feedId: feedData.feedId,
	    	isLiked: feedData.isLiked
	    }));
	    var lblLikesCount = Ti.UI.createLabel(Utils._.extend({}, _style.lblLikesCount, {
	    	left: UI.left(5),
			text: parseInt(feedData.likes) + (feedData.isLiked ? 1 : 0)
	    }));
	    
	    btnLike.likesCount = lblLikesCount;
	    
	    btnLike.addEventListener('click', function() {
	    	if(!Utils.isUserLoggedIn()) {
	    		UI.showLoginAlert();
	    		return;
	    	}
	    	
	    	var likeButton = this;
	    	
			Analytics.trackEvent({
		  		category: "Love (StylFeed)",
		  		action: "click",
		  		label: ""+likeButton.isLiked+"",
		  		value: 1
			});
	    	
			var _requestArgs = {
		        showLoader: true,
		        url: 'stylfeed.php',
		        method: 'post',
		        serverArgs: {
		        	action: likeButton.isLiked?'dislike':'like',
		            userId: Utils.loggedInUserId(),
		            feedId: likeButton.feedId
		        }
		    };
		    
	        /*
	         * Hit web service
	         */
	        HttpClient.getResponse({
	        	requestArgs: _requestArgs,
	        	success: function(response) {
		            if(response.data.status == '1') {
		            	if(likeButton.backgroundImage == '/images/common/like-active.png') {
		            		likeButton.likesCount.text = parseInt(likeButton.likesCount.text) - 1;
		            		likeButton.backgroundImage = '/images/common/like.png';
				    	}
				    	else {
				    		likeButton.likesCount.text = parseInt(likeButton.likesCount.text) + 1;
				    		likeButton.backgroundImage = '/images/common/like-active.png';
				    	}
				    	likeButton.isLiked = !likeButton.isLiked;
				    	Utils._.isFunction(callback) && callback({type: 'like', isLiked: likeButton.isLiked});
		            }
	        	},
	        	error: function(error) {
	                var alertDialog = UI.createAlertDialog({
	                    title: error.errorTitle,
	                    message: error.errorMessage
	                });
	                alertDialog.show();
	                alertDialog = null;
	        	}
	        });
	    });
	    
	    feedData.isCommented = feedData.isCommented=='1'||feedData.isCommented==1||feedData.isCommented==true?true:false;
	    feedData.isTagged = feedData.isTagged=='1'||feedData.isTagged==1||feedData.isTagged==true?true:false;
	    
	    var btnComment = UI.createButton(Utils._.extend({}, _commonStyle.commentButton, {
	    	backgroundImage: feedData.isCommented ? '/images/common/comment-active.png' : '/images/common/comment.png',
	    	left: UI.left(10),
	    	top: 0,
	    	bubbleParent: false,
	    	feedId: feedData.feedId
	    }));
	    var lblCommentCount = Ti.UI.createLabel(Utils._.extend({}, _style.lblLikesCount, {
	    	left: UI.left(5),
			text: parseInt(feedData.comments?feedData.comments:0)
	    }));
	    
	    btnComment.commentsCount = lblCommentCount;
	    
     	var btnTagView = Ti.UI.createView({
	    	left: UI.left(10),
	    	width: Ti.UI.FILL,
	    	height: UI.height(16.5)
	    });
	    var btnTag = UI.createButton(Utils._.extend({}, _commonStyle.tagButton, {
	    	backgroundImage: feedData.isTagged ? '/images/common/tag-active.png' : '/images/common/tag.png',
	    	right: 0,
	    	top: 0
	    }));
	    btnTagView.add(btnTag);
	    
	    btnTag.addEventListener('click', function() {
	    	if(!Utils.isUserLoggedIn()) {
	    		UI.showLoginAlert();
	    		return;
	    	}
	    	Analytics.trackEvent({
		  		category: "Tag (StylFeed)",
		  		action: "click",
		  		label: "-",
		  		value: 1
			});
	    	var window = Window.create(exitOnClose=false);
	    	var userProfile = require('/screens/tagFriends').get('stylefeed', feedData.feedId, feedData.userId);
		 	window.add(userProfile.getView());
	        Window.open(window);
	    });
	    
	    btnComment.addEventListener('click', function() {
	    	if(!Utils.isUserLoggedIn()) {
	    		UI.showLoginAlert();
	    		return;
	    	}
	    	
	    	var commentButton = this;
	    	
	    	Analytics.trackEvent({
		  		category: "Comment (StylFeed)",
		  		action: "click",
		  		label: "-",
		  		value: 1
			});
	    	
	    	var commmentsView = require('/screens/comments').get(this.feedId, type='feed', function(e) {
	    		if(e.type == 'add') {
	    			commentButton.backgroundImage = '/images/common/comment-active.png';
	    			commentButton.commentsCount.text = parseInt(commentButton.commentsCount.text) + 1;
	    			dialogBox.hide();
	    			Utils._.isFunction(callback) && callback({type: 'comment'});
	    		}
	    		if(e.type == 'delete') {
	    			commentButton.commentsCount.text = parseInt(commentButton.commentsCount.text) - 1;
	    		}
	    	});
	        var dialogBox = UI.createDialogBox({
	        	title: 'Comments',
	        	view: commmentsView.getView()
	        });
	        dialogBox.addEventListener('hide', function() {
	            dialogBox = null;
	            commmentsView.removeFromMemory();
	            commmentsView = null;
	        });
	        dialogBox.show();
	    });
	    
	    commentsView.add(btnLike);
	    commentsView.add(lblLikesCount);
	    commentsView.add(btnComment);
	    commentsView.add(lblCommentCount);
	    commentsView.add(btnTagView);
	    
	    feedRow.add(profileView);
	    feedRow.add(lblStatus);
	    if(feedData.photo != '') feedRow.add(imgProductView);
	    feedRow.add(commentsView);
	    
	    return feedRow;
	};

	
	var _loadFeedDetails = function() {
		var _requestArgs = {
	        showLoader: true,
	        url: 'stylfeed.php',
	        method: 'post',
	        serverArgs: {
	        	action: 'feedDetails',
	           	feedId: feedId,
	           	userId: Utils.loggedInUserId()
	        }
	    };
	    
	    /*
	     * Hit web service
	     */
	    HttpClient.getResponse({
	    	requestArgs: _requestArgs,
	    	success: function(response) {
    			var _feedData = response.data;
	            var _listData = [];
	            
	            Utils.resetPushItemId();
	            
            	if(_feedData.length == 0) {
            		_listData.push(UI.createNoDataView());
            		listView.setData(_listData, false, true);
            		return;
            	}
            	
            	Loader.show();
            	
	        	for(var i=0; i<_feedData.length; i++) {
					_listData.push(_createFeedRow(_feedData[i]));
				}
				
				listView.setData(_listData);
	    	},
	    	error: function(error) {
	            contentView.add(UI.createErrorView(error.errorMessage, function() {
               		_loadFeedDetails();
               	}));
	    	}
	    });    	
	};
	
	
	_loadFeedDetails();
    
    
    Window.getCurrentWindow().addEventListener('close', function() {
    	_removeFromMemory();
    });
    
    
    var _hideBackButton = function() {
    	header.hideBackButton();
    };
	
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
        hideBackButton: _hideBackButton,
        removeFromMemory: _removeFromMemory
    };
};

