exports.get = function(userId, verificationCode, signUpCallback) {
	var _style = require('/styles/login').get();
	
	//	Verification view
	var verificationView = Ti.UI.createView(_style.verificationView);
	var btnClose = UI.createButton(_style.btnClose);
	var lblAlmostThere = Ti.UI.createLabel(_style.lblAlmostThere);
	var lblInstruction = Ti.UI.createLabel(_style.lblInstruction);
	var txtCode = UI.createTextField(_style.txtCode);
	// txtCode.value = verificationCode;
	var btnVerify = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
	    title: 'VERIFY',
	    top: UI.top(20)
	}));
	var btnResend = UI.createButton(Utils._.extend({}, _commonStyle.smallButtonBold, {
	    title: 'Not Received Email? Resend Code',
	    top: 0,
	    font: {
            fontSize: UI.fontSize(14),
            fontFamily: constant.FONT.DEFAULT_FONT,
            fontWeight: 'bold'
       },
	    color: '#ef4e6d'
	}));
	verificationView.add(btnClose);
	verificationView.add(lblAlmostThere);
	verificationView.add(lblInstruction);
	verificationView.add(txtCode);
	verificationView.add(btnVerify);
	verificationView.add(btnResend);
	
	
	/*
	 * 'X' button click handler
	 */
	btnClose.addEventListener('click', function() {
		if(txtCode) {
			txtCode.value = '';
			txtCode.blur();
		}
		_removeFromMemory();
	});
	
	
    /*
     * 'VERIFIY' button click listener
     */
    btnVerify.addEventListener('click', function() {
        if(txtCode.value == '') {
            txtCode.focus();
            return;
        }
        
        if(txtCode.value != verificationCode) {
            var alertDialog = UI.createAlertDialog({
                title: 'VERIFICATION ERROR!',
                message: 'Invalid verification code. Verification code is not matching with the code sent to you.'
            });         
            alertDialog.show();
            alertDialog = null;
            return;
        }
        
        txtCode.blur();
        
        var _requestArgs = {
            showLoader: true,
            url: 'user.php',
            method: 'post',
            serverArgs: {
                action: 'verify',
                userId: userId,
                verificationCode: txtCode.value,
            }
        };
        
        /*
         * Hit web service
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
	             switch(response.data.status) {
	                //  Verification successful
	                case "1":
	                	Utils.hasUserVerifiedTheCode(true);
	                	// _removeFromMemory();
	                	// var alertDialog = UI.createAlertDialog({
		                    // title: 'VERIFICATION SUCCESSFUL!', 
		                    // message: 'Verification successful. Thank you for signing up.'
		                // });
		                // alertDialog.show();
		                // alertDialog = null;
		                
		                Utils._.isFunction(signUpCallback) && signUpCallback({userId: userId});
	                break;
	                
	                //  Verification failed
	                case "2":
	                    var alertDialog = UI.createAlertDialog({
		                    title: 'VERIFICATION FAILED!', 
		                    message: 'Verification failed. Please check the code provided in your email.'
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
    });
    
    btnResend.addEventListener('click', function(e) {
    	txtCode.blur();
    	
        var _requestArgs = {
            showLoader: true,
            url: 'user.php',
            method: 'post',
            serverArgs: {
                action: 'resendCode',
                userId: userId
            }
        };
        
        /*
         * Hit web service
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
            	var alertDialog = UI.createAlertDialog({
                    title: 'SUCCESS!', 
                    message: 'Verification code has been resent your email id.'
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
    });
    
    
    Window.getCurrentWindow().addEventListener('click', function() {
		if(txtCode) {
			txtCode.blur();
		}
	});   
	
	
    var _getView = function() {
    	return verificationView;
    };
    
    var _removeFromMemory = function() {
    	Window.getCurrentWindow().remove(verificationView);
    	Window.clearMemory(verificationView);
    };
    
    
	return {
		getView: _getView,
		removeFromMemory: _removeFromMemory
	};
};

