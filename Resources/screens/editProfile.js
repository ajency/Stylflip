exports.get = function(tabSelected, isPostLogin, saveCallback) {
	Analytics.trackScreen({
		screenName: 'Edit Profile'
	});
	
	var mainView = Ti.UI.createView({
	    width: Ti.UI.FILL,
	    height: Ti.UI.FILL,
	    layout: 'vertical'
	});	
	
	var header = require('/components/header').get({
		showMenu: false,
    	enableButtons: false,
    	enableBackButton: isPostLogin ? false : true
	});
	header.setTitle('Edit Profile');
	
    var contentView = Ti.UI.createScrollView(Utils._.extend({}, _commonStyle.contentScrollView, {
    	top: 0,
    	bottom: 0,
        layout: 'vertical'
    }));
    
    if(isPostLogin) {
    	contentView.height = Ti.UI.FILL;
    }
    
	mainView.add(header.getView());
    mainView.add(contentView);
    
    if(!isPostLogin) {
		var footer = require('/components/footer').get(defaultSelectedTab=tabSelected, subTab=true);
    	mainView.add(footer.getView());
    }
	
	
	var _getUserProfile = function() {
		contentView.removeAllChildren();
		
	   	var _requestArgs = {
	        showLoader: true,
	        url: 'stylfile.php',
	        method: 'post',
	        serverArgs: {
	        	action: 'getUserProfileForEditProfile',
	            userId: Utils.loggedInUserId()
	       	}
	    };
	    
	    HttpClient.getResponse({
	    	requestArgs: _requestArgs,
	    	success: function(response) {
				contentView.visible = false;
				
		        var _userDetails = response.data[0];
		        
			    var profilePicView = Ti.UI.createView({
			    	backgroundColor: '#808080',
			    	width: Ti.UI.FILL,
			    	height: UI.height(115)
			    });
		    	var imgProfilePic = Ti.UI.createImageView({
		    		defaultImage: '/images/common/profile-icon.png',
					image: Utils.getProfileImageURL(_userDetails.profilePicURL),
					width: UI.width(110),
					height: UI.height(110),
					borderRadius: UI.width(55)
			    });
			    profilePicView.add(imgProfilePic);
			    
				var txtUsername = Ti.UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
			        top: UI.top(0),
			        left: UI.left(20),
			        right: UI.right(20),
			        hintText: constant.TEXT.HINT_USERNAME,
			        value: _userDetails.username ? _userDetails.username : '',
			        textAlign: 'left',
			        paddingLeft: 0,
			        maxLength: 20,
			        bubbleParent: false
			        // editable: isPostLogin
			    }));
			    var txtEmail = Ti.UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
			        top: UI.top(0),
			        left: UI.left(20),
			        right: UI.right(20),
			        hintText: constant.TEXT.HINT_EMAIL,
			        keyboardType: Ti.UI.KEYBOARD_EMAIL,
			        value: _userDetails.email ? _userDetails.email : '',
			        textAlign: 'left',
			        paddingLeft: 0,
			        maxLength: 100,
			        bubbleParent: false
			        // editable: isPostLogin
			    }));
			    var txtBio = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
			        top: UI.top(10),
			        left: UI.left(15),
			        right: UI.right(20),
			        height: UI.height(80),
			        hintText: 'Tell us about your style',
			        value: _userDetails.bio ? _userDetails.bio: '',
			        textAlign: 'left',
			        paddingLeft: 0,
			        maxLength: 160,
			        type: 'textArea',
			        bubbleParent: false
			        // editable: isPostLogin
			    }));
			    if(!isPostLogin) {
			    	txtUsername.returnKeyType = Ti.UI.RETURNKEY_GO;
			    	txtBio.returnKeyType = Ti.UI.RETURNKEY_GO;
			    	txtEmail.editable = false;
			    	
			    	txtUsername.addEventListener('return', function() {
			    		if(this.value.trim() == '' || _userDetails.username == this.value.trim()) {
			    			this.blur();
			    			return;
			    		}
			    		this.blur();
			    		var _requestArgs = {
				            showLoader: true,
				            url: 'stylfile.php',
				            method: 'post',
				            serverArgs: {
				            	action: 'updateUsernameAndBio',
				                userId: Utils.loggedInUserId(),
				                username: this.value.trim()
				            }
				        };
				        
				        HttpClient.getResponse({
				        	requestArgs: _requestArgs,
				        	success: function(response) {
				        		if(response.data.status == 2) {
				        			var alertDialog = UI.createAlertDialog({
				                        title: constant.ALERT.TITLE.FAUX_PAS, 
				                        message: 'A profile with that username already exists.'
				                    });
				                    alertDialog.show();
				                    alertDialog = null;
				                    return;
				        		}
				        		_userDetails.username = _requestArgs.serverArgs.username;
				        		Utils._.isFunction(saveCallback) && saveCallback({username: txtUsername.value.trim()});
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
			    	txtBio.addEventListener('return', function() {
			    		if(this.value.trim() == '' || _userDetails.bio == this.value.trim()) {
			    			this.blur();
			    			return;
			    		}
			    		this.blur();
			    		var _requestArgs = {
				            showLoader: true,
				            url: 'stylfile.php',
				            method: 'post',
				            serverArgs: {
				            	action: 'updateUsernameAndBio',
				                userId: Utils.loggedInUserId(),
				                bio: this.value.trim()
				            }
				        };
				        
				        HttpClient.getResponse({
				        	requestArgs: _requestArgs,
				        	success: function(response) {
				        		_userDetails.bio = _requestArgs.serverArgs.bio;
				        		Utils._.isFunction(saveCallback) && saveCallback({bio: txtBio.value.trim()});
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
			    else {
			    	if(txtEmail.value == '') {
			    		txtEmail.editable = true;
			    	}
			    	else {
			    		txtEmail.editable = false;
			    	}
			    }
			    
			    var editPersonalInfoView = UI.createClickableView(Utils._.extend({}, _commonStyle.accordionView, {
					top: 0
			    }));
			    var lblEditPersonalInfo = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
			    	text: 'Personal Information & Sizes'
			    }));
			    var imgRightArrow = Ti.UI.createImageView(_commonStyle.rightArrow);
			    editPersonalInfoView.add(lblEditPersonalInfo);
			    editPersonalInfoView.add(imgRightArrow);
			    
			    var editKYCView = UI.createClickableView(_commonStyle.accordionView);
			    var lblEditKYC = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
			    	text: 'Edit Bank Details'
			    }));
			    var btnKYCInfoView = UI.createClickableView({
			    	right: UI.right(30),
			    	width: UI.width(50),
			    	height: UI.height(50),
		            bubbleParent: false,
		            visible: false
			    });
		    	var btnKYCInfo = UI.createButton({
			    	backgroundImage: '/images/common/ic-alert.png',
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
			    editKYCView.add(btnKYCInfoView);
			    var imgRightArrow = Ti.UI.createImageView(_commonStyle.rightArrow);
			    editKYCView.add(lblEditKYC);
			    if(_userDetails.kycDetails.length == 0) {
			    	btnKYCInfoView.visible = true;
			    }
			    editKYCView.add(imgRightArrow);
			    
			    var editAddressesView = UI.createClickableView(_commonStyle.accordionView);
			    var lblEditAddresses = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
			    	text: 'Edit Addresses'
			    }));
			    var imgRightArrow = Ti.UI.createImageView(_commonStyle.rightArrow);
			    editAddressesView.add(lblEditAddresses);
			    editAddressesView.add(imgRightArrow);
			    
		    	contentView.add(profilePicView);
		    	contentView.add(txtUsername);  
		    	contentView.add(Ti.UI.createView(Utils._.extend({}, _commonStyle.hrLine, {
		    		backgroundColor: '#bfbfbf',
			        top: 0
			    })));
			    contentView.add(txtEmail);  
		    	contentView.add(Ti.UI.createView(Utils._.extend({}, _commonStyle.hrLine, {
		    		backgroundColor: '#bfbfbf',
			        top: 0
			    })));
			    contentView.add(txtBio);  
			    contentView.add(editPersonalInfoView);
			    contentView.add(editKYCView);
			    contentView.add(editAddressesView);
			    
			    if(isPostLogin) {
				    var btnDone = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
				        title: 'DONE',
				        top: UI.top(10)
				    }));
			    	contentView.add(btnDone);
			    	
			    	btnDone.addEventListener('click', function() {
			    		if(txtUsername.value.trim() == '') {
							var alertDialog = UI.createAlertDialog({
								title: constant.ALERT.TITLE.ERROR,
								message: 'Please enter username'
							});    
							alertDialog.show();
							alertDialog = null;	
							return;
				    	}
				    	
				    	if(!Utils.isValidUsername(txtUsername.value)) {
				    		var alertDialog = UI.createAlertDialog({
								title: constant.ALERT.TITLE.ERROR,
								message: "Please enter a valid username. 'Space' is not allowed. Only 'dot', 'dash', 'underscore' are allowed."
							});    
							alertDialog.show();
							alertDialog = null;	
							return;
				    	}
				    	
				    	if(txtEmail.value.trim() == '') {
				            var alertDialog = UI.createAlertDialog({
				                title: constant.ALERT.TITLE.FAUX_PAS,
				                message: 'Please enter a valid e-mail address'
				            });    
				            alertDialog.show();
				            alertDialog = null; 
				            return;
				        }
				        
				        if(!Utils.isValidEmail(txtEmail.value.trim())) {
				            var alertDialog = UI.createAlertDialog({
				                title: constant.ALERT.TITLE.FAUX_PAS,
				                message: 'The e-mail address you\'ve used appears to be incorrect. Try again with a valid e-mail address.'
				            });    
				            alertDialog.show();
				            alertDialog = null; 
				            return;
				        }
				        
				        if(imgProfilePic.image == '/images/common/profile-icon.png') {
				        	var alertDialog = UI.createAlertDialog({
				                title: constant.ALERT.TITLE.FAUX_PAS,
				                message: 'Please select a profile picture'
				            });    
				            alertDialog.show();
				            alertDialog = null; 
				            return;
				        }
				    	
				    	// if(txtBio.value.trim() == '') {
							// var alertDialog = UI.createAlertDialog({
								// title: constant.ALERT.TITLE.ERROR,
								// message: 'Please describe yourself'
							// });    
							// alertDialog.show();
							// alertDialog = null;	
							// return;
				    	// }
				    	
				    	// if(txtBio.value.trim() == txtBio.hintText) {
							// var alertDialog = UI.createAlertDialog({
								// title: constant.ALERT.TITLE.ERROR,
								// message: 'Please describe yourself'
							// });    
							// alertDialog.show();
							// alertDialog = null;	
							// return;
				    	// }
				    	
				    	var _requestArgs = {
				            showLoader: true,
				            url: 'stylfile.php',
				            method: 'post',
				            serverArgs: {
				            	action: 'updateUsernameAndBio',
				                userId: Utils.loggedInUserId(),
				                username: txtUsername.value.trim(),
				                email: txtEmail.value.trim(),
				                bio: txtBio.value.trim() == txtBio.hintText ? '' : txtBio.value.trim(),
				                newUser: true
				            }
				        };
				        
				        txtUsername.blur();
				        txtBio.blur();
				    	
						HttpClient.getResponse({
				        	requestArgs: _requestArgs,
				        	success: function(response) {
				        		if(response.data.status == 2) {
				        			var alertDialog = UI.createAlertDialog({
				                        title: constant.ALERT.TITLE.FAUX_PAS, 
				                        message: 'A profile with that username already exists.'
				                    });
				                    alertDialog.show();
				                    alertDialog = null;
				                    return;
				        		}
				        		if(response.data.status == 3) {
				        			var alertDialog = UI.createAlertDialog({
				                        title: constant.ALERT.TITLE.FAUX_PAS, 
				                        message: 'A profile with that email adress already exists.'
				                    });
				                    alertDialog.show();
				                    alertDialog = null;
				                    return;
				        		}
					            var window = Window.create(exitOnClose=true, toBeOpened=true);
					        	var dashboard = require('/screens/dashboard').get('social');
					    	 	window.add(dashboard.getView());
						        Window.open(window);  
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
			    
				contentView.visible = true;
				
				contentView.addEventListener('click', function() {
					txtUsername.blur();
					txtBio.blur();
				});
				
				editPersonalInfoView.addEventListener('click', function() {
					var window = Window.create(exitOnClose=false);
			        var editPersonalDetails = require('/screens/personalDetails').get(tabSelected='stylefile', isPostLogin, _userDetails, function(data) {
		        		// txtUsername.value = data.username;
		        		// txtBio.value = data.bio;
		        		for(var _key in data) {
		        			_userDetails[_key] = data[_key];
		        		}
			        });
			        window.add(editPersonalDetails.getView());
			        Window.open(window); 
				});
				
				editAddressesView.addEventListener('click', function() {
					Analytics.trackEvent({
				  		category: "Addresses (Edit Profile)",
				  		action: "click",
				  		label: "",
				  		value: 1
					});

					var window = Window.create(exitOnClose=false);
			        var editAddresses = require('/screens/addressesAccordion').get(tabSelected='stylefile', isPostLogin, _userDetails.userAddresses, function(data, index) {
			        	if(_userDetails.userAddresses[index]) {
			        		for(var _key in data) {
			        			_userDetails.userAddresses[index][_key] = data[_key];
			        		}
			        	}
			        	else {
			        		_userDetails.userAddresses[index] = data;
			        	}
			        });
			        window.add(editAddresses.getView());
			        Window.open(window); 
				});
				
				editKYCView.addEventListener('click', function() {
					Analytics.trackEvent({
				  		category: "Bank Details (Edit Profile)",
				  		action: "click",
				  		label: "",
				  		value: 1
					});
					
					var window = Window.create(exitOnClose=false);
			        var editKYCDetails = require('/screens/kycDetails').get(tabSelected='stylefile', isPostLogin, _userDetails.kycDetails[0], function(data) {
		        		_userDetails.kycDetails = [];
		        		_userDetails.kycDetails.push(data);

		        		btnKYCInfoView.visible = data.accountName == '';
		        		Utils._.isFunction(saveCallback) && saveCallback({KYC: data.accountName != ''});
			        });
			        window.add(editKYCDetails.getView());
			        Window.open(window); 
				});
				
				
				// if(isPostLogin) {
					imgProfilePic.addEventListener('click', function() {
						var _arrButtonOptions = ['TAKE PHOTO', 'CHOOSE FROM GALLERY'];
						// if(this.image != Utils.getProfilePicPlaceHolder()) {
							// _arrButtonOptions.push('REMOVE');
						// }
				    	var buttonBarView = UI.createButtonBarView({
				    		buttonNames: _arrButtonOptions
				    	});
				    	buttonBarView.show();
				    	buttonBarView.addEventListener('click', function(e) {
				    		switch(e.index) {
				    			case 0: 
					    			ImageEditor.takePhoto(function(e) {
							        	if(e.success) {
							        		if(e.imagePath) {
							        			imgProfilePic.image = e.imagePath;
							        		}
							        		else {
							        			imgProfilePic.image = e.image;
							        		}
							        		_uploadProfilePicture(e.image);
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
				    			break;
				    			
				    			case 1: 
					    			ImageEditor.browsePhotoGallery(function(e) {
							        	if(e.success) {
							        		if(e.imagePath) {
							        			imgProfilePic.image = e.imagePath;
							        		}
							        		else {
							        			imgProfilePic.image = e.image;
							        		}
							        		_uploadProfilePicture(e.image);
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
				    			break;
				    			
				    			// case 2:
				    				// imgProfilePic.image = Utils.getProfilePicPlaceHolder();
				    			// break;
				    		}
				    	});
				    });
				// }
				
				if(isPostLogin) {
					var alertDialog = UI.createAlertDialog({
						title: 'ALERT!',
						message: 'Besides your username and city, all information shared on your stylfile will never be shared with anyone, ever. It\'s only used by us to help improve your experience on the app.'
					});
					alertDialog.show();
					alertDialog = null;
				}
	    	},
	    	error: function(error) {
	            contentView.add(UI.createErrorView(error.errorMessage, function() {
               		_getUserProfile();
               	}));
	    	}
	    }); 		
	};
	
	_getUserProfile();
	
	
	
	/*
	 * Upload profile picture
	 */
    var _uploadProfilePicture = function(profilePicture) {
    	var _requestArgs = {
            showLoader: true,
            url: 'stylfile.php',
            method: 'post',
            serverArgs: {
            	action: 'updateProfilePic',
                userId: Utils.loggedInUserId(),
                profilePic: profilePicture
            }
        };
        
        /*
         * Save user's profile pic on sever
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
        		profilePicture = null;
        		Utils._.isFunction(saveCallback) && saveCallback({profilePicURL: response.data.profilePicURL});
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
    };
	
	
	
    var _getView = function() {
    	if(isPostLogin){
    		Utils.trackScreen('signup');
    	}
    	return mainView;
    };
    
    
    var _removeFromMemory = function() {
    	
    };
    
	return {
		getView: _getView,
		removeFromMemory: _removeFromMemory
	};
};

