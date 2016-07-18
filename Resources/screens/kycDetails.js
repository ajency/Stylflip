exports.get = function(tabSelected, isPostLogin, kycDetails, saveCallback) {
	Analytics.trackScreen({
		screenName: 'Bank Details'
	});
	
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
	header.setTitle('Edit Bank Details');
	
	if(!isPostLogin) {
		var footer = require('/components/footer').get(defaultSelectedTab=tabSelected, subTab=true);
	}
	
    var contentView = Ti.UI.createScrollView(Utils._.extend({}, _commonStyle.contentScrollView, {
    	top: 0,
    	bottom: 0,
        layout: 'vertical'
    }));
    
    if(isPostLogin) {
    	contentView.height = constant.CONTENT_HEIGHT_WO_FOOTER;
    }
    
	mainView.add(header.getView());
    mainView.add(contentView);
	
    if(!isPostLogin) {
    	mainView.add(footer.getView());
    }
	
	kycDetails = kycDetails ? kycDetails : {
    	bankName: '',
    	accountNumber: '',
    	ifscCode: '',
    	accountName: '',
    	accountType: '',
    	panNumber: ''
    };
	
	var lblBankName = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
		text: 'bank name *',
        top: UI.top(10),
        left: UI.left(20)
    }));
	var txtBankName = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        left: UI.left(20),
        right: UI.right(20),
        value: kycDetails && kycDetails.bankName,
        hintText: 'please enter bank name',
        textAlign: 'left',
        maxLength: 100
    }));
    var lblAccountNumber = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
		text: 'account number *',
        top: UI.top(10),
        left: UI.left(20)
    }));
    var txtAccountNumber = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        left: UI.left(20),
        right: UI.right(20),
        value: kycDetails && kycDetails.accountNumber,
        hintText: 'please enter account number',
        textAlign: 'left',
        maxLength: 50,
        keyboardType: Ti.UI.KEYBOARD_PHONE_PAD
    }));
    var lblReAccountNumber = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
		text: 're-account number *',
        top: UI.top(10),
        left: UI.left(20)
    }));
    var txtReAccountNumber = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        left: UI.left(20),
        right: UI.right(20),
        value: kycDetails && kycDetails.accountNumber,
        hintText: 'please re-enter account number',
        textAlign: 'left',
        maxLength: 50,
        keyboardType: Ti.UI.KEYBOARD_PHONE_PAD
    }));
    var lblIFSCCode = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
		text: 'IFSC code *',
        top: UI.top(10),
        left: UI.left(20)
    }));
    var txtIFSCCode = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        left: UI.left(20),
        right: UI.right(20),
        value: kycDetails && kycDetails.ifscCode,
        hintText: 'please enter IFSC code',
        textAlign: 'left',
        maxLength: 11
    }));
    var lblAccountName = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
		text: 'account name *',
        top: UI.top(10),
        left: UI.left(20)
    }));
    var txtAccountName = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        left: UI.left(20),
        right: UI.right(20),
        value: kycDetails && kycDetails.accountName,
        hintText: 'please enter account name',
        textAlign: 'left',
        maxLength: 100
    }));
    var lblAccountType = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
		text: 'account type *',
        top: UI.top(10),
        left: UI.left(20)
    }));
    var txtAccountType = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        left: UI.left(20),
        right: UI.right(20),
        value: kycDetails && kycDetails.accountType,
        hintText: 'please select account type',
        textAlign: 'left',
        maxLength: 50,
        editable: false
    }));
    var lblPANNumber = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
		text: 'PAN number',
        top: UI.top(10),
        left: UI.left(20)
    }));
    var txtPANNumber = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        left: UI.left(20),
        right: UI.right(20),
        value: kycDetails && kycDetails.panNumber,
        hintText: 'please enter PAN number',
        textAlign: 'left',
        maxLength: 10
    }));
    var buttonsView = Ti.UI.createView({
    	top: UI.top(15),
    	width: Ti.UI.SIZE,
    	height: Ti.UI.SIZE,
    	layout: 'horizontal'
    });
    if(kycDetails.accountName && kycDetails.accountName != '') {
	    var btnReset = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
	        title: ' RESET ',
	        bottom: UI.bottom(10),
	        left: UI.left(10),
	        width: Ti.UI.SIZE,
	        color: '#828282'
	    }));
    }
 	var btnSave = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: ' SAVE ',
        bottom: UI.bottom(10),
        left: UI.left(10),
        right: UI.right(10),
        width: Ti.UI.SIZE
    }));
    if(kycDetails.accountName && kycDetails.accountName != '') {
    	buttonsView.add(btnReset);
    }
    buttonsView.add(btnSave);
    
    contentView.add(lblBankName);
    contentView.add(txtBankName);  
    contentView.add(lblAccountNumber);
    contentView.add(txtAccountNumber);  
    contentView.add(lblReAccountNumber);
    contentView.add(txtReAccountNumber);
    contentView.add(lblIFSCCode); 
    contentView.add(txtIFSCCode); 
    contentView.add(lblAccountName);  
    contentView.add(txtAccountName);  
    contentView.add(lblAccountType);  
    contentView.add(txtAccountType); 
    contentView.add(lblPANNumber); 
    contentView.add(txtPANNumber);  
    contentView.add(buttonsView);  
    
    txtAccountType.addEventListener('click', function() {
    	txtBankName.blur();
        txtAccountNumber.blur();
        txtReAccountNumber.blur();
        txtIFSCCode.blur();
        txtAccountName.blur();
        txtPANNumber.blur();
        
    	var optionsView = require('/components/popOver').get({
			optionStyle: {
    			backgroundColor: '#fff',
    			// borderColor: '#bfbfbf',
    			// borderWidth: 1
    		},
    		width: UI.width(100),
    		height: UI.height(80),
    		sourceView: this,
    		options: ['Savings', 'Current'],
    		borderColor: '#bfbfbf',
			borderWidth: 1,
			align: 'left',
			selectedOption: txtAccountType.value,
			handleOffScreen: true
    	});
    	optionsView.show();
    	optionsView.addEventListener('click', function(e) {
    		optionsView.hide();
    		txtAccountType.value = e.option;
    	});
    });
    
    if(kycDetails.accountName && kycDetails.accountName != '') {
    	/*
		 *  'RESET' button click listener
		 */	    
	    btnReset.addEventListener('click', function() {
	    	var alertDialog = UI.createAlertDialog({
				title: 'ALERT!',
				message: 'Are you sure you want to reset the Bank Details? You will lose all the data you have entered.',
				buttonNames: ['Yes', 'No']
			});
			alertDialog.addEventListener('click', function(e) {
				if(e.index == 0) {
			    	var _requestArgs = {
			            showLoader: true,
			            url: 'stylfile.php',
			            method: 'post',
			            serverArgs: {
			            	action: 'deleteKYCDetails',
			                userId: Utils.loggedInUserId()
			            }
			        };
			        
			        txtBankName.blur();
			        txtAccountNumber.blur();
			        txtReAccountNumber.blur();
			        txtIFSCCode.blur();
			        txtAccountName.blur();
			        txtAccountType.blur();
			        txtPANNumber.blur();
			        
					HttpClient.getResponse({
			        	requestArgs: _requestArgs,
			        	success: function(response) {
			    			Utils._.isFunction(saveCallback) && saveCallback({
			    				bankName: '',
						    	accountNumber: '',
						    	ifscCode: '',
						    	accountName: '',
						    	accountType: '',
						    	panNumber: ''
		    				});
			    			Window.getCurrentWindow().close();
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
		});	    
    }
    
	
	/*
	 *  'SAVE' button click listener
	 */	    
    btnSave.addEventListener('click', function() {
    	txtBankName.blur();
        txtAccountNumber.blur();
        txtReAccountNumber.blur();
        txtIFSCCode.blur();
        txtAccountName.blur();
        txtAccountType.blur();
        txtPANNumber.blur();
        
    	if(txtBankName.value.trim() == '') {
			txtBankName.blur();
			var alertDialog = UI.createAlertDialog({
				title: constant.ALERT.TITLE.WHOOPSIE,
				message: 'Please enter bank name'
			});    
			alertDialog.show();
			alertDialog.addEventListener('hide', function() {
				txtBankName.focus();
				alertDialog = null;
			});
			return;
    	}
    	
    	if(txtAccountNumber.value.trim() == '') {
			txtAccountNumber.blur();
			var alertDialog = UI.createAlertDialog({
				title: constant.ALERT.TITLE.WHOOPSIE,
				message: 'Your account number is invalid'
			});    
			alertDialog.show();
			alertDialog.addEventListener('hide', function() {
				txtAccountNumber.focus();
				alertDialog = null;
			});
			return;
    	}
    	
    	if(txtReAccountNumber.value.trim() == '' || (txtAccountNumber.value.trim() != txtReAccountNumber.value.trim())) {
			txtReAccountNumber.blur();
			var alertDialog = UI.createAlertDialog({
				title: constant.ALERT.TITLE.WHOOPSIE,
				message: 'Your account number and re-account number entered do not match. Please correct for a perfect match.'
			});    
			alertDialog.show();
			alertDialog.addEventListener('hide', function() {
				txtReAccountNumber.focus();
				alertDialog = null;
			});
			return;
    	}
    	
    	if(txtIFSCCode.value.trim() == '') {
			txtIFSCCode.blur();
			var alertDialog = UI.createAlertDialog({
				title: constant.ALERT.TITLE.WHOOPSIE,
				message: 'Please enter IFSC code'
			});    
			alertDialog.show();
			alertDialog.addEventListener('hide', function() {
				txtIFSCCode.focus();
				alertDialog = null;
			});
			return;
    	}
    	
    	// if(!Utils.isValidIFSC(txtIFSCCode.value.trim())) {
			// txtIFSCCode.blur();
			// var alertDialog = UI.createAlertDialog({
				// title: constant.ALERT.TITLE.WHOOPSIE,
				// message: 'The IFSC code entered seems to be invalid. It should be 11 digits with the first 4 being alphabets and the next 7 being numerical.'
			// });    
			// alertDialog.show();
			// alertDialog.addEventListener('hide', function() {
				// txtIFSCCode.focus();
				// alertDialog = null;
			// });
			// return;
    	// }
    	
    	if(txtAccountName.value.trim() == '') {
			txtAccountName.blur();
			var alertDialog = UI.createAlertDialog({
				title: constant.ALERT.TITLE.WHOOPSIE,
				message: 'Please enter account name'
			});    
			alertDialog.show();
			alertDialog.addEventListener('hide', function() {
				txtAccountName.focus();
				alertDialog = null;
			});
			return;
    	}
    	
    	if(txtAccountType.value.trim() == '') {
			txtAccountType.blur();
			var alertDialog = UI.createAlertDialog({
				title: constant.ALERT.TITLE.WHOOPSIE,
				message: 'Please enter account type'
			});    
			alertDialog.show();
			alertDialog.addEventListener('hide', function() {
				txtAccountType.focus();
				alertDialog = null;
			});
			return;
    	}
    	
    	if(txtPANNumber.value.trim() != '' && txtPANNumber.value.trim().length < 10) {
			txtPANNumber.blur();
			var alertDialog = UI.createAlertDialog({
				title: constant.ALERT.TITLE.WHOOPSIE,
				message: 'The PAN number entered seems to be invalid. It should be 11 digits.'
			});    
			alertDialog.show();
			alertDialog.addEventListener('hide', function() {
				txtPANNumber.focus();
				alertDialog = null;
			});
			return;
    	}
    	
    	var _requestArgs = {
            showLoader: true,
            url: 'stylfile.php',
            method: 'post',
            serverArgs: {
            	action: 'updateKYCDetails',
                userId: Utils.loggedInUserId(),
                bankName: txtBankName.value.trim(),
		    	accountNumber: txtAccountNumber.value.trim(),
		    	ifscCode: txtIFSCCode.value.trim(),
		    	accountName: txtAccountName.value.trim(),
		    	accountType: txtAccountType.value.trim(),
		    	panNumber: txtPANNumber.value.trim()
            }
        };
        
        txtBankName.blur();
        txtAccountNumber.blur();
        txtIFSCCode.blur();
        txtAccountName.blur();
        txtAccountType.blur();
        txtPANNumber.blur();
        
        if(!Utils.areDifferent(_requestArgs.serverArgs, kycDetails)) {
        	Window.getCurrentWindow().close();
        	return;
        }
        
		HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
    			Utils._.isFunction(saveCallback) && saveCallback(_requestArgs.serverArgs);
    			Window.getCurrentWindow().close();
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
			
	
    var _getView = function() {
    	return mainView;
    };
    
    
    var _removeFromMemory = function() {
    	
    };
    
	return {
		getView: _getView,
		removeFromMemory: _removeFromMemory
	};
};

