exports.get = function(header) {
	var _style = require('/styles/stylefeed').get();
	
	var _pageIndex = 0;
	
	var mainView = Ti.UI.createView(_style.mainView); 
	
	// var feedView = Ti.UI.createView(_style.feedView); 
	
	// var listView = require('/components/listView').get();
	
	// listView.addEventListener('scrolledToBottom', function() {
	// 	_loadData();
	// });
	
	// listView.addEventListener('pullToRefresh', function() {
	// 	_loadData(true);
	// });
	
	// listView.setRowSpacing(1);

    // var feedWebView = UI.createWebView('https://www.google.co.in/?gws_rd=ssl');
    var feedWebView = UI.createWebView('/screens/stylefeed/stylefeed.html');
   
    var scrollView = Ti.UI.createScrollView({
    	top: 0,
    	width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		contentWidth: Ti.UI.FILL,
		contentHeight: 'auto',
		showVerticalScrollIndicator: true,
		layout: 'vertical'
    })

    scrollView.add(feedWebView);

    // var refreshControl = require('com.rkam.swiperefreshlayout').createSwipeRefresh({
	   //  	view: scrollView
	   //  });
    // refreshControl.addEventListener('refreshing', function() {
    // 	Ti.API.info(constant.APP + " refreshing sylefeed");
    // 	refreshControl.setRefreshing(true);
    //     refreshControl.setRefreshing(false);
    //     if(Utils._.isFunction(_pullToRefreshCallback)) {
    //     	_pullToRefreshCallback();
    //     }
    // });
	
	mainView.add(scrollView);
	// mainView.add(refreshControl);

	// mainView.add(feedView);	
	// feedView.add(listView.getView());
	
	
	var feedText, imageToUpload;
	
	
	/*
	 * Create new feed view
	 */
	var createNewFeedView = function() {
		var newFeedView = Ti.UI.createView(_style.newFeedView);
		newFeedView.avoidClearMemory = true;
		newFeedView.isAdded = false;
	    var btnComposeView = Ti.UI.createView(Utils._.extend({}, _style.btnCreateNewFeedView, {
	    	left: UI.left(10)
	    }));
	    var btnCompose = UI.createButton(Utils._.extend({}, _style.btnCreateNewFeed, {
	    	backgroundImage: '/images/stylFeed/feedpost-white.png'
	    }));
	    btnComposeView.add(btnCompose);
	    // var btnCameraView = Ti.UI.createView(Utils._.extend({}, _style.btnCreateNewFeedView, {
// 	
	    // }));
	    // var btnCamera = UI.createButton(Utils._.extend({}, _style.btnCreateNewFeed, {
	    	// backgroundImage: '/images/stylFeed/feedpost-click.png'
	    // }));
	    // btnCameraView.add(btnCamera);
	    var lblNewFeedHint = Ti.UI.createLabel(_style.lblNewFeedHint);
	    var btnGalleryView = Ti.UI.createView(Utils._.extend({}, _style.btnCreateNewFeedView, {
	    	right: UI.right(10)
	    }));
	    var btnGallery = UI.createButton(Utils._.extend({}, _style.btnCreateNewFeed, {
	    	backgroundImage: '/images/stylFeed/feedpost-gallery.png'
	    }));
	    btnGalleryView.add(btnGallery);
	    
	    newFeedView.add(btnComposeView);
	    newFeedView.add(lblNewFeedHint);
	    // newFeedView.add(btnCameraView);
	    newFeedView.add(btnGalleryView);
	    
	    newFeedView.addEventListener('click', function() {
	    	if(!Utils.isUserLoggedIn()) {
				UI.showLoginAlert();
				return;
			}
			showPostNewFeedPopUp();
	    });
	    
	    // btnComposeView.addEventListener('click', function() {
			// if(!Utils.isUserLoggedIn()) {
				// UI.showLoginAlert();
				// return;
			// }
			// showPostNewFeedPopUp();
		// });
		
		// btnCameraView.addEventListener('click', function() {
			// if(!Utils.isUserLoggedIn()) {
				// UI.showLoginAlert();
				// return;
			// }
			// ImageEditor.takePhoto(function(e) {
	        	// if(e.success) {
	        		// imageToUpload = e.image;
	        		// showPostNewFeedPopUp();
	        	// }
	        // });
		// });
		
		// btnGalleryView.addEventListener('click', function() {
			// if(!Utils.isUserLoggedIn()) {
				// UI.showLoginAlert();
				// return;
			// }
			// ImageEditor.browsePhotoGallery(function(e) {
	        	// if(e.success) {
	        		// imageToUpload = e.image;
	        		// showPostNewFeedPopUp();
	        	// }
	        // });
		// });
	    
	    return newFeedView;
	};
	
	
	/*
	 * Open post new feed pop up
	 */
	var showPostNewFeedPopUp = function() {
		var newFeedPopUpView = Ti.UI.createView({
			width: UI.width(300),
			height: constant.CONTENT_HEIGHT,
			layout: 'vertical'
		});
		var txtNewFeed = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
			top: UI.top(10),
	        width: UI.width(300),
	        height: UI.height(100),
	        borderColor: '#ebebeb',
            borderWidth: 0,
            maxLength: 140,
            textAlign: 'left',
            value: feedText != undefined ? feedText : '',
            hintText: 'Styl on your mind? Post your update now',
            type: 'textArea'
	    }));
	    
	    var imgFeedView = Ti.UI.createView({
	    	backgroundColor: '#80a5ab',
	    	top: UI.top(10),
	    	width: UI.width(130),
	    	height: UI.height(130),
	    	borderWidth: 1,
	    	borderColor: '#f4f4f4'
	    });
	    var btnDeleteFeedImage = UI.createButton({
	    	backgroundImage: '/images/close.png',
	    	top: 0,
	    	right: 0,
	    	width: UI.width(20),
	    	height: UI.height(20),
	    	visible: imageToUpload ? true : false,
	    	zIndex: 5,
	    	bubbleParent: false
	    });
	    var imgFeed = Ti.UI.createImageView({
	    	image: imageToUpload ? imageToUpload : '/images/sell/camera-click.png',
			width: imageToUpload ? Ti.UI.FILL : UI.width(60),
			height: imageToUpload ? Ti.UI.FILL : UI.height(25)
	    });
	    imgFeedView.add(imgFeed);
	    imgFeedView.add(btnDeleteFeedImage);
		
		var btnPostFeedView = Ti.UI.createView({
			top: UI.top(50),
			width: Ti.UI.FILL,
			height: UI.height(50)
		});
	    var btnPostFeed = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
	        title: 'POST'
	    }));
	    btnPostFeedView.add(btnPostFeed);
	    
	    newFeedPopUpView.add(txtNewFeed);
	    newFeedPopUpView.add(Ti.UI.createView(Utils._.extend({}, _commonStyle.hrLine, {
	    	top: UI.top(10),
	        left: 0,
	        right: 0
	    })));
    	newFeedPopUpView.add(imgFeedView);
	    newFeedPopUpView.add(btnPostFeedView);
	    
	    var dialogBox = UI.createDialogBox({
        	title: 'Create Post',
        	view: newFeedPopUpView
        });
        dialogBox.addEventListener('hide', function() {
        	txtNewFeed.blur();
            dialogBox = null;
            imageToUpload = null;
            Window.clearMemory(newFeedPopUpView);
        });
        dialogBox.show();
        
        imgFeedView.addEventListener('click', function() {
        	txtNewFeed.blur();
        	
        	var buttonBarView = UI.createButtonBarView({
	    		buttonNames: ['TAKE PHOTO', 'CHOOSE FROM GALLERY']
	    	});
	    	buttonBarView.show();
	    	buttonBarView.addEventListener('click', function(e) {
	    		if(e.index == 0) {
			        ImageEditor.takePhoto(function(e) {
				    	if(e.success) {
				    		imageToUpload = e.image;
				    		imgFeed.image = e.image;
				    		imgFeed.width = Ti.UI.FILL;
							imgFeed.height = Ti.UI.FILL;
							btnDeleteFeedImage.visible = true;
				    	}
				    	else {
							var alertDialog = UI.createAlertDialog({
				                title: constant.ALERT.TITLE.FAUX_PAS, 
				                message: e.errorMessage
				            });
				            alertDialog.show();
				            alertDialog = null;
						}
				    });
			   	}
	    		if(e.index == 1) {
			        ImageEditor.browsePhotoGallery(function(e) {
						if(e.success) {
							imageToUpload = e.image;
							imgFeed.image = e.image;
							imgFeed.width = Ti.UI.FILL;
							imgFeed.height = Ti.UI.FILL;
							btnDeleteFeedImage.visible = true;
						}
						else {
							var alertDialog = UI.createAlertDialog({
				                title: constant.ALERT.TITLE.FAUX_PAS, 
				                message: e.errorMessage
				            });
				            alertDialog.show();
				            alertDialog = null;
						}
				    });
	    		}
	    	});
        });
        
        btnDeleteFeedImage.addEventListener('click', function() {
        	txtNewFeed.blur();
        	
        	var alertDialog = UI.createAlertDialog({
        		title: 'Confirm?',
        		message: 'Are you sure you want to delete photo?',
        		buttonNames: ['Ok', 'Cancel']
        	});
        	alertDialog.show();
        	alertDialog.addEventListener('click', function(e) {
        		if(e.index == 0) {
        			imageToUpload = null;
					imgFeed.image = '/images/sell/camera-click.png';
					imgFeed.width = UI.width(60);
					imgFeed.height = UI.height(25);
					btnDeleteFeedImage.visible = false;
        		}
        		alertDialog = null;
        	});
        });
        
        txtNewFeed.addEventListener('change', function() {
        	feedText = this.value;
        });
        
    	/*
		 * 'Feed Post' button click handler
		 */
		btnPostFeed.addEventListener('click', function() {
			if(txtNewFeed.value.trim().length == 0 || txtNewFeed.value == txtNewFeed.hintText) {
				txtNewFeed.blur();
				var alertDialog = UI.createAlertDialog({
                    title: constant.ALERT.TITLE.FAUX_PAS, 
                    message: 'Please enter feed title'
                });
                alertDialog.show();
                alertDialog.addEventListener('hide', function() {
                	txtNewFeed.focus();
                	alertDialog = null;
                });
				return;
			}
			
			txtNewFeed.blur();
			
			var _requestArgs = {
		        showLoader: true,
		        url: 'stylfeed.php',
		        method: 'post',
		        serverArgs: {
		        	action: 'create',
		        	feedTitle: txtNewFeed.value.trim(),
		            location: {
		            	lat: 10.10,
		            	lon: 10.10
		            },
		            city: 'Nasik',
		           	userId: Utils.loggedInUserId()
		        }
		    };
		    
		    if(imageToUpload) {
		    	_requestArgs.serverArgs.photo = imageToUpload;
		    }
			
	        /*
	         * Hit web service
	         */
	        Ti.API.info("getting data location 1");
	        HttpClient.getResponse({
	        	requestArgs: _requestArgs,
	        	success: function(response) {
		            txtNewFeed.value = '';
        
		            _requestArgs.serverArgs.photo = null;
		            imageToUpload = null;
		            feedText = null;
		            
		            // var newFeedData = response.data;
		            // newFeedData.timestamp = 'Just now';
		            // listView.prependRow(Ti.UI.createView(_commonStyle.hrLine));
		            // listView.prependRow(_createFeedRow(newFeedData));
		            
		            dialogBox.hide();
					dialogBox.addEventListener('hide', function() {
						_loadData(true);
					});
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
	};
	
	
	/*
	 * Load other user's profile
	 */
	var _loadUserProfile = function(userId) {
        var window = Window.create(exitOnClose=false);
    	var userProfile = require('/screens/stylefile').get('stylefeed', userId);
	 	window.add(userProfile.getView());
        Window.open(window);
	};
	
	
	/*
	 * Load product details
	 */
	var _loadProductDetails = function(productId) {
		console.log(constant.APP + " ############### stylefeed _loadProductDetails init #################");
        var window = Window.create(exitOnClose=false);
        var productDetails = require('/screens/productDetails').get(tabSelected='stylefeed', productId, function(e) {
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
	 * List view load listener
	 */
	// listView.addEventListener('load', function(e) {
	// 	Loader.hide();
	// });
	
	var _profileViewClickHandler = function(e) {
    	var userId = '';
    	if(e){
    		userId = e.userId;
    	}
    	else{
    		userId = this.userId;
    	}
    	if(userId == Utils.loggedInUserId()) {
    		return;
    	}
    	Analytics.trackEvent({
	  		category: "Username (StylFeed)",
	  		action: "click",
	  		label: "-",
	  		value: 1
		});
    	_loadUserProfile(userId);
    };
	
	/*
	 * Create a single feed row
	 */
	var _createFeedRow = function(feedData, separator) {
		// Titanium.API.info(constant.APP + " creating feed row...");

		// for(var ix in feedData){
		// 	if(feedData.propertyIsEnumerable(ix)){
		// 		Ti.API.info(constant.APP + " key: [" + ix + "] value: [" + feedData[ix] + "]");
		// 	}
		// }

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
		    	console.log(constant.APP + " btnReportView clicked");
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
		    		console.log(constant.APP + " reportOptionsView clicked");
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
								        Ti.API.info("getting data location 2");
								        HttpClient.getResponse({
								        	requestArgs: _requestArgs,
								        	success: function(response) {
									            if(response.data.status == '1') {
										    		feedRow.hide();
										    		Window.clearMemory(feedRow);
										    		separator.getParent().remove(separator);
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
						        Ti.API.info("getting data location 3");
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
							        Ti.API.info("getting data location 4");
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
									    		separator.getParent().remove(separator);
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
	   
	    profileView.addEventListener('click',_profileViewClickHandler);
	    
	    var lblStatusColor = '#3333cc';
		var lblStatus = Ti.UI.createLabel(Utils._.extend({}, _style.lblStatus, {
			text: feedData.feedTitle // 'Status message goes here...'
	    }));
	    
		var _lblStatusCb = function(){
			Ti.API.info(constant.APP + " ######################## FEED TITLE LABEL CLICKED #######################");
			var text = lblStatus.text;
			var matches = text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
			
			var matchFound = matches && matches.length;

			if(matchFound){
				// Ti.API.info(constant.APP + " ###################### FOUND HTTP MATCH ######################");
				lblStatus.color = lblStatusColor;
				Ti.Platform.openURL(matches[0]);
			}
			else{
				// Ti.API.info(constant.APP + " ###################### NO HTTP MATCH ######################");
				matches = text.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
				matchFound = matches && matches.length;

				if(matchFound){
					// Ti.API.info(constant.APP + " ###################### FOUND NON HTTP MATCH ######################");
					matches[0] = 'http://' + matches[0];
					lblStatus.color = lblStatusColor;
					Ti.Platform.openURL(matches[0]);
				}
				// else{
				// 	Ti.API.info(constant.APP + " ###################### NO MATCH FOUND ######################");
				// }
			}

			// Ti.Platform.openURL("https://www.mozilla.org/en-US/firefox/new/?gclid=CIuwjui3684CFdUSaAod078OgQ");
		};

		lblStatus.addEventListener('click',_lblStatusCb);

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
		    /*
		     * Feed details screen
		     */
	    	// imgProductView.addEventListener('click', function() {
		    	// var window = Window.create(exitOnClose=false);
		        // var feedDetails = require('/screens/feedDetails').get(tabSelected='stylefeed', feedData.feedId, function(e) {
		        	// if(e.type == 'like') {
		        		// if(e.isLiked) {
				    		// btnLike.backgroundImage = '/images/common/like-active.png';
				    		// btnLike.isLiked = true;
				    		// lblLikesCount.text = parseInt(lblLikesCount.text) + 1;
			        	// }
			        	// else {
			        		// btnLike.backgroundImage = '/images/common/like.png';
			        		// btnLike.isLiked = false;
			        		// lblLikesCount.text = parseInt(lblLikesCount.text) - 1;
			        	// }
		        	// }
		        	// if(e.type == 'comment') {
		        		// btnComment.backgroundImage = '/images/common/comment-active.png';
		        		// lblCommentCount.text = parseInt(lblCommentCount.text) + 1;
		        	// }
		        // });
		        // window.add(feedDetails.getView());
		        // Window.open(window); 
		    // });
	    }
	    // Ti.API.info(constant.APP + " ########### feedData.isLiked: " + feedData.isLiked + " feedData.likes: " + feedData.likes);
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
	        Ti.API.info(constant.APP + " getting data location 5");
	        HttpClient.getResponse({
	        	requestArgs: _requestArgs,
	        	success: function(response) {
	        		Ti.API.info(constant.APP + " response data status: " + response.data.status);
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
	    var btnTagContainer = Ti.UI.createView({
	    	right: 0,
	    	top: 0,
	    	width: UI.width(30),
	    	height: Ti.UI.FILL
	    });
	    var btnTag = UI.createButton(Utils._.extend({}, _commonStyle.tagButton, {
	    	backgroundImage: feedData.isTagged ? '/images/common/tag-active.png' : '/images/common/tag.png',
	    	top: 0,
	    	right: 0
	    }));
	    btnTagContainer.add(btnTag);
	    btnTagView.add(btnTagContainer);
	    
	    btnTagContainer.addEventListener('click', function() {
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
	}; //end _createFeedRow


	var _setPhotoUrl = function(data){
		// profilePicURL
		for(var x = 0; x < data.length; x++){
			if(data[x].photo){
				data[x].photo = Utils.getFullURL(data[x].photo);
			}
			if(data[x].profilePicURL){
				data[x].profilePicURL = Utils.getProfileImageURL(data[x].profilePicURL);
			}
		}
		
		Ti.App.fireEvent('webViewStyleFeed:stylefeedDataLoad',{respArgs: data});
	};

	var _loadData = function(isRefresh) {
		if(isRefresh) {
			_pageIndex = 0;
			// listView.setData([]);
		}
		
	    var _requestArgs = {
	        showLoader: true,
	        url: 'stylfeed.php',
	        method: 'post',
	        serverArgs: {
	        	action: 'listing',
	            location: {
	            	lat: 10.10,
	            	lon: 10.10
	            },
	            pageIndex: _pageIndex
	        }
	    };
	    
	    if(_feedFilters != undefined) {
	    	for(var _key in _feedFilters) {
	    		_requestArgs.serverArgs[_key] = _feedFilters[_key];
	    	}
	    }
	    
	    if(_feedSearchText != undefined) {
    		_requestArgs.serverArgs.searchText = _feedSearchText;
	    }
	    
	    if(Utils.isUserLoggedIn()) {
	    	_requestArgs.serverArgs.userId = Utils.loggedInUserId();
	    }
	    
        /*
         * Hit web service
         */
        Ti.API.info(constant.APP + " #################### getting data location 6 ###################");
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
	            var _feedData = response.data;
	            var _listData = [];
	            
	            Ti.API.info(constant.APP + " _feedData length: " + _feedData.length);
	            if(isRefresh) {
            		// _listData.push(createNewFeedView());
            	}
            	
            	if(_feedData.length == 0 && _pageIndex == 0) {
            		_listData.push(UI.createNoDataView());
            		// listView.setData([UI.createNoDataView()], false);
            		// listView.setData(_listData, false, true);
            		Ti.App.fireEvent('app:apicallSuccess',{params: _requestArgs});
            		return;
            	}
            	
            	Loader.show();
            	
            	// if(isRefresh) {
            		// _listData.push(createNewFeedView());
            	// }
            
	   //      	for(var i=0; i<_feedData.length; i++) {
	   //      		var separator = Ti.UI.createView(_commonStyle.hrLine);
				// 	_listData.push(_createFeedRow(_feedData[i], separator));
				// 	_listData.push(separator);
				// }
				
				if(isRefresh) {
					// listView.setData(_listData);
					Ti.App.fireEvent('app:apicallSuccess',{params: _requestArgs});
					_setPhotoUrl(response.data);
				}
				else {
					// listView.appendData(_listData);
				}
				
				if(_feedData.length > 0) {
					_pageIndex++;
					// listView.showLazyLoadingRow();
				}
				else {
					// listView.hideLazyLoadingRow();
				}
        	},
        	error: function(error) {
        		if(isRefresh) {
        			// listView.setData([UI.createErrorView(error.errorMessage, function() {
	          //      		_loadData(true);
	          //      	})], false);
        		}
        		else {
        			UI.showAlert(error.errorMessage);
        		}
                setTimeout(function() {
                	if(_pageIndex > 0) {
	                	// listView.showLazyLoadingRow();
	                }
                }, 500);
        	}
        });
	}; //end _loadData
	
	// _loadData(true);
	
	
    var _getView = function() {
		Utils.trackScreen('stylefeed.page');
        return mainView;
    };
    
    /*
     * Filter data
     */
    var _filterData = function(filters) {
    	_feedFilters = filters;
    	_loadData(true);
    };
    
    /*
     * Search for feeds
     */
    var _searchData = function(searchText) {
    	_feedSearchText = searchText;
    	_loadData(true);
    };
    
    var _webViewSFClick = function(e){
		// Ti.API.info(constant.APP + " ############# WEBVIEW STYLE FEED CLICKED ###############");
		_loadProductDetails(e.productId);
	};

	var _loadBrandApiData = function(){
		Utils.getBrands(function(responseData) {
				var _childViews = [];
				for(var i=0; i<responseData.length; i++) {
					_childViews.push({
						id: responseData[i].brandId,
						title: responseData[i].name
					});
				}
				Ti.API.info(constant.APP + " ############ retrieved brand data array of length [" + _childViews.length + "]");
				Ti.App.fireEvent('webViewStyleFeed:brandApiDataFetched',{brandData: _childViews});
				Loader.hide();
			});
		_loadPriceFilters();
		_loadCondtionFilters();
	};

	var _loadPriceFilters = function(){
		Ti.App.fireEvent('webViewStyleFeed:priceApiDataFetched',{priceFilters: constant.PRICE_FILTERS});
	};

	var _loadCondtionFilters = function(){
		Ti.App.fireEvent('webViewStyleFeed:conditionApiDataFetched',{conditionFilters: constant.CONDITION_FILTERS});
	};

	var _loadCategoryApiData = function(){
		Utils.getCategories(function(responseData) {
				var _childViews = [];
				for(var i=0; i<responseData.length; i++) {
					_childViews.push({
						id: responseData[i].categoryId,
						title: responseData[i].name
					});
				}
				Ti.App.fireEvent('webViewStyleFeed:categoryApiDataFetched',{categoryData: _childViews});
			});
	};

	var _loadFeedData = function(){
		_loadData(true);
	}

	// var _hideLoader = function(){
	// 	Loader.hide();
	// };

	Ti.App.addEventListener('app:loadBrandApiData',_loadBrandApiData);
	Ti.App.addEventListener('app:loadCategoryApiData',_loadCategoryApiData);
	Ti.App.addEventListener('app:loadProduct',_webViewSFClick);
	
	Ti.App.addEventListener('app:loadFeedData',_loadFeedData);
	Ti.App.addEventListener('app:loadUser',_profileViewClickHandler);
	// Ti.App.addEventListener('app:loadComplete',_hideLoader);

    var _removeFromMemory = function() {
    	_style = null;
    	Ti.App.removeEventListener('app:loadProduct',_webViewSFClick);
		Ti.App.removeEventListener('app:loadBrandApiData',_loadBrandApiData);
		Ti.App.removeEventListener('app:loadFeedData',_loadFeedData);
		Ti.App.removeEventListener('app:loadUser',_profileViewClickHandler);
		Ti.App.removeEventListener('app:loadCategoryApiData',_loadCategoryApiData);
		// UI.resetWebView(); 
		// Ti.App.removeEventListener('app:loadComplete',_hideLoader);
		_profileViewClickHandler = null;
		_loadFeedData = null;
    	_webViewSFClick = null;
    	_loadBrandApiData = null;
        Window.clearMemory(mainView);
        mainView = null;
        _getView = null;
        _filters = null;
        _searchText = null;
        _filterData = null;
        _searchData = null;
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        filterData: _filterData,
        searchData: _searchData,
        removeFromMemory: _removeFromMemory
    };
};

