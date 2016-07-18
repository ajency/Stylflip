exports.get = function(tabSelected, userId, followCallback) {
	var _style = require('/styles/stylefile').get();
	
	var _pageIndex = 0, _username;
	
	var mainView = Ti.UI.createView({
	    width: Ti.UI.FILL,
	    height: Ti.UI.FILL,
	    layout: 'vertical'
	});
	
	var gridView;
	var _columnWidth;
	var lblListedCount;
	
	if(userId && Utils.getPushItemId() == 0) {
		var header = require('/components/header').get({
			showMenu: false,
	    	enableButtons: false,
	    	enableBackButton: true
		});
		var footer = require('/components/footer').get(defaultSelectedTab=tabSelected, subTab=true);
	} 
	
	var contentView = Ti.UI.createView(Utils._.extend({}, _commonStyle.contentView, {
    	top: 0,
    	bottom: 0,
        layout: 'vertical'
    }));
    
    
 	if(userId && Utils.getPushItemId() == 0) {
    	mainView.add(header.getView());
    }
    mainView.add(contentView);
    if(userId && Utils.getPushItemId() == 0) {
    	mainView.add(footer.getView());
    }
    
    var _currentViewSelected;
    var _isAddNewItemViewAdded = false;
    
    var _createItemColumn = function(itemData) {
    	var imgProductView = Ti.UI.createView(Utils._.extend({}, _style.itemView, {
			width: _columnWidth,
			height: _columnWidth,
			borderColor: '#f4f4f4',
			borderWidth: 0
	    }));
		var imgProduct = Ti.UI.createImageView(Utils._.extend({}, _style.itemView, {
			defaultImage: '/images/common/default-shop-small.jpg',
			width: Ti.UI.FILL,
			height: Ti.UI.FILL
	    }));
	    imgProductView.add(imgProduct);
	    
	    if(_currentViewSelected == 'MY FEED') {
	    	imgProductView.wardrobeId = itemData.userWadrobeId;
	    	imgProduct.image = Utils.getFullURL(itemData.image);
	    	imgProduct.addEventListener('click', function() {
		    	var dialogBox = UI.createDialogBox({
		        	title: 'MY FEED',
		        	view: Ti.UI.createImageView({
        				image: this.image,
        				width: UI.width(320),
        				height: UI.height(320)
    				})
		        });
		        dialogBox.addEventListener('hide', function() {
		            dialogBox = null;
		        });
		        dialogBox.show();
	     	});	
	     	if(userId == undefined || (userId != undefined && userId == Utils.loggedInUserId())) {
				var btnMenu = UI.createButton(Utils._.extend({}, _commonStyle.menuButton, {
					top: UI.top(5),
					right: UI.right(5),
					wardrobeId: itemData.userWadrobeId
			    }));
			    imgProductView.add(btnMenu);
			    btnMenu.addEventListener('click', function() {
			    	var optionsView = require('/components/popOver').get({
			    		width: UI.width(110),
			    		height: UI.height(80),
			    		sourceView: this,
			    		options: ['Move to Shop', 'Delete'],
			    		borderColor: '#bfbfbf',
	    				borderWidth: 1,
			    		handleOffScreen: true
			    	});
			    	optionsView.show();
			    	optionsView.addEventListener('click', function(e) {
			    		optionsView.hide();
			    		switch(e.index) {
			    			case 0:
				    			Analytics.trackEvent({
							  		category: "Move to shop (Feed)",
							  		action: "click",
							  		label: "",
							  		value: 1
								});
							
		    				 	var window = Window.create(exitOnClose=false);
						    	var sell = require('/screens/sell').get('stylefile', {
						    		image: Utils.convertImageUrlToBlob(Utils.getFullURL(itemData.image)),
						    		onMovedToShop: function() {
						    			Window.closeAll(function() {
						    				var _requestArgs = {
										        showLoader: true,
										        url: 'stylfile.php',
										        method: 'post',
										        serverArgs: {
										        	action: 'removeFromWardrobe',
										            userId: Utils.loggedInUserId(),
										            wardrobeId: itemData.userWadrobeId
										        }
										    };
										    
										    /*
										     * Hit web service
										     */
										    HttpClient.getResponse({
										    	requestArgs: _requestArgs,
										    	success: function(response) {
										            if(response.data.status == '1') {
										            	gridView.deleteColumn(imgProductView);
										            	if(gridView.getColumnCount() == 1) {
											            	gridView.appendColumn(UI.createNoDataView({
											            		text: 'Your feed is empty. Add a new item now.',
											            		width: _columnWidth,
											            		height: _columnWidth
											            	}));
										            	}
										            	var alertDialog = UI.createAlertDialog({
											                title: constant.ALERT.TITLE.SUCCESS,
											                message: 'MY FEED item has been successfully moved to shop. Thank You for your submission. You will be notified once your Product has been approved for SALE.'
											            });
											            alertDialog.show();
											            alertDialog = null;
											            // lblListedCount.text = (parseInt(lblListedCount.text) + 1) + ' ' + (osname=='android'?' ':'');
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
						    		}
						    	});
							 	window.add(sell.getView());
						        Window.open(window);
			    			break;
			    			
			    			case 1:
			    				var _requestArgs = {
							        showLoader: true,
							        url: 'stylfile.php',
							        method: 'post',
							        serverArgs: {
							        	action: 'removeFromWardrobe',
							            userId: Utils.loggedInUserId(),
							            wardrobeId: itemData.userWadrobeId
							        }
							    };
							    
						        /*
						         * Hit web service
						         */
						        HttpClient.getResponse({
						        	requestArgs: _requestArgs,
						        	success: function(response) {
							            if(response.data.status == '1') {
							            	gridView.deleteColumn(imgProductView);
							            	if(gridView.getColumnCount() == 1) {
								            	gridView.appendColumn(UI.createNoDataView({
								            		text: 'Your feed is empty. Add a new item now.',
								            		width: _columnWidth,
								            		height: _columnWidth
								            	}));
							            	}
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
			    			break;
			    		}
			    	});
			    });	     		
	     	}
	     	else {
	     		itemData.isLiked = itemData.isLiked=='1'||itemData.isLiked==1||itemData.isLiked==true?true:false;
	     		var btnLike = UI.createButton(Utils._.extend({}, _commonStyle.likeButton, {
	     			backgroundImage: itemData.isLiked?'/images/common/like-active.png':'/images/common/like.png',
					top: UI.top(5),
					right: UI.right(5),
					wardrobeId: itemData.userWadrobeId,
					isLiked: itemData.isLiked
			    }));
			    imgProductView.add(btnLike);
			    btnLike.addEventListener('click', function() {
			    	if(!Utils.isUserLoggedIn()) {
			    		UI.showLoginAlert();
			    		return;
			    	}
			    	
					var _requestArgs = {
				        showLoader: true,
				        url: 'stylfile.php',
				        method: 'post',
				        serverArgs: {
				        	action: btnLike.isLiked?'disLikeWardrobeItem':'likeWardrobeItem',
				            userId: Utils.loggedInUserId(),
				            wardrobeId: itemData.userWadrobeId
				        }
				    };
				    
			        /*
			         * Hit web service
			         */
			        HttpClient.getResponse({
			        	requestArgs: _requestArgs,
			        	success: function(response) {
				            if(response.data.status == '1') {
				            	if(btnLike.backgroundImage == '/images/common/like-active.png') {
				            		btnLike.backgroundImage = '/images/common/like.png';
						    	}
						    	else {
						    		btnLike.backgroundImage = '/images/common/like-active.png';
						    	}
						    	btnLike.isLiked = !btnLike.isLiked;
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
	     	}
	    }
	    else if(_currentViewSelected == 'WANTS') {
	    	imgProductView.productId = itemData.productId;
	    	imgProduct.image = Utils.getFullURL(itemData.primaryPhoto);
	    	
	    	if(userId == undefined || (userId != undefined && userId == Utils.loggedInUserId())) {
		    	var btnDelete = UI.createButton(Utils._.extend({}, _commonStyle.deleteButton, {
					// top: UI.top(5),
					// right: UI.right(5)
			    }));
			    imgProductView.add(btnDelete);
			    btnDelete.addEventListener('click', function() {
			    	var alertDialog = UI.createAlertDialog({
			    		title: 'Remove from WANTS?',
			    		message: 'Are you sure you no longer WANT this item?',
			    		buttonNames: ['Ok', 'Cancel']
			    	});
			    	alertDialog.show();
			    	alertDialog.addEventListener('click', function(e) {
			    		if(e.index == 0) {
			    			var _requestArgs = {
						        showLoader: true,
						        url: 'stylfile.php',
						        method: 'post',
						        serverArgs: {
						        	action: 'removeFromWant',
						            userId: Utils.loggedInUserId(),
						            productId: itemData.productId
						        }
						    };
						    
					        /*
					         * Hit web service
					         */
					        HttpClient.getResponse({
					        	requestArgs: _requestArgs,
					        	success: function(response) {
						            if(response.data.status == '1') {
						            	gridView.deleteColumn(imgProductView);
						            	if(gridView.getColumnCount() == 0) {
						                	gridView.hideLazyLoadingRow();
							            	gridView.appendColumn(UI.createNoDataView({
							            		text: 'There must be something you want! Save items you want here and shop later.',
							            		// width: _columnWidth * 2,
							            		// height: _columnWidth * 2
							            		left: UI.left(10),
							            		right: UI.right(10)
							            	}));
						                }
						            	var alertDialog = UI.createAlertDialog({
						                    title: constant.ALERT.TITLE.SUCCESS, 
						                    message: 'The item has been successfully removed from your WANTS'
						                });
						                alertDialog.show();
						                alertDialog = null;
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
			    	return;
			    });
		    }
	    }
	    else {	
	    	imgProductView.productId = itemData.productId;
	    	imgProductView.editableDeletable = true;
	    	imgProduct.image = Utils.getFullURL(itemData.primaryPhoto);
	    	itemData.isApproved = itemData.isApproved == 1 ? true : false;
	    	itemData.isPurchased = itemData.isPurchased == 1 ? true : false;
	    	itemData.KYC = itemData.KYC == undefined ? undefined : (itemData.KYC == 1 ? true : false);
	    	if(itemData.isPurchased) {
	    		imgProductView.add(UI.createImageWithTextView({
	    			width: Ti.UI.FILL,
	    			height: Ti.UI.FILL,
	    			type: 'sold'
	    		}));
	    	}
	    	else if(itemData.KYC != undefined && itemData.KYC == false) {
	    		imgProductView.add(UI.createImageWithTextView({
	    			width: Ti.UI.FILL,
	    			height: Ti.UI.FILL,
	    			type: 'pending kyc'
	    		}));
	    	}
	    	else if(!itemData.isApproved) {
	    		imgProductView.add(UI.createImageWithTextView({
	    			width: Ti.UI.FILL,
	    			height: Ti.UI.FILL,
	    			type: 'pending approval'
	    		}));
	    	}
	    }
	    return imgProductView;
    };
    
    
    var _setDataToView = function(isRefresh) {
    	if(isRefresh) {
	    	gridView.setData([]);
			_isAddNewItemViewAdded = false;
			_pageIndex = 0;
    	}
    	
    	var _requestArgs = {
	        showLoader: true,
	        url: 'stylfile.php',
	        method: 'post',
	        serverArgs: {
	           	userId: userId != undefined ? userId : Utils.loggedInUserId(),
	           	loggedInUserId: Utils.loggedInUserId(),
	           	pageIndex: _pageIndex
	        }
	    };
	    
    	switch(_currentViewSelected) {
    		case 'MY FEED':
    			_requestArgs.serverArgs.action = 'myWardrobe';
    		break;
    		
    		case 'CLOSET':
    			_requestArgs.serverArgs.action = 'myProducts';
    		break;
    		
    		case 'WANTS':
    			_requestArgs.serverArgs.action = 'myWants';
    		break;
    	}
    	
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
	            var _data = response.data;
	            var _gridData = [];
	            
	            if(_data.length == 0 && _pageIndex == 0 && _currentViewSelected != 'MY FEED') {
        			var _noDataTextProps = {
    					// width: _columnWidth * 2,
    					// height: _columnWidth * 2
    					left: UI.left(10),
	            		right: UI.right(10)
    				};
        			if(userId == undefined || (userId != undefined && userId == Utils.loggedInUserId())) {
        				if(_currentViewSelected == 'CLOSET') {
	        				_noDataTextProps.text = 'Sell items from your feed for cash. What are you waiting for, get started asap.';
			            }
			            else if(_currentViewSelected == 'WANTS') {
			            	_noDataTextProps.text = 'There must be something you want! Save items you want here and shop later.';
			            }
        			}
        			else {
    					if(_currentViewSelected == 'CLOSET') {
	        				_noDataTextProps.text = _username + ' hasn\'t listed anything for sale yet.';
			            }
			            else if(_currentViewSelected == 'WANTS') {
			            	_noDataTextProps.text = _username + ' has no WANTS yet.';
			            }
        			}
		            gridView.setData([UI.createNoDataView(_noDataTextProps)]);
		            return;
	            }
	            
	            if(!_isAddNewItemViewAdded && _currentViewSelected == 'MY FEED' && (userId == undefined || (userId != undefined && userId == Utils.loggedInUserId()))) {
	            	var addNewItemView = Ti.UI.createView(Utils._.extend({}, _style.itemView, {
	            		backgroundColor: '#80a5ab',
						width: _columnWidth,
						height: _columnWidth,
						type: 'addNewItemToWardrobe'
				    }));
					var btnAdd = UI.createButton(Utils._.extend({}, _commonStyle.smallButtonBold, {
						backgroundImage: '/images/sell/camera-click.png',
						width: UI.width(60),
						height: UI.height(25),
						bubbleParent: true
				    }));
				    addNewItemView.add(btnAdd);
				   	_gridData.push(addNewItemView);
				   	_isAddNewItemViewAdded = true;
	            }
	            
	            if(_currentViewSelected == 'MY FEED' && _data.length == 0 && _pageIndex == 0) {
	            	var _noDataTextProps = {};
	            	if(userId == undefined || (userId != undefined && userId == Utils.loggedInUserId())) {
        				_noDataTextProps = {
        					text: 'Your feed is empty. Add a new item now.',
        					width: _columnWidth,
        					height: _columnWidth
        				};
        			}
        			else {
        				_noDataTextProps = {
        					text: _username + ' has nothing to show-off yet.',
        					// width: _columnWidth * 2,
        					// height: _columnWidth * 2,
        					left: UI.left(10),
	            			right: UI.right(10)
        				};
        			}
		            _gridData.push(UI.createNoDataView(_noDataTextProps));
	            	gridView.setData(_gridData);
	            	return;
	            }
	            
            	for(var i=0; i<_data.length; i++) {
				   	_gridData.push(_createItemColumn(_data[i]));
		    	}
		    	
				if(isRefresh) {
					gridView.setData(_gridData);
				}
				else {
					gridView.appendData(_gridData);
				}
				
				if(_data.length > 0) {
					_pageIndex++;
					gridView.showLazyLoadingRow();
				}
				else {
					gridView.hideLazyLoadingRow();
				}
        	},
        	error: function(error) {
        		if(isRefresh) {
        			gridView.setData([UI.createErrorView(error.errorMessage, function() {
	               		_setDataToView(true);
	               	})]);
        		}
        		else {
        			UI.showAlert(error.errorMessage);
        		}
                setTimeout(function() {
                	if(_pageIndex > 0) {
	                	gridView.showLazyLoadingRow();
	                }
                }, 500);
        	}
        });
    };
    
    
    
    var _showWardrobeDialog = function(imageToBeUploaded) {
		var wardrobeDialog = UI.createAlertDialog({
			title: constant.ALERT.TITLE.ADDING_TO_WARDROBE,
			message: 'Are you sure you would like to add this item to your feed?',
			buttonNames: ['Ok', 'Cancel']
		});
		wardrobeDialog.addEventListener('click', function(e) {
			if(e.index == 0) {
				var _requestArgs = {
		            showLoader: true,
		            url: 'stylfile.php',
		            method: 'post',
		            serverArgs: {
		            	action: 'addToWardrobe',
		                userId: Utils.loggedInUserId(),
		                image: imageToBeUploaded
		            }
		        };
		        
		        /*
		         * Save user's profile pic on sever
		         */
		        HttpClient.getResponse({
		        	requestArgs: _requestArgs,
		        	success: function(response) {
			            /*var alertDialog = UI.createAlertDialog({
			                title: 'SUCCESS', 
			                message: 'Image has been successfully added to Feed.'
			            });
			            alertDialog.show();
			            alertDialog = null;
			            gridView.hideLazyLoadingRow();
			            gridView.appendColumn(_createItemColumn(response.data[0]));
			            gridView.showLazyLoadingRow();*/
			            // _wardrobeImage = null;
			            imageToBeUploaded = null;
			            _setDataToView(true);
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
			wardrobeDialog = null;
		});
		wardrobeDialog.show();
	};
    
    

	/*
	 * Load user profile
	 */
	var _loadUserProfile = function() {
		contentView.removeAllChildren();
		
		var _requestArgs = {
	        showLoader: true,
	        url: 'stylfile.php',
	        method: 'post',
	        serverArgs: {
	        	action: 'profileInfo',
	            userId: userId != undefined ? userId : Utils.loggedInUserId()
	        }
	    };
	    
	    if(userId != undefined) {
	    	_requestArgs.serverArgs.loggedInUserId = Utils.loggedInUserId();
	    }
	    
	    var _isOtherUser = userId != undefined && userId != Utils.loggedInUserId();
	    
	    /*
	     * Hit web service to get user profile info
	     */
	    HttpClient.getResponse({
	    	requestArgs: _requestArgs,
	    	success: function(response) {
	            var _profileData = response.data[0];
	            
	            _username = _profileData.username;
	        
		    	var  profileView = Ti.UI.createView(_style.profileView);
		    	
		    	var summaryView = Ti.UI.createView(_style.summaryView);
				var imgProfilePic = UI.createRoundedImageView(Utils._.extend({}, _style.imgProfilePic, {
					image: Utils.getProfileImageURL(_profileData.profilePicURL)
			    }));
			    
			    var profileContentsView = Ti.UI.createView(_style.profileContentsView);
			    
			    var usernameAndEditButtonView = Ti.UI.createView(_style.usernameAndEditButtonView);
			    var usernameAndLocationView = Ti.UI.createView(_style.usernameAndLocationView);
			    var lblUsername = Ti.UI.createLabel(Utils._.extend({}, _style.lblUsername, {
					text: _profileData.username
			    }));
			    var lblLocation = Ti.UI.createLabel(Utils._.extend({}, _style.lblLocation, {
					text: _profileData.city?_profileData.city:'-'
			    }));
			    usernameAndLocationView.add(lblUsername);
			    usernameAndLocationView.add(lblLocation);
			    
			    usernameAndEditButtonView.add(usernameAndLocationView);
			    
			    _profileData.KYC = _profileData.KYC == 1 || _profileData.KYC == true;
			    
			    var btnKYCInfoView = UI.createClickableView({
			    	top: 0,
			    	right: UI.right(50),
			    	width: UI.width(30),
			    	height: UI.height(30),
		            bubbleParent: false,
		            visible: false
			    });
			    var btnKYCInfo = UI.createButton({
			    	backgroundImage: '/images/common/ic-alert.png',
			    	top: 0,
			    	width: UI.width(15),
			    	height: UI.height(15)
			    });
			    btnKYCInfoView.add(btnKYCInfo);
			    btnKYCInfoView.addEventListener('click', function() {
					var alertDialog = UI.createAlertDialog({
						title: 'ALERT!',
						message: 'Please input your Bank Details'
					});
					alertDialog.show();
					alertDialog = null;
			    });
			    usernameAndEditButtonView.add(btnKYCInfoView);
			    
			    if(!_profileData.KYC && _profileData.userId == Utils.loggedInUserId()) {
				    btnKYCInfoView.visible = true;
			    }
			    
			    if(Utils.getBoolean(_profileData.isFeatured)) {
				    var imgFeaturedUser = Ti.UI.createImageView(_style.imgFeaturedUser);
				    if(!btnKYCInfoView.visible) {
				    	usernameAndLocationView.width = UI.width(150);
				    	if(_isOtherUser) {
				    		if(_profileData.isFollowing) {
				    			usernameAndLocationView.width = UI.width(140);
				    			imgFeaturedUser.right = UI.right(80);
				    		}
				    		else {
				    			usernameAndLocationView.width = UI.width(155);
				    			imgFeaturedUser.right = UI.right(60);
				    		}
				    	}
				    	else {
				    		imgFeaturedUser.right = UI.right(60);
				    	}
				    }
				    else {
				    	usernameAndLocationView.width = UI.width(140);
				    }
		    		usernameAndEditButtonView.add(imgFeaturedUser);
			    }
			    
			    _profileData.isFollowing = Utils.getBoolean(_profileData.isFollowing);
			    
			    if(_isOtherUser) {
				    var btnFollow = UI.createFollowButton(Utils._.extend({}, (_profileData.isFollowing ? _commonStyle.unfollowButton : _commonStyle.followButton), {
			    		top: 0,
			    		right: 0,
			    		isFollowing: _profileData.isFollowing
				    }), userId, function(e) {
					    if(e.following) {
					    	lblFollowersCount.text = (parseInt(lblFollowersCount.text) + 1) + ' ' + (osname=='android'?' ':'');
					    	usernameAndLocationView.width = UI.width(140);
					    	if(imgFeaturedUser) {
			    				imgFeaturedUser.right = UI.right(80);
			    			}
					    }
					    else {
					    	lblFollowersCount.text = (parseInt(lblFollowersCount.text) - 1) + ' ' + (osname=='android'?' ':'');
					    	usernameAndLocationView.width = UI.width(155);
					    	if(imgFeaturedUser) {
					    		imgFeaturedUser.right = UI.right(60);
					    	}
					    }
			    		
					    Utils._.isFunction(followCallback) && followCallback({following: e.following});
				    });
			    }
			    else {
			    	var btnEditProfilePic = UI.createButton(_style.btnEditProfilePic);
			    	/*
				     * Edit profile button click handler
				     */
				    btnEditProfilePic.addEventListener('click', function() {
				    	var window = Window.create(exitOnClose=false);
				        var editProfile = require('/screens/editProfile').get(tabSelected='stylefile', false, function(userDetails) {
				        	if(userDetails.username) {
				        		lblUsername.text = userDetails.username;
				        	}
				        	if(userDetails.bio) {
				        		lblBio.text = userDetails.bio;
				        	}
				        	if(userDetails.city) {
				        		lblLocation.text = userDetails.city;
				        	}
				        	if(userDetails.profilePicURL) {
				        		// imgProfilePic.image = Utils.getProfileImageURL(userDetails.profilePicURL);
				        		imgProfilePic.setImage(Utils.getProfileImageURL(userDetails.profilePicURL));
				        	}
			        		if(userDetails.hasOwnProperty('KYC')) {
				        		btnKYCInfoView.visible = !userDetails.KYC;
				        		
				        		if(Utils.getBoolean(_profileData.isFeatured)) {
								    if(!btnKYCInfoView.visible) {
								    	usernameAndLocationView.width = UI.width(150);
								    	if(imgFeaturedUser) {
								    		imgFeaturedUser.right = UI.right(60);
								    	}
								    }
								    else {
								    	usernameAndLocationView.width = UI.width(140);
								    	if(imgFeaturedUser) {
								    		imgFeaturedUser.right = UI.right(80);
								    	}
								    }
							    }
				        	}
				        });
				        window.add(editProfile.getView());
				        Window.open(window); 
				    });
			    }
			    
			    usernameAndEditButtonView.add(_isOtherUser ? btnFollow : btnEditProfilePic);
			    
			    var followView = UI.createClickableView(_style.followView);
			    var lblFollowers = Ti.UI.createLabel(Utils._.extend({}, _style.lblListed, {
					text: 'FOLLOWERS: '
			    }));
			    var lblFollowersCount = Ti.UI.createLabel(Utils._.extend({}, _style.lblListedCount, {
					text: _profileData.followers + ' ' + (osname=='android'?' ':'')
			    }));
			    var lblVSeparator = Ti.UI.createView(_style.lblVSeparator);
			    var lblFollowing = Ti.UI.createLabel(Utils._.extend({}, _style.lblListed, {
					text: '  FOLLOWING: '
			    }));
			    var lblFollowingCount = Ti.UI.createLabel(Utils._.extend({}, _style.lblListedCount, {
					text: _profileData.following + (osname=='android'?' ':'')
			    }));
			    followView.add(lblFollowers);
			    followView.add(lblFollowersCount);
			    followView.add(lblVSeparator);
			    followView.add(lblFollowing);
			    followView.add(lblFollowingCount);
			    
			    followView.addEventListener('click', function() {
			    	if(!Utils.isUserLoggedIn()) {
			    		UI.showLoginAlert();
			    		return;
					}
			    	Analytics.trackEvent({
				  		category: "User's Follower / Following (Social)",
				  		action: "click",
				  		label: "",
				  		value: 1
					});

			    	var window = Window.create();
			        var follows = require('/screens/userFollows').get(tabSelected != undefined ? tabSelected : 'stylefile', userId != undefined ? userId : Utils.loggedInUserId(), _username);
			        window.add(follows.getView());
			        Window.open(window);  
			    });
			    
			    var lblBio = Ti.UI.createLabel(Utils._.extend({}, _style.lblLocation, {
					text: _profileData.bio,
					top: UI.top(10)
			    }));
			    
			    profileContentsView.add(usernameAndEditButtonView);
			    profileContentsView.add(followView);
			    profileContentsView.add(lblBio);
			    
			    summaryView.add(imgProfilePic);
			    summaryView.add(profileContentsView);
			    
			    gridView = require('/components/gridView').get({
			    	width: UI.width(320), 
			    	columnLength: 2, 
			    	margin: UI.left(10)
		    	});
			    gridView.setTop(UI.top(10));
			    
			    gridView.addEventListener('scrolledToBottom', function() {
			    	_setDataToView();
			    });
			    
			    // var _lastYPos;
			    // gridView.addEventListener('scroll', function(e) {
			    	// if(_lastYPos != undefined) {
			    		// if(e.y > _lastYPos) {
			    		// }
			    		// else {
			    		// }
			    	// }
			    	// _lastYPos = e.y;
			    // });
			    
			    // gridView.addEventListener('pullToRefresh', function() {
					// _setDataToView(true);
			    // });
			    
			    gridView.addEventListener('click', function(e) {
			    	if(e.column.type == 'addNewItemToWardrobe') {
			    		Analytics.trackEvent({
					  		category: "Camera (Feed)",
					  		action: "click",
					  		label: "",
					  		value: 1
						});
						
			    		// var _wardrobeImage;
			    		
			    		var buttonBarView = UI.createButtonBarView({
				    		buttonNames: ['TAKE PHOTO', 'CHOOSE FROM GALLERY']
				    	});
				    	buttonBarView.show();
				    	buttonBarView.addEventListener('click', function(e) {
				    		if(e.index == 0) {
						        ImageEditor.takePhoto(function(e) {
							    	if(e.success) {
							    		// _wardrobeImage = e.image;
						    			// wardrobeDialog.show();
						    			_showWardrobeDialog(e.image);
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
										// _wardrobeImage = e.image;
						    			// wardrobeDialog.show();
						    			_showWardrobeDialog(e.image);
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
			    	}
			    	
			    	if(e.column.productId != undefined) {
			    		//	Goto details view
				        var window = Window.create(exitOnClose=false);
				        var productDetails = require('/screens/productDetails').get(tabSelected != undefined ? tabSelected : 'stylefile', e.column.productId, function(e) {
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
				        }, {
				        	userId: userId,
				        	editableDeletable: e.column.editableDeletable,
				        	onDelete: function() {
				        		var alertDialog = UI.createAlertDialog({
					                title: constant.ALERT.TITLE.SUCCESS,
					                message: 'Product has been successfully deleted'
					            });
					            alertDialog.show();
					            alertDialog = null;
				        		gridView.deleteColumn(e.column);
				        		if(gridView.getColumnCount() == 0) {
				        			gridView.setData([UI.createNoDataView({
				        				text: 'There is nothing here! Shame on you. Upload a new item to sell now.',
				        				// width: _columnWidth * 2,
				        				// height: _columnWidth * 2,
				        				left: UI.left(10),
	            						right: UI.right(10)
				        			})]);
				        		}
				        		// lblListedCount.text = (parseInt(lblListedCount.text) - 1) + ' ' + (osname=='android'?' ':'');
				        	},
				        	onUpdate: function() {
				        		Window.closeAll(function() {
				        			var alertDialog = UI.createAlertDialog({
						                title: constant.ALERT.TITLE.SUCCESS, 
						                message: 'Your item details have been successfully updated and will be visible in the shop once its approved. Look out for the notification.'
						            });
						            alertDialog.show();
						            alertDialog = null;
				        		});
				        	}
			        	});
				        window.add(productDetails.getView());
				        Window.open(window); 
			    	}
			    });
			    
			    _columnWidth = gridView.getSingleColumnWidth();
			    
			    /*
				 * Button bar
				 */
				var buttonBar = require('/components/buttonBar').get({
					top: UI.top(20),
					width: UI.width(320),
					buttons: [{title: 'MY FEED'}, {title: 'CLOSET', selected: true}, {title: 'WANTS'}],
					selectedButtonStyle: _style.selectedButton,
					unselectedButtonStyle: _style.unselectedButton,
				});
				
				buttonBar.addEventListener('click', function(e) {
					_currentViewSelected = e.title;
					if(_currentViewSelected == 'WANTS') {
						Analytics.trackEvent({
					  		category: "Wants (StylFile)",
					  		action: "click",
					  		label: "",
					  		value: 1
						});
					}
					_setDataToView(true);
				});
			    
			    profileView.add(summaryView);
			    profileView.add(buttonBar.getView());
			    
			    contentView.add(profileView);
				contentView.add(gridView.getView());
			    
			    imgProfilePic.addEventListener('click', function() {
			    	var dialogBox = UI.createDialogBox({
			        	title: 'Profile Pic',
			        	view: Ti.UI.createImageView({
	        				// image: imgProfilePic.image,
	        				image: imgProfilePic.getImage(),
	        				width: UI.width(320),
        					height: UI.height(320)
	    				})
			        });
			        dialogBox.addEventListener('hide', function() {
			            dialogBox = null;
			        });
			        dialogBox.show();
			    });
			    
			    Utils.resetPushItemId();
	    	},
	    	error: function(error) {
	            contentView.add(UI.createErrorView(error.errorMessage, function() {
               		_loadUserProfile();
               	}));
	    	}
	    });		
	};
	
	_loadUserProfile();
	
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

