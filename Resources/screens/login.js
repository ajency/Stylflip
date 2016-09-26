exports.get = function() {
	Analytics.trackScreen({
		screenName: 'Login'
	});

	Ti.API.info(constant.APP + " <<<<<<<<<<<<<<<<<<<<<<<< LOGIN SCREEN LOAD >>>>>>>>>>>>>>>>>>>>>>>");

    // if(Utils.loggedInUserId() === null){
    //     NOLOGINDETECTED = true;
    // }
    UI.firstLogin = true;

    var _style = require('/styles/login').get();
    
    var mainView = Ti.UI.createScrollView(_style.mainView); 
    
    var imgAppLogo = Ti.UI.createImageView(_style.imgAppLogo);
    
    var loginView = Ti.UI.createView(_style.loginView);
    var btnLogin = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.smallButton, {
        text: 'Login',
        top: UI.top(0),
        textAlign: 'center'
    }));
    var hrLine1 = Ti.UI.createView(Utils._.extend({}, _commonStyle.hrLine, {
        top: 0
    }));
   	
   	var txtUsernameView = Ti.UI.createView(_style.txtUsernameView);
   	
   	var imgUsernameView = Ti.UI.createView(_style.imgUsernameView);
    var imgUsername = Ti.UI.createImageView(Utils._.extend({}, _style.imgUsername, {
        image: '/images/login/form-username.png'
    }));
    imgUsernameView.add(imgUsername);
    var txtUsername = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
    	// left: UI.left(10),
    	// right: UI.right(50),
        value: '',
    	width: UI.width(200),
        hintText: constant.TEXT.HINT_EMAIL,
        keyboardType: Ti.UI.KEYBOARD_EMAIL,
        returnKeyType: Ti.UI.RETURNKEY_NEXT,
        maxLength: 80
    }));
    txtUsernameView.add(imgUsernameView);
    txtUsernameView.add(txtUsername);
    
    var hrLine2 = Ti.UI.createView(Utils._.extend({}, _commonStyle.hrLine, {
        top: 0
    }));

	var txtPasswordView = Ti.UI.createView(_style.txtUsernameView);
	var imgPasswordView = Ti.UI.createView(_style.imgUsernameView);
    var imgPassword = Ti.UI.createImageView(Utils._.extend({}, _style.imgUsername, {
        image: '/images/login/form-password.png'
    }));
    imgPasswordView.add(imgPassword);
    var txtPassword = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
    	// left: UI.left(10),
    	// right: UI.right(10),
        value: '',
    	width: UI.width(195),
        hintText: constant.TEXT.HINT_PASSWORD,
        passwordMask: true,
        returnKeyType: Ti.UI.RETURNKEY_GO,
        maxLength: 20
    }));
    
    var btnPreviewPasswordView = Ti.UI.createView(_style.imgUsernameView);
    var btnPreviewPassword = UI.createButton(Utils._.extend({}, _style.imgUsername, {
        backgroundImage: '/images/login/form-show-password.png',
        width: UI.width(15.5),
        height: UI.height(8)
    }));
    btnPreviewPasswordView.add(btnPreviewPassword);
    
    txtPasswordView.add(imgPasswordView);
    txtPasswordView.add(txtPassword);
    txtPasswordView.add(btnPreviewPasswordView);
    
    var hrLine3 = Ti.UI.createView(Utils._.extend({}, _commonStyle.hrLine, {
        top: 0
    }));
    
    var lostPasswordView = Ti.UI.createView({
    	top: UI.top(10),
    	width: Ti.UI.FILL,
    	height: Ti.UI.SIZE,
    	// layout: 'horizontal'
    });
    var btnTroubleSigningIn = UI.createButton(Utils._.extend({}, _commonStyle.smallButton, {
        title: 'Trouble Signing in?',
        left: 0,
        width: '50%', // UI.width(280 / 2), // Ti.UI.SIZE,
        font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT,
        },
        color: '#c2c3c4'
    }));
    var btnLostPassword = UI.createButton(Utils._.extend({}, _commonStyle.smallButton, {
        title: 'Forgot Password ?',
        right: 0,
        width: '50%', // UI.width(280 / 2), // Ti.UI.SIZE,
        font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT,
        },
        color: '#c2c3c4'
    }));
    lostPasswordView.add(btnTroubleSigningIn);
    lostPasswordView.add(btnLostPassword);
    
    var btnGo = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: 'GO',
        top: UI.top(15)
    }));
    
    var lblOrLoginWith = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.smallButton, {
        text: ' - or - ',
        top: UI.top(0),
        color: '#c2c3c4',
        textAlign: 'center'
    }));
    
    var socialButtonView = Ti.UI.createView(_style.socialButtonView);
    var btnFacebook = UI.createButton(_style.btnFacebook);
    var btnGoogle = UI.createButton(_style.btnGoogle);
    socialButtonView.add(btnFacebook);
    socialButtonView.add(btnGoogle);
    
    var btnSignUp = UI.createButton(Utils._.extend({}, _commonStyle.smallButton, {
        title: 'New to StylFlip? Create an Account',
        top: UI.top(15),
        width: Ti.UI.SIZE,
        color: '#ef4e6d'
    }));
    var btnJustBrowsing = UI.createButton(Utils._.extend({}, _commonStyle.smallButton, {
        title: 'I\'d like to Window Shop',
        top: UI.top(5),
        width: Ti.UI.SIZE,
        color: '#00a8b4',
        font: {
            fontSize: UI.fontSize(14),
            fontFamily: constant.FONT.DEFAULT_FONT,
            fontWeight: 'bold'
        }
    }));
    
    loginView.add(btnLogin);
    loginView.add(hrLine1);
    loginView.add(txtUsernameView);
	loginView.add(hrLine2);
    loginView.add(txtPasswordView);
    loginView.add(hrLine3);
    loginView.add(lostPasswordView);
    loginView.add(btnGo);
    loginView.add(lblOrLoginWith);
    loginView.add(socialButtonView);
    loginView.add(btnSignUp);
    loginView.add(btnJustBrowsing);
    
    
    mainView.add(imgAppLogo);
    mainView.add(loginView);
    
    
 	/*
     * Open dashboard/window after login
     */
    var _openDashboard = function(loginType, userId, isLoggedInForTheFirstTime) {
    	if(_isSignUpScreenOpened) {
    		Window.getCurrentWindow().close();
    		_isSignUpScreenOpened = false;
    	}
        	
    	if(loginType && userId) {
            Ti.API.info(constant.APP + " ######################## SETTING USERID ##########################");
    		Ti.App.Properties.setString('userId', userId);
        	Ti.App.Properties.setString('loginType', loginType);
        	Utils.hasUserVerifiedTheCode(true);
            // Ti.API.info(constant.APP + " ###################### retrieved userId: " + userId);
            if(!isLoggedInForTheFirstTime && loginType === 'email'){ //only email for now on subsequent logins
                Utils.setLoginCreds(txtUsername.value.trim(),'#Stylflip123');
            }
    	}
    	
    	// var currentWindow = Window.getCurrentWindow();
        
        //  Goto dashboard screen         
        var window = Window.create(exitOnClose=true, toBeOpened=true);
        if(isLoggedInForTheFirstTime) {
        	var editProfile = require('/screens/editProfile').get(undefined, true);
	        window.add(editProfile.getView());
        }
        else {
        	var dashboard = require('/screens/dashboard').get();
    	 	window.add(dashboard.getView());
        }
        Window.open(window);  
        
        /*
         * Clear memory on login window open
         */
        window.addEventListener('open', function() {
        	_removeFromMemory();
        	// if(osname == 'android') {
        		// Window.clearMemory(currentWindow);
				// currentWindow = null;
        	// }
        	// else {
        		// currentWindow.close();
        	// }
        });
    };
    
    
    /*
     * Login via email
     */
    var _loginViaEmail = function() {
    	if(txtUsername.value.trim() == '') {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.FAUX_PAS,
                message: 'Please enter a valid e-mail address'
            });    
            alertDialog.show();
            alertDialog = null; 
            return;
        }
        
        if(!Utils.isValidEmail(txtUsername.value.trim())) {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.FAUX_PAS,
                message: 'The e-mail address you\'ve used appears to be incorrect. Try again with a valid e-mail address.'
            });    
            alertDialog.show();
            alertDialog = null; 
            return;
        }
        
        if(txtPassword.value.trim() == '') {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.FAUX_PAS,
                message: 'Please enter your password'
            });    
            alertDialog.show();
            alertDialog = null; 
            return;
        }
        
        txtUsername.blur();
        txtPassword.blur();
        
        var _requestArgs = {
            showLoader: true,
            url: 'user.php',
            method: 'POST',
            serverArgs: {
                action: 'login',
                email: txtUsername.value.trim(),
                password: txtPassword.value.trim()
            }
        };
        
        /*
         * Hit web service
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
	            switch(response.data.status) {
	                //  Login successful
	                case "1":
	                    _openDashboard('email', response.data.userId, (response.data.loggedInFirstTime == 1 || response.data.loggedInFirstTime == true || response.data.loggedInFirstTime == 'true') ? true : false);
	                    // _openDashboard('email', response.data.userId, true);
	                break;
	                
	                //  Invalid email or password
	                case "2":
	                    var alertDialog = UI.createAlertDialog({
	                        title: constant.ALERT.TITLE.FAUX_PAS, 
	                        // message: 'Damn! The e-mail address or password entered seems to be incorrect. Give it another shot.'
	                        message: 'It seems the email ID or password you have entered is incorrect. Please check the same and try again. If you are still facing a problem click the \'Trouble signing in?\' and tell us about the issue. Our support team will help you out!'
	                    });
	                    
	                    alertDialog.show();
	                    alertDialog = null;
	                break;
	                
	                //  Email address not verified
	                case "3":
	                    // if(Utils.hasUserVerifiedTheCode() && Ti.App.Properties.getInt('userIdToVerify') == response.data.userId) {
					    	var verificationView = require('/screens/verificationPopUp').get(response.data.userId, response.data.verificationCode, function(e) {
					        	_openDashboard('email', e.userId, true);
					    	}).getView();
							Window.getCurrentWindow().add(verificationView);
					    // }
					    var alertDialog = UI.createAlertDialog({
	                        title: constant.ALERT.TITLE.FAUX_PAS, 
	                        message: 'Your e-mail address is not verified. Please enter the 4 digit code sent to your email to verify your email address.'
	                    });
	                    alertDialog.show();
	                    alertDialog = null;
	                break;
	                
	                //  account disabled by admin
                    case "4":
                        var alertDialog = UI.createAlertDialog({
                            title: constant.ALERT.TITLE.WHOOPS, 
                            message: constant.ALERT.MESSAGE.ACCOUNT_BLOCKED
                        });
                        alertDialog.show();
                        alertDialog = null;
                    break;
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
    };
    
    
    
    var _submitSigningInIssue = function(email, issue, callback) {
    	if(email.value.trim() == '' || email.value.trim() == email.hintText) {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.FAUX_PAS,
                message: 'Please enter a valid e-mail address'
            });    
            alertDialog.show();
            alertDialog.addEventListener('hide', function() {
            	email.focus();
            	alertDialog = null;
            });
            return;
        }
        
        if(!Utils.isValidEmail(email.value.trim())) {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.FAUX_PAS,
                message: 'The e-mail address you\'ve used appears to be incorrect. Try again with a valid e-mail address.'
            });    
            alertDialog.show();
            alertDialog.addEventListener('hide', function() {
            	email.focus();
            	alertDialog = null;
            });
            return;
        }
        
        if(issue.value.trim() == '' || issue.value.trim() == issue.hintText) {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.FAUX_PAS,
                message: 'Please describe the issue that you\'re facing'
            });    
            alertDialog.show();
            alertDialog.addEventListener('hide', function() {
            	issue.focus();
            	alertDialog = null;
            });
            return;
        }
		
		var _requestArgs = {
            showLoader: true,
            url: 'user.php',
            method: 'POST',
            serverArgs: {
                action: 'troubleSigningIn',
                email: email.value.trim(),
                issue: issue.value.trim()
            }
        };
        
        /*
         * Hit web service
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
	            if(Utils._.isFunction(callback)) {
	            	callback();
	            }
	            var alertDialog = UI.createAlertDialog({
                    title: constant.ALERT.TITLE.THANK_YOU, 
                    message: 'You query has been successfully submitted.'
                });
                alertDialog.show();
                alertDialog = null;
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
    
    
    
    btnTroubleSigningIn.addEventListener('click', function() {
    	var troubleView = Ti.UI.createView({
    		left: UI.left(20),
    		right: UI.right(20),
    		height: Ti.UI.SIZE,
    		layout: 'vertical'
    	});
    	var txtEmailId = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
    		left: -1,
    		right: -1,
	        hintText: 'enter email id',
	        hintColor: '#828282',
	        color: '#ffffff',
	        keyboardType: Ti.UI.KEYBOARD_EMAIL,
	        returnKeyType: Ti.UI.RETURNKEY_NEXT,
	        maxLength: 80,
	        type: 'textArea',
	        borderColor: '#828282'
	    }));
	    var txtIssue = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
	    	left: -1,
    		right: -1,
	        top: -1,
	        height: UI.height(70),
	        hintText: 'describe the issue that you\'re facing',
	        hintColor: '#828282',
	        color: '#ffffff',
	        returnKeyType: Ti.UI.RETURNKEY_GO,
	        maxLength: 500,
	        type: 'textArea',
	        borderColor: '#828282'
	    }));
	    troubleView.add(txtEmailId);
	    troubleView.add(txtIssue);
	    
	    txtEmailId.addEventListener('return', function() {
	    	txtIssue.focus();
	    });
	    
	    txtIssue.addEventListener('return', function() {
	    	_submitSigningInIssue(txtEmailId, txtIssue, function() {
    			troubleDialog.hide();
    			troubleDialog = null;
    		});
	    });
    	
    	var troubleDialog = UI.createAlertDialog({
            title: 'Sorry \'bout that',
            message: 'If you feel you are entering the right credentials but still not able to sign in or having any other problems, do tell us. We\'ll do our best to sort you out!',
            customView: troubleView,
            dismissable: false,
            buttonNames: ['Submit >']
        });    
        troubleDialog.show();
        troubleDialog.addEventListener('click', function(e) {
        	if(e.index == 0) {
        		_submitSigningInIssue(txtEmailId, txtIssue, function() {
        			troubleDialog.hide();
        			troubleDialog = null;
        		});
        	}
        });
    });
    
    
    /*
     * Forgot password button click listener
     */
    btnLostPassword.addEventListener('click', function() {
    	if(txtUsername.value.trim() == '') {
    		txtUsername.blur();
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.FAUX_PAS,
                message: 'Please enter a valid e-mail address'
            });    
            alertDialog.show();
            alertDialog.addEventListener('hide', function() {
            	txtUsername.focus();
            	alertDialog = null;
            });
            return;
        }
        
        if(!Utils.isValidEmail(txtUsername.value.trim())) {
        	txtUsername.blur();
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.FAUX_PAS,
                message: 'The e-mail address you\'ve used appears to be incorrect. Try again with a valid e-mail address.'
            });    
            alertDialog.show();
            alertDialog.addEventListener('hide', function() {
            	txtUsername.focus();
            	alertDialog = null;
            });
            return;
        }
        
        txtUsername.blur();
    	
    	var alertDialog = UI.createAlertDialog({
    		title: constant.ALERT.TITLE.FORGOT_PASSWORD,
    		message: 'Don\'t worry.\nDo you want to reset your password now?',
    		buttonNames: ['yes', 'no']
    	});	
    	alertDialog.show();
    	alertDialog.addEventListener('click', function(e) {
    		if(e.index == 0) {
    			var _requestArgs = {
	                showLoader: true,
	                url: 'user.php',
	                method: 'post',
	                serverArgs: {
	                    action: 'sendResetPasswordLink',
	                    email: txtUsername.value.trim()
	                }
	            };
	            
	            HttpClient.getResponse({
	            	requestArgs: _requestArgs,
		        	success: function(response) {
		        		var _title, _message;
			            if(response.data.status == 1) {
			            	_title = constant.ALERT.TITLE.RESET_PASSWORD;
			            	_message = 'A link to reset password has been sent to your registered e-mail address';
			            }
			            else if(response.data.status == 2) {
			            	_title = constant.ALERT.TITLE.FAUX_PAS;
			            	_message = 'E-mail address is not registered';
			            }
			            var statusDialog = UI.createAlertDialog({
		                    title: _title, 
		                    message: _message
		                });
		                statusDialog.show();
		                statusDialog = null;
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
    });
    
    
    /*
     * 'Preview Password' button click listener
     */
    btnPreviewPasswordView.addEventListener('click', function() {
    	txtPassword.passwordMask = !txtPassword.passwordMask;
    });


    /*
     * 'I'M NEW HERE' button click listener
     */
    var _isSignUpScreenOpened = false;
    btnSignUp.addEventListener('click', function() {
    	_isSignUpScreenOpened = true;
    	//  Goto dashboard sign up screen         
        var window = Window.create(exitOnClose=false);
        var signUp = require('/screens/signUp').get(function(e) {
        	if(e == undefined) {
        		_isSignUpScreenOpened = false;
        	}
        	if(e != undefined && e.userId != undefined) {
        		_openDashboard('email', e.userId, true);
        	}
        });
        window.add(signUp.getView());
        Window.open(window);  
    });
    
    
    /*
     * 'JUST BROWSING' button click listener
     */
    btnJustBrowsing.addEventListener('click', function() {
		Analytics.trackEvent({
		  category: "Window Shopping",
		  action: "click",
		  label: "-",
		  value: 1
		});
    	_openDashboard(); 
    });
    
    
    /*
     * 'GO' button click listener - login event
     */
    btnGo.addEventListener('click', function() {
        _loginViaEmail();
    });
    
    
    txtUsername.addEventListener('return', function() {
    	txtPassword.focus();
    });
    
    txtPassword.addEventListener('return', function() {
        _loginViaEmail();
    });
    
    
    /*
     * 'FACEBOOK' button click listener
     */
    btnFacebook.addEventListener('click', function() {
        if(!Ti.Network.online) {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.OOPS, 
                message: constant.ALERT.MESSAGE.INTERNET_CONNECTION
            });
            alertDialog.show();
            alertDialog = null;
            return; 
        }
        
        /* hide this for ios */
        // Loader.show();
    	
    	Social.facebook('login');
    });
    
    
    /*
     * Facebook login event listener
     */
    var _onFBLogin = function(e) {
        Loader.hide();
        
        if(e.cancel) {
            return;
        }
        
        if(e.success) {
        	Ti.App.Properties.setBool('fbLoggedIn', true);
        	
            var resultData = JSON.parse(e.data);

            var _requestArgs = {
                showLoader: true,
                url: 'user.php',
                method: 'post',
                serverArgs: {
                    action: 'facebookLogin',
                    fbId: resultData.id,
                    firstName: resultData.first_name,
                    lastName: resultData.last_name,
                    fbProfileLink: resultData.link,
                    profilePicURL: ''
                    // name: resultData.name,
                    // location: {
                        // name: resultData.location.name,
                        // homeTown: resultData.hometown.name
                    // }
                }
            };
            
            HttpClient.getResponse({
            	requestArgs: _requestArgs,
	        	success: function(response) {
		            switch(response.data.status) {
	                    //  Facebook login successful
	                    case "1":
	                        _openDashboard('facebook', response.data.userId, (response.data.loggedInFirstTime == 1 || response.data.loggedInFirstTime == true || response.data.loggedInFirstTime == 'true') ? true : false);
	                    break;
	                    
	                    //  account disabled by admin
	                    case "4":
	                        var alertDialog = UI.createAlertDialog({
				                title: constant.ALERT.TITLE.WHOOPS, 
				                message: constant.ALERT.MESSAGE.ACCOUNT_BLOCKED
				            });
	                        alertDialog.show();
	                        alertDialog = null;
	                    break;
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
        else {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.OOPS, 
                message: e.errorMessage
            });
            alertDialog.show();
            alertDialog = null;
            return; 
        }   
    };
    
    
    Ti.App.addEventListener('onFBLogin', _onFBLogin);

    
    /*
     * 'GOOGLE' button click listener
     */
    btnGoogle.addEventListener('click', function() {
        if(!Ti.Network.online) {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.OOPS, 
                message: constant.ALERT.MESSAGE.INTERNET_CONNECTION
            });
            alertDialog.show();
            alertDialog = null;
            return; 
        }
        // Loader.show();
        Social.googlePlus('login');             
    });
    
    /*
     * Google login event listener
     */
    var _onGoogleLogin = function(e) {
        // Loader.hide();
        
        if(!e.success) {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.OOPS, 
                message: e.errorMessage
            });
            alertDialog.show();
            alertDialog = null;
            return; 
        } 
        
        var resultData = e.data;
        
        var _requestArgs = {
            showLoader: true,
            url: 'user.php',
            method: 'post',
            serverArgs: {
                action: 'googlePlusLogin',
                gPlusId: resultData.id,
                firstName: resultData.name.givenName,
                lastName: resultData.name.familyName,
                googlePlusProfileLink: resultData.url,
                profilePicURL: resultData.image.url
            }
        };
        
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
	            switch(response.data.status) {
	                //  Google+ login successful
	                case "1":
	                    _openDashboard('googlePlus', response.data.userId, (response.data.loggedInFirstTime == 1 || response.data.loggedInFirstTime == true || response.data.loggedInFirstTime == 'true') ? true : false);
	                break;
	                
	                //  account disabled by admin
                    case "4":
                        var alertDialog = UI.createAlertDialog({
                            title: constant.ALERT.TITLE.FAUX_PAS, 
                            message: 'Your account has been blocked. Please contact admin.'
                        });
                        alertDialog.show();
                        alertDialog = null;
                    break;
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
    };
    
    Ti.App.addEventListener('onGoogleLogin', _onGoogleLogin);
    
    
    // Window.getCurrentWindow().addEventListener('open', function() {
	 	// /*
	     // * Check if user has verified the code or not
	     // */
	    // if(Utils.hasUserVerifiedTheCode()) {
	    	// var verificationView = require('/screens/verificationPopUp').get(Ti.App.Properties.getInt('userIdToVerify'), Ti.App.Properties.getInt('verificationCode'), function(e) {
	        	// _openDashboard('email', e.userId, true);
	    	// }).getView();
			// Window.getCurrentWindow().add(verificationView);
	    // }
    // });
    
    
    // Window.getCurrentWindow().addEventListener('close', function() {
    	// _removeFromMemory();
    	// Ti.App.removeEventListener('onFBLogin', _onFBLogin);
        // Ti.App.removeEventListener('onGoogleLogin', _onGoogleLogin);
        // _onFBLogin = null;
        // _onGoogleLogin = null;
    // });
    
    
    if(_isUserAutoLoggedOut) {
    	setTimeout(function() {
    		var blockedAlertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.WHOOPS, 
                message: constant.ALERT.MESSAGE.ACCOUNT_BLOCKED
            });
            blockedAlertDialog.show();
            blockedAlertDialog = null;
    	}, 500);
    	_isUserAutoLoggedOut = false;
    }
    
    
    var _getView = function() {
        // Utils.trackScreen('login');
        return mainView;
    };
    
    
    var _removeFromMemory = function() {
    	Ti.App.removeEventListener('onFBLogin', _onFBLogin);
        Ti.App.removeEventListener('onGoogleLogin', _onGoogleLogin);
        _onFBLogin = null;
        _onGoogleLogin = null;
        
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

