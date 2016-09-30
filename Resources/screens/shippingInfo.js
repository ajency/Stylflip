exports.get = function(tabSelected, checkOutDetails, paymentCallback) {
	Analytics.trackScreen({
		screenName: 'Shipping Info'
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
	header.setTitle('Shipping Info');
    var contentView = Ti.UI.createScrollView(Utils._.extend({}, _commonStyle.contentScrollView, {
    	top: 0,
    	height: Ti.UI.FILL,
        layout: 'vertical'
    }));
	mainView.add(header.getView());
    mainView.add(contentView);
	
	var lastOpenedContentsView, lastOpenedContentViewIndex = -1, currentFocusedTextField, lastRightButton;
	
	var _selectedAddressIndex, _lastSelectedAddress;
	var _shippingAddress = {
    	addressLine1: '',
    	city: '',
    	landmark: '',
    	phoneNumber: '',
    	postCode: '',
    	state: ''
    };
	
	var _createAddressView = function(addressDetails, i, callback) {
		var _isEditable = true; // addressDetails.hasOwnProperty('editable') && addressDetails.editable;
		var mainAddressView = UI.createClickableView(Utils._.extend({}, _commonStyle.accordionView, {
			top: i == 0 ? UI.top(10) : -1,
	    	index: i
	    }));
	    var radioButtonView = Ti.UI.createView({
	    	left: UI.left(5),
	    	width: UI.width(30),
	    	height: UI.height(30),
	    	bubbleParent: false,
	    	index: i
	    });
	    var radioButton = UI.createButton({
	    	backgroundImage: '/images/sell/form-check-off.png',
	    	width: UI.width(15),
	    	height: UI.height(15)
	    });
	    radioButtonView.add(radioButton);
	    var lblAddressType = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
	    	text: addressDetails.addressTitle == '' ? 'Address ' + (i + 1) : addressDetails.addressTitle,
	    	left: UI.left(40)
	    }));
	    var btnExpandCollapse = UI.createButton(Utils._.extend({}, _commonStyle.expandButton, {
	    	title: '+',
	    	right: UI.right(20)
	    }));
	    mainAddressView.add(radioButtonView);
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
	    	/*
	    	 * Address selection logic
	    	 */
	    	if(_lastSelectedAddress){
	    		_lastSelectedAddress.children[0].children[0].backgroundImage = '/images/sell/form-check-off.png';
	    	}
	    	_selectedAddressIndex = this.index;
	    	this.children[0].children[0].backgroundImage = '/images/sell/form-check-on.png';
	    	_lastSelectedAddress = this;
	    	_shippingAddress = addressDetails;

	    	
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
	    		lastRightButton = this.children[2];
	    		lastRightButton.title = '-';
	    	}
	    });
	    
	    // radioButtonView.addEventListener('click', function() {
	    	// if(_lastSelectedAddress){
	    		// _lastSelectedAddress.children[0].backgroundImage = '/images/sell/form-check-off.png';
	    	// }
	    	// _selectedAddressIndex = this.index;
	    	// this.children[0].backgroundImage = '/images/sell/form-check-on.png';
	    	// _lastSelectedAddress = this;
	    	// _shippingAddress = addressDetails;
	    // });
	    

	    /*
	     * Address details view's contents
	     */
	    var lblFirstName = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'first name *',
	        top: UI.top(10),
	        left: UI.left(30)
	    }));
	    var txtFirstName = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
	        left: UI.left(30),
	        right: UI.right(10),
	        value: addressDetails && addressDetails.firstName,
	        hintText: 'please enter first name',
	        textAlign: 'left',
	        maxLength: 100,
	        editable: _isEditable
	    }));
	    var lblLastName = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'last name *',
	        top: UI.top(10),
	        left: UI.left(30)
	    }));
	    var txtLastName = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
	        left: UI.left(30),
	        right: UI.right(10),
	        value: addressDetails && addressDetails.lastName,
	        hintText: 'please enter last name',
	        textAlign: 'left',
	        maxLength: 100,
	        editable: _isEditable
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
	        maxLength: 100,
	        editable: _isEditable
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
	        maxLength: 100,
	        editable: _isEditable
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
	        maxLength: 100,
	        editable: _isEditable
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
	        editable: _isEditable,
	        keyboardType: Ti.UI.KEYBOARD_PHONE_PAD
	    }));
	    var lblPhoneNumber = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'phone number *',
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
	        editable: _isEditable,
	        keyboardType: Ti.UI.KEYBOARD_PHONE_PAD
	    }));
	    txtPhoneNumberView.add(lblCountryCode);
	    txtPhoneNumberView.add(txtPhoneNumber);
	    
	    // addressDetailsView.add(lblAddressTitle);  
	    // addressDetailsView.add(txtAddressTitle);
	    addressDetailsView.add(lblFirstName);   
	    addressDetailsView.add(txtFirstName);
	    addressDetailsView.add(lblLastName);   
	    addressDetailsView.add(txtLastName);
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
	    
	    if(Utils._.isFunction(callback)) {
	    	txtFirstName.addEventListener('change', function() {
		    	callback({ key: 'firstName', value: this.value, index: i });
		    });
		    txtLastName.addEventListener('change', function() {
		    	callback({ key: 'lastName', value: this.value, index: i });
		    });
	    	txtAddress1.addEventListener('change', function() {
		    	callback({ key: 'addressLine1', value: this.value == this.hintText ? '' : this.value, index: i });
		    });
		    txtAddress2.addEventListener('change', function() {
		    	callback({ key: 'addressLine2', value: this.value == this.hintText ? '' : this.value, index: i });
		    });
		    txtLandmark.addEventListener('change', function() {
		    	callback({ key: 'landmark', value: this.value, index: i });
		    });
		    txtState.addEventListener('click', function() {
		    	var window = Window.create(exitOnClose=false);
		        var state = require('/screens/states').get(txtState.value, function(e) {
		        	txtState.value = e.state;
		        	txtCity.value = '';
		        	callback({ key: 'state', value: txtState.value, index: i });
		        	callback({ key: 'city', value: '', index: i });
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
		        	callback({ key: 'city', value: txtCity.value, index: i });
		        });
		        window.add(city.getView());
		        Window.open(window); 
		    });
		    txtPostCode.addEventListener('change', function() {
		    	callback({ key: 'postCode', value: this.value, index: i });
		    });
		    txtPhoneNumber.addEventListener('change', function() {
		    	callback({ key: 'phoneNumber', value: this.value, index: i });
		    });
	    }
	};
	
	
	var _getAddresses = function() {
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
	    		var _userDetails = response.data[0];
		        var _userAddresses = response.data[0].userAddresses;
		        _userAddresses.push({
					addressType: '',
			    	addressLine1: '',
			    	addressLine2: '',
			    	addressTitle: 'Add a location',
			    	city: '',
			    	landmark: '',
			    	phoneNumber: '',
			    	postCode: '',
			    	state: '',
			    	editable: true
			    });
		        
	        	var lblShipTo = Ti.UI.createLabel({
	        		text: 'Ship to: ',
			    	left: UI.left(10),
			    	top: UI.top(10),
			    	width: Ti.UI.SIZE,
			    	font: {
		                fontSize: UI.fontSize(14),
		                fontFamily: constant.FONT.DEFAULT_FONT,
		                fontWeight: 'bold'
		            },
		            color: '#737373'
	        	});
	        	contentView.add(lblShipTo);
		        
		        for(var i=0; i<_userAddresses.length; i++) {
		        	_userAddresses[i].firstName = _userDetails.firstName;
		        	_userAddresses[i].lastName = _userDetails.lastName;
				    _createAddressView(_userAddresses[i], i, function(e) {
				    	_userAddresses[e.index][e.key] = e.value;
				    });
				}
				
				var btnNext = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
			        title: ' NEXT ',
			        top: UI.top(20),
			        bottom: UI.bottom(20)
			    }));
			    contentView.add(btnNext);
			    
			    btnNext.addEventListener('click', function() {
			    	if(_lastSelectedAddress == undefined) {
			    		var alertDialog = UI.createAlertDialog({
							title: constant.ALERT.TITLE.FAUX_PAS,
							message: 'Please select shipping address'
						});
						alertDialog.show();
						alertDialog = null;
						return;
			    	}
			    	if(_shippingAddress.firstName == '' || _shippingAddress.lastName == '' || _shippingAddress.addressLine1 == '' || _shippingAddress.landmark == '' || _shippingAddress.phoneNumber == '' || _shippingAddress.postCode == '' || _shippingAddress.state == '' || _shippingAddress.city == '') {
			    		var alertDialog = UI.createAlertDialog({
							title: constant.ALERT.TITLE.FAUX_PAS,
							message: 'Please fill required fields'
						});
						alertDialog.show();
						alertDialog = null;
						return;
			    	}
			    	if(isNaN(_shippingAddress.postCode) || _shippingAddress.postCode.trim().length < 6) {
			    		var alertDialog = UI.createAlertDialog({
							title: constant.ALERT.TITLE.FAUX_PAS,
							message: 'Please enter valid post code'
						});
						alertDialog.show();
						alertDialog = null;
						return;
			    	}
			    	if(isNaN(_shippingAddress.phoneNumber) || _shippingAddress.phoneNumber.trim().length < 10) {
			    		var alertDialog = UI.createAlertDialog({
							title: constant.ALERT.TITLE.FAUX_PAS,
							message: 'Please enter valid phone number'
						});
						alertDialog.show();
						alertDialog = null;
						return;
			    	}
			    	
			    	checkOutDetails.shippingAddress = _shippingAddress;
					checkOutDetails.email = _userDetails.email;
			    	
			    	var window = Window.create(exitOnClose=false);
			        var orderSummary = require('/screens/orderSummary').get(checkOutDetails, paymentCallback);
			        window.add(orderSummary.getView());
			        Window.open(window); 
			        
			        /*
			    	var _msg = _shippingAddress.firstName + ' ' + _shippingAddress.lastName + '\n';
			    	_msg += _shippingAddress.addressLine1 + ', ' + _shippingAddress.addressLine2 + ', ' + _shippingAddress.landmark + ', ';
			    	_msg += _shippingAddress.city + ', ' + _shippingAddress.state + ' - ' + _shippingAddress.postCode + '\n';
			    	_msg += 'Contact no.: ' + _shippingAddress.phoneNumber;
			    	
			    	var alertDialog = UI.createAlertDialog({
						title: 'Product will be shipped to',
						message: _msg,
						buttonNames: ['Ok', 'Cancel'],
						textAlign: 'left'
					});
					alertDialog.show();
					alertDialog.addEventListener('click', function(e) {
						if(e.index == 0) {
							checkOutDetails.shippingAddress = _shippingAddress;
							checkOutDetails.email = _userDetails.email;
						 	var window = Window.create(exitOnClose=false, false, disableClick=true);
							var payU = require('/screens/payU').get(checkOutDetails, paymentCallback);
					        window.add(payU.getView());
					        Window.open(window); 
						}
						alertDialog = null;
					});
					*/
			    });
	     	},
	    	error: function(error) {
	            contentView.add(UI.createErrorView(error.errorMessage, function() {
	           		_getAddresses();
	           	}));
	    	}
		});
	};
	
	_getAddresses();
	
	
    var _getView = function() {
    	Utils.trackScreen('shippinginfo.page');
    	return mainView;
    };
    
    
    var _removeFromMemory = function() {
    	
    };
    
	return {
		getView: _getView,
		removeFromMemory: _removeFromMemory
	};
};

