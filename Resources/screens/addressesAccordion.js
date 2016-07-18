exports.get = function(tabSelected, isPostLogin, userAddresses, saveCallback) {
	Analytics.trackScreen({
		screenName: tabSelected == 'sell' ? 'Add a Location' : 'Edit Addresses'
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
	header.setTitle(tabSelected == 'sell' ? 'Add a Location' : 'Edit Addresses');
	
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
	
	var lastOpenedContentsView, lastOpenedContentViewIndex = -1, currentFocusedTextField, lastRightButton;
	
	
	var _createAddressView = function(addressDetails, i) {
		var mainAddressView = UI.createClickableView(Utils._.extend({}, _commonStyle.accordionView, {
			top: i == 0 ? UI.top(20) : -1,
	    	index: i
	    }));
	    var lblAddressType = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
	    	text: addressDetails.addressTitle == '' ? 'Address ' + (i + 1) : addressDetails.addressTitle,
	    	left: UI.left(30)
	    }));
	    var btnExpandCollapse = UI.createButton(Utils._.extend({}, _commonStyle.expandButton, {
	    	title: '+',
	    	right: UI.right(20)
	    }));
	    mainAddressView.add(lblAddressType);
	    mainAddressView.add(btnExpandCollapse);
	    
	    contentView.add(mainAddressView);  
	    
	    var addressDetailsView = Ti.UI.createView({
	    	width: Ti.UI.FILL,
	    	height: 0,
	    	layout: 'vertical'
	    });
	    contentView.add(addressDetailsView);
	    mainAddressView.contentsView = addressDetailsView;
	    mainAddressView.addEventListener('click', function() {
	    	if(currentFocusedTextField) {
	    		currentFocusedTextField.blur();
	    		currentFocusedTextField = undefined;
	    	}
	    	
	    	if(lastOpenedContentsView) {
	    		lastOpenedContentsView.height = 0;
	    		lastRightButton.title = '+';
	    	}
	    	
	    	if(lastOpenedContentViewIndex > -1 && lastOpenedContentViewIndex == this.index) {
	    		lastOpenedContentsView = undefined;
	    		lastOpenedContentViewIndex = -1;
	    	}
	    	else {
	    		this.contentsView.height = Ti.UI.SIZE;
	    		lastOpenedContentsView = this.contentsView;
	    		lastOpenedContentViewIndex = this.index;
	    		lastRightButton = this.children[1];
	    		lastRightButton.title = '-';
	    	}
	    });
	    

	    /*
	     * Address details view's contents
	     */
	    var lblAddressTitle = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'address title *',
	        top: UI.top(10),
	        left: UI.left(30)
	    }));
    	var txtAddressTitle = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
	        left: UI.left(30),
	        right: UI.right(10),
	        value: addressDetails && (addressDetails.addressTitle == 'Add a location' ? '' : addressDetails.addressTitle),
	        hintText: 'please enter address title',
	        textAlign: 'left',
	        maxLength: 50
	    }));
	    var lblAddress1 = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'address line 1 *',
	        top: UI.top(10),
	        left: UI.left(30)
	    }));
	    var txtAddress1 = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
	        top: UI.top(10),
	        left: UI.left(30),
	        right: UI.right(10),
	        height: UI.height(60),
	        value: addressDetails && addressDetails.addressLine1,
	        hintText: 'please enter address line 1',
	        textAlign: 'left',
	        type: 'textArea',
	        maxLength: 100
	    }));
	    var lblAddress2 = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'address line 2',
	        top: UI.top(10),
	        left: UI.left(30)
	    }));
	    var txtAddress2 = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
	        left: UI.left(30),
	        right: UI.right(10),
	        height: UI.height(60),
	        value: addressDetails && addressDetails.addressLine2,
	        hintText: 'please enter address line 2',
	        textAlign: 'left',
	        type: 'textArea',
	        maxLength: 100
	    }));
	    var lblLandmark = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'landmark *',
	        top: UI.top(10),
	        left: UI.left(30)
	    }));
	    var txtLandmark = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
	        left: UI.left(30),
	        right: UI.right(10),
	        value: addressDetails && addressDetails.landmark,
	        hintText: 'please enter landmark',
	        textAlign: 'left',
	        maxLength: 100
	    }));
	    var lblCountry = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'Country *',
	        top: UI.top(10),
	        left: UI.left(30)
	    }));
	    var txtCountry = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
	        left: UI.left(30),
	        right: UI.right(10),
	        value: 'India',
	        hintText: 'please select country',
	        textAlign: 'left',
	        maxLength: 100,
	        editable: false
	    }));
	    var lblState = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'state *',
	        top: UI.top(10),
	        left: UI.left(30)
	    }));
	    var txtState = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
	        left: UI.left(30),
	        right: UI.right(10),
	        value: addressDetails && addressDetails.state,
	        hintText: 'please select the state you live in',
	        textAlign: 'left',
	        maxLength: 100,
	        editable: false
	    }));
	    var lblCity = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'city *',
	        top: UI.top(10),
	        left: UI.left(30)
	    }));
	    var txtCity = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
	        left: UI.left(30),
	        right: UI.right(10),
	        value: addressDetails && addressDetails.city,
	        hintText: 'please select city',
	        textAlign: 'left',
	        maxLength: 100,
	        editable: false
	    }));
	    var lblPostCode = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'post code *',
	        top: UI.top(10),
	        left: UI.left(30)
	    }));
	    var txtPostCode = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
	        left: UI.left(30),
	        right: UI.right(10),
	        value: addressDetails && addressDetails.postCode,
	        hintText: 'please enter post code',
	        textAlign: 'left',
	        maxLength: 6,
        	keyboardType: Ti.UI.KEYBOARD_PHONE_PAD
	    }));
	    var lblPhoneNumber = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'phone number',
	        top: UI.top(10),
	        left: UI.left(30)
	    }));
	    var txtPhoneNumberView = Ti.UI.createView({
	        left: UI.left(30),
	        right: UI.right(10),
	        height: UI.height(40),
	        layout: 'horizontal'
	    });
	    var lblCountryCode = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.txtField, {
	    	text: ' +91 ',
	    	width: Ti.UI.SIZE,
	    	height: Ti.UI.FILL
	    }));
	    var txtPhoneNumber = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
	    	width: Ti.UI.FILL,
	        value: addressDetails && addressDetails.phoneNumber,
	        hintText: 'phone number',
	        textAlign: 'left',
	        maxLength: 10,
        	keyboardType: Ti.UI.KEYBOARD_PHONE_PAD
	    }));
	    txtPhoneNumberView.add(lblCountryCode);
	    txtPhoneNumberView.add(txtPhoneNumber);
	    var buttonsView = Ti.UI.createView({
	    	top: UI.top(10),
	    	width: Ti.UI.SIZE,
	    	height: Ti.UI.SIZE,
	    	layout: 'horizontal'
	    });
	    if(addressDetails.addressTitle != '' && tabSelected != 'sell') {
		    var btnReset = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
		        title: ' RESET ',
        		bottom: UI.bottom(10),
		        left: UI.left(10),
		        width: Ti.UI.SIZE,
		        color: '#828282',
		        addressDetails: addressDetails,
		        index: i
		    }));
	    }
	 	var btnSave = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
	        title: ' SAVE ',
	        bottom: UI.bottom(10),
	        left: UI.left(10),
	        right: UI.right(10),
	        width: Ti.UI.SIZE,
	        addressDetails: addressDetails,
	        index: i
	    }));
	    if(addressDetails.addressTitle != '' && tabSelected != 'sell') {
	    	buttonsView.add(btnReset);
	    }
	    buttonsView.add(btnSave);
	    
	    addressDetailsView.add(lblAddressTitle);  
	    addressDetailsView.add(txtAddressTitle);
	    addressDetailsView.add(lblAddress1);   
	    addressDetailsView.add(txtAddress1); 
	    addressDetailsView.add(lblAddress2);  
	    addressDetailsView.add(txtAddress2); 
	    addressDetailsView.add(lblLandmark); 
	    addressDetailsView.add(txtLandmark);
	    addressDetailsView.add(lblCountry);  
	    addressDetailsView.add(txtCountry);  
	    addressDetailsView.add(lblState);
	    addressDetailsView.add(txtState); 
	    addressDetailsView.add(lblCity);  
	    addressDetailsView.add(txtCity);  
	    addressDetailsView.add(lblPostCode);  
	    addressDetailsView.add(txtPostCode);  
	    addressDetailsView.add(lblPhoneNumber);
	    addressDetailsView.add(txtPhoneNumberView);
	    addressDetailsView.add(buttonsView); 
	    
	    txtAddressTitle.addEventListener('focus', function() {
	    	currentFocusedTextField = this;
	    });
	    txtAddress1.addEventListener('focus', function() {
	    	currentFocusedTextField = this;
	    });
	    txtAddress2.addEventListener('focus', function() {
	    	currentFocusedTextField = this;
	    });
	    txtLandmark.addEventListener('focus', function() {
	    	currentFocusedTextField = this;
	    });
	    
	    txtState.addEventListener('click', function() {
	    	var window = Window.create(exitOnClose=false);
	        var state = require('/screens/states').get(txtState.value, function(e) {
	        	txtState.value = e.state;
	        	txtCity.value = '';
	        });
	        window.add(state.getView());
	        Window.open(window);  
	    });
	    
	    txtCity.addEventListener('click', function() {
	    	if(txtState.value.trim() == '') {
				var alertDialog = UI.createAlertDialog({
					title: constant.ALERT.TITLE.DANG_IT,
					message: 'Please select the state you live in'
				});    
				alertDialog.show();
				alertDialog = null;
				return;
	    	}
	    	
	    	var window = Window.create(exitOnClose=false);
	        var city = require('/screens/cities').get(txtState.value, txtCity.value, function(e) {
	        	txtCity.value = e.city;
	        });
	        window.add(city.getView());
	        Window.open(window); 
	    });
	    
	    txtPostCode.addEventListener('focus', function() {
	    	currentFocusedTextField = this;
	    });
	    txtPhoneNumber.addEventListener('focus', function() {
	    	currentFocusedTextField = this;
	    });
	    
	    if(addressDetails.addressTitle != '' && tabSelected != 'sell') {
			/*
			 *  'RESET' button click listener
			 */	   
		    btnReset.addEventListener('click', function() {
		    	var currentResetButton = this;
		    	
		    	var alertDialog = UI.createAlertDialog({
					title: 'ALERT!',
					message: 'Are you sure you want to reset this information? You will lose all the data you have entered.',
					buttonNames: ['Yes', 'No']
				});
				alertDialog.addEventListener('click', function(e) {
					if(e.index == 0) {
						var _requestArgs = {
				            showLoader: true,
				            url: 'stylfile.php',
				            method: 'post',
				            serverArgs: {
				            	action: 'deleteUserAddress',
				                userId: Utils.loggedInUserId(),
				                addressType: addressDetails.addressType
				            }
				        };
				        
				        txtAddress1.blur();
				        txtAddress2.blur();
				        txtLandmark.blur();
				        txtState.blur();
				        txtCity.blur();
				        txtPostCode.blur();
				        txtPhoneNumber.blur();
				        
						HttpClient.getResponse({
				        	requestArgs: _requestArgs,
				        	success: function(response) {
			        			Utils._.isFunction(saveCallback) && saveCallback({
			        				addressType: '',
			        				addressTitle: '',
					                addressLine1: '',
					                addressLine2: '',
					                landmark: '',
					                state: '',
					                city: '',
					                postCode: '',
					                phoneNumber: ''
			        			}, currentResetButton.index);
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
	    	if(txtAddressTitle.value.trim() == '') {
	    		txtAddressTitle.blur();
				var alertDialog = UI.createAlertDialog({
					title: constant.ALERT.TITLE.DANG_IT,
					message: 'Enter a title for this address for easy reference'
				});    
				alertDialog.show();
				alertDialog.addEventListener('hide', function() {
					txtAddressTitle.focus();
					alertDialog = null;
				});
				return;
	    	}
	    	
	    	if(txtAddress1.value.trim() == txtAddress1.hintText) {
	    		txtAddress1.blur();
				var alertDialog = UI.createAlertDialog({
					title: constant.ALERT.TITLE.DANG_IT,
					message: 'Tell us where you live so that we can pick up and drop off your stuff'
				});    
				alertDialog.show();
				alertDialog.addEventListener('hide', function() {
					txtAddress1.focus();
					alertDialog = null;
				});
				return;
	    	}
	    	
	    	if(txtLandmark.value.trim() == '') {
	    		txtLandmark.blur();
				var alertDialog = UI.createAlertDialog({
					title: constant.ALERT.TITLE.DANG_IT,
					message: 'Any landmarks to help us find you?'
				});    
				alertDialog.show();
				alertDialog.addEventListener('hide', function() {
					txtLandmark.focus();
					alertDialog = null;
				});
				return;
	    	}
	    	
	    	if(txtState.value.trim() == '') {
	    		txtState.blur();
				var alertDialog = UI.createAlertDialog({
					title: constant.ALERT.TITLE.DANG_IT,
					message: 'Please select the state you live in'
				});    
				alertDialog.show();
				alertDialog.addEventListener('hide', function() {
					txtState.focus();
					alertDialog = null;
				});
				return;
	    	}
	    	
	    	if(txtCity.value.trim() == '') {
	    		txtCity.blur();
				var alertDialog = UI.createAlertDialog({
					title: constant.ALERT.TITLE.DANG_IT,
					message: 'Please select your city'
				});    
				alertDialog.show();
				alertDialog.addEventListener('hide', function() {
					txtCity.focus();
					alertDialog = null;
				});
				return;
	    	}
	    	
	    	if(txtPostCode.value.trim() == '' || (txtPostCode.value.trim() != '' && isNaN(txtPostCode.value.trim()))) {
				txtPostCode.blur();
				var alertDialog = UI.createAlertDialog({
					title: constant.ALERT.TITLE.DANG_IT,
					message: 'Your post code is invalid. Please correct it.'
				});    
				alertDialog.show();
				alertDialog.addEventListener('hide', function() {
					txtPostCode.focus();
					alertDialog = null;
				});
				return;
	    	}
	    	
	    	if(txtPhoneNumber.value.trim() != '' && isNaN(txtPhoneNumber.value.trim())) {
	    		txtPhoneNumber.blur();
				var alertDialog = UI.createAlertDialog({
					title: constant.ALERT.TITLE.DANG_IT,
					message: 'Your phone number is invalid. Please correct it.'
				});    
				alertDialog.show();
				alertDialog.addEventListener('hide', function() {
					txtPhoneNumber.focus();
					alertDialog = null;	
				});
				return;
	    	}
	    	
	    	var _requestArgs = {
	            showLoader: true,
	            url: 'stylfile.php',
	            method: 'post',
	            serverArgs: {
	            	action: 'saveUserAddresses',
	                userId: Utils.loggedInUserId(),
	                addressType: addressDetails.addressType,
	                addressTitle: txtAddressTitle.value.trim(),
	                addressLine1: txtAddress1.value.trim(),
	                addressLine2: txtAddress2.value.trim() == txtAddress2.hintText ? '' : txtAddress2.value.trim(),
	                landmark: txtLandmark.value.trim(),
	                state: txtState.value.trim(),
	                city: txtCity.value.trim(),
	                postCode: txtPostCode.value.trim(),
	                phoneNumber: txtPhoneNumber.value.trim()
	            }
	        };
	        
	        if(!Utils.areDifferent(_requestArgs.serverArgs, addressDetails)) {
	        	Window.getCurrentWindow().close();
	        	return;
	        }
	        
	        
	        txtAddress1.blur();
	        txtAddress2.blur();
	        txtLandmark.blur();
	        txtState.blur();
	        txtCity.blur();
	        txtPostCode.blur();
	        txtPhoneNumber.blur();
	        
	        var currentSaveButton = this;
	    	
			HttpClient.getResponse({
	        	requestArgs: _requestArgs,
	        	success: function(response) {
        			Utils._.isFunction(saveCallback) && saveCallback(_requestArgs.serverArgs, currentSaveButton.index);
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
	};
	
	
	if(tabSelected == 'sell') {
		var addressDetails = {
			addressType: 'Add a location',
	    	addressLine1: '',
	    	addressLine2: '',
	    	addressTitle: 'Add a location',
	    	city: '',
	    	landmark: '',
	    	phoneNumber: '',
	    	postCode: '',
	    	state: ''
	    };
	    _createAddressView(addressDetails, userAddresses.length - 1);
	}
	else {
		for(var i=0; i<3; i++) {
			var addressDetails = userAddresses[i] ? userAddresses[i] : {
				addressType: 'Address ' + (i + 1),
		    	addressLine1: '',
		    	addressLine2: '',
		    	addressTitle: '',
		    	city: '',
		    	landmark: '',
		    	phoneNumber: '',
		    	postCode: '',
		    	state: ''
		    };
		    _createAddressView(addressDetails, i);
		}
	}
    
    
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

