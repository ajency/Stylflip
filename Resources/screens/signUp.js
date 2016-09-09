exports.get = function(signUpCallback) {
	Analytics.trackScreen({
		screenName: 'Sign Up'
	});
	
    var _style = require('/styles/login').get();
    
    var mainView = Ti.UI.createScrollView(_style.mainView); 
    
    var imgAppLogo = Ti.UI.createImageView(_style.imgAppLogo);
    
    var signUpView = Ti.UI.createView(_style.loginView);
    var btnIAmNewHere = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.smallButton, {
        text: 'Sign Up',
        top: UI.top(5),
        textAlign: 'center'
    }));
    
    var socialButtonView = Ti.UI.createView(_style.socialButtonView);
    var btnFacebook = UI.createButton(_style.btnFacebook);
    var btnGoogle = UI.createButton(_style.btnGoogle);
    socialButtonView.add(btnFacebook);
    socialButtonView.add(btnGoogle);
    
    var lblOr = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.smallButton, {
        text: '- or -',
        top: UI.top(5),
        textAlign: 'center'
    }));
    
    var lblRegister = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.smallButton, {
        text: 'REGISTER',
        top: UI.top(0),
        width: Ti.UI.SIZE,
        color: '#32b1ba',
        font: {
            fontSize: UI.fontSize(14),
            fontFamily: constant.FONT.DEFAULT_FONT,
            fontWeight: 'bold'
        },
        textAlign: 'center'
    }));
    
    var hrLine1 = Ti.UI.createView(Utils._.extend({}, _commonStyle.hrLine, {
        top: UI.top(10)
    }));
    var txtSignUpEmail = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        top: UI.top(0),
        hintText: constant.TEXT.HINT_EMAIL,
        keyboardType: Ti.UI.KEYBOARD_EMAIL,
        returnKeyType: Ti.UI.RETURNKEY_NEXT,
        maxLength: 80
    }));
    var hrLine2 = Ti.UI.createView(Utils._.extend({}, _commonStyle.hrLine, {
        top: 0
    }));
    var txtSignUpPassword = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        hintText: constant.TEXT.HINT_PASSWORD,
        passwordMask: true,
        returnKeyType: Ti.UI.RETURNKEY_GO,
        maxLength: 20
    }));
    
    var hrLine3 = Ti.UI.createView(Utils._.extend({}, _commonStyle.hrLine, {
        top: 0
    }));
    var btnCreate = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: 'CREATE',
        top: UI.top(20)
    }));
    
    var btnLogin = UI.createButton(Utils._.extend({}, _commonStyle.smallButton, {
        title: 'Already a Member? Login',
        top: UI.top(20),
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
    
    signUpView.add(btnIAmNewHere);
    signUpView.add(socialButtonView);
    signUpView.add(lblOr);
    signUpView.add(lblRegister);
    signUpView.add(hrLine1);
    signUpView.add(txtSignUpEmail);
    signUpView.add(hrLine2);
    signUpView.add(txtSignUpPassword);
    signUpView.add(hrLine3);
    signUpView.add(btnCreate);
    signUpView.add(btnLogin);
    signUpView.add(btnJustBrowsing);
    
    mainView.add(imgAppLogo);
    mainView.add(signUpView);
 
 	
	mainView.addEventListener('click', function() {
		txtSignUpEmail.blur();
        // txtSignUpUsername.blur();
        txtSignUpPassword.blur();
        // txtSignUpMobileNumber.blur();
	});
	
	
 	/*
     * Open dashboard/window after login
     */
    var _openDashboard = function(loginType, userId) {
    	if(loginType && userId) {
    		Ti.App.Properties.setString('userId', userId);
        	Ti.App.Properties.setString('loginType', loginType);
    	}
    	
    	var currentWindow = Window.getCurrentWindow();
        
        //  Goto dashboard screen         
        var window = Window.create(exitOnClose=true, toBeOpened=true);
        var dashboard = require('/screens/dashboard').get();
        window.add(dashboard.getView());
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
    };
    
    
    /*
     * Create user
     */
    var _createUser = function() {
    	if(txtSignUpEmail.value.trim() == '') {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.FAUX_PAS,
                message: 'Please enter a valid e-mail address'
            });    
            alertDialog.show();
            alertDialog = null; 
            return;
        }
        
        if(!Utils.isValidEmail(txtSignUpEmail.value.trim())) {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.FAUX_PAS,
                message: 'The e-mail adress you\'ve used appears to be incorrect. Try again with a valid e-mail id.'
            });    
            alertDialog.show();
            alertDialog = null;  
            return;
        }
        
        if(txtSignUpPassword.value.trim() == '') {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.FAUX_PAS,
                message: 'Please enter your password'
            });    
            alertDialog.show();
            alertDialog = null;
            return;
        }
        
        if(txtSignUpPassword.value.trim() != '' && txtSignUpPassword.value.trim().length < 6) {
            var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.FAUX_PAS,
                message: 'Your password must be at least 6 characters long'
            });     
            alertDialog.show();
            alertDialog = null; 
            return;
        }
        
        // if(txtSignUpMobileNumber.value.trim() != '' && isNaN(txtSignUpMobileNumber.value.trim())) {
            // var alertDialog = UI.createAlertDialog({
                // title: constant.ALERT.TITLE.ERROR,
                // message: constant.ALERT.MESSAGE.INVALID_MOBILE_NUMBER
            // });    
            // alertDialog.show();
            // alertDialog = null; 
            // return;
        // }
        
        txtSignUpEmail.blur();
        txtSignUpPassword.blur();
        
        var _requestArgs = {
            showLoader: true,
            url: 'user.php',
            method: 'post',
            serverArgs: {
                action: 'register',
                email: txtSignUpEmail.value.trim(),
                username: '', // txtSignUpUsername.value.trim(),
                password: txtSignUpPassword.value,
                mobileNumber: '' // txtSignUpMobileNumber.value.trim()
            }
        };
        
        /*
         * Hit web service
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
	            switch(response.data.status) {
	                //  Registration successful
	                case "1":
                        Utils.setLoginCreds(txtSignUpEmail.value.trim(),'#Stylflip123');
	                	// Utils.hasUserVerifiedTheCode(false, response.data.userId, response.data.verificationCode);
	                	txtSignUpEmail.value = '';
		                // txtSignUpUsername.value = '';
		                txtSignUpPassword.value = '';
		                // txtSignUpMobileNumber.value = '';
                	 	var verificationView = require('/screens/verificationPopUp').get(response.data.userId, response.data.verificationCode, signUpCallback).getView();
						Window.getCurrentWindow().add(verificationView);
	                break;
	                
	                //  Email already exists
	                case "2":
	                    var alertDialog = UI.createAlertDialog({
	                        title: constant.ALERT.TITLE.FAUX_PAS, 
	                        message: 'A profile with that email adress already exists.'
	                    });
	                    alertDialog.show();
	                    alertDialog = null;
	                break;
	                
	                //  Username already exists
	                case "3":
	                    var alertDialog = UI.createAlertDialog({
	                        title: constant.ALERT.TITLE.SIGNUP_FAILED, 
	                        message: constant.ALERT.MESSAGE.USER_NAME_EXISTS
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
    

    /*
     * 'LOGIN' button click listener
     */
    btnLogin.addEventListener('click', function() {
    	Window.getCurrentWindow().close();
    });
    
 
    /*
     * 'JUST BROWSING' button click listener
     */
    btnJustBrowsing.addEventListener('click', function() {
    	//  Goto dashboard screen         
	    var window = Window.create(exitOnClose=true, toBeOpened=true);
	    var dashboard = require('/screens/dashboard').get();
	    window.add(dashboard.getView());
	    Window.open(window);  
    });    
	
	
    /*
     * 'CREATE' button click listener
     */
    btnCreate.addEventListener('click', function() {
        _createUser();
    });
    
    txtSignUpEmail.addEventListener('return', function() {
    	txtSignUpPassword.focus();
    });
    
    txtSignUpPassword.addEventListener('return', function() {
    	_createUser();
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
        
        Loader.show();
    	
    	Social.facebook('login');
    });
    
    
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
    
    
    Window.getCurrentWindow().addEventListener('close', function() {
    	Utils._.isFunction(signUpCallback) && signUpCallback();
    	_removeFromMemory();
    });
    
    
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

