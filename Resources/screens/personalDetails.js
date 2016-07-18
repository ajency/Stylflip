exports.get = function(tabSelected, isPostLogin, userDetails, saveCallback) {
	Analytics.trackScreen({
		screenName: 'Personal Details'
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
	header.setTitle('Edit Personal Info');
	
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
	
    var lblFirstName = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
		text: 'first name *',
        top: UI.top(10),
        left: UI.left(20)
    }));
	var txtFirstName = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        left: UI.left(20),
        right: UI.right(20),
        hintText: 'please enter first name',
        value: userDetails.firstName,
        textAlign: 'left',
        maxLength: 20
    }));
    var lblLastName = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
		text: 'last name *',
        top: UI.top(10),
        left: UI.left(20)
    }));
	var txtLastName = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        left: UI.left(20),
        right: UI.right(20),
        hintText: 'please enter last name',
        value: userDetails.lastName,
        textAlign: 'left',
        maxLength: 20
    }));
    var lblState = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
		text: 'state',
        top: UI.top(10),
        left: UI.left(20)
    }));
    var txtState = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        left: UI.left(20),
        right: UI.right(20),
        hintText: 'please select the state you live in',
        value: userDetails.state,
        textAlign: 'left',
        maxLength: 20,
        editable: false
    }));
    var lblCity = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
		text: 'city',
        top: UI.top(10),
        left: UI.left(20)
    }));
    var txtCity = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        left: UI.left(20),
        right: UI.right(20),
        hintText: 'please select city',
        value: userDetails.city,
        textAlign: 'left',
        maxLength: 20,
        editable: false
    }));
    var lblPhoneNumber = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
		text: 'phone number',
        top: UI.top(10),
        left: UI.left(20)
    }));
    var txtPhoneNumberView = Ti.UI.createView({
        width: UI.width(280),
        height: UI.height(40)
    });
    var lblCountryCode = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.txtField, {
    	text: ' +91 ',
    	left: 0,
    	width: UI.width(50),
    	height: Ti.UI.FILL
    }));
    var txtPhoneNumber = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
    	// width: Ti.UI.FILL,
    	left: UI.left(55),
    	width: UI.width(280-55),
        value: userDetails.mobileNumber,
        hintText: 'please enter your 10 digit phone number',
        textAlign: 'left',
        maxLength: 10,
        keyboardType: Ti.UI.KEYBOARD_PHONE_PAD
    }));
    txtPhoneNumberView.add(lblCountryCode);
    txtPhoneNumberView.add(txtPhoneNumber);
    
    var mySizesView = UI.createClickableView(Utils._.extend({}, _commonStyle.accordionView, {
		top: UI.top(10)
    }));
    var lblMySizes = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'My Sizes'
    }));
    var imgRightArrow = Ti.UI.createImageView(_commonStyle.rightArrow);
    mySizesView.add(lblMySizes);
    mySizesView.add(imgRightArrow);
    
 	var btnSave = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: constant.TEXT.SAVE,
        top: UI.top(20),
        bottom: UI.bottom(10)
    }));
    
   	contentView.add(lblFirstName);  
	contentView.add(txtFirstName);  
	contentView.add(lblLastName);
    contentView.add(txtLastName);  
    contentView.add(lblState);
    contentView.add(txtState);  
    contentView.add(lblCity);
    contentView.add(txtCity);  
    contentView.add(lblPhoneNumber);
    contentView.add(txtPhoneNumberView);
    contentView.add(mySizesView);
    contentView.add(btnSave);
    
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
    
    
    /*
     *  'My Sizes' button click listener	
     */
    mySizesView.addEventListener('click', function() {
    	Analytics.trackEvent({
	  		category: "Sizes (Edit Profile)",
	  		action: "click",
	  		label: "",
	  		value: 1
		});
		
    	var window = Window.create();
    	var mySizes = require('/screens/mySizes').get(tabSelected, {
    		topsAndDresses: userDetails.topsAndDresses,
    		jeansAndBottoms: userDetails.jeansAndBottoms,
    		footwear: userDetails.footwear
    	}, saveCallback);
        window.add(mySizes.getView());
        Window.open(window);  
    });
    
	
	/*
	 *  'SAVE' button click listener
	 */	    
    btnSave.addEventListener('click', function() {
    	txtFirstName.blur();
        txtLastName.blur();
        txtPhoneNumber.blur();
        
        if(txtFirstName.value.trim() == '') {
			txtFirstName.blur();
			var alertDialog = UI.createAlertDialog({
				title: constant.ALERT.TITLE.WHOOPSIE,
				message: 'Please enter first name'
			});    
			alertDialog.show();
			alertDialog.addEventListener('hide', function() {
				txtFirstName.focus();
				alertDialog = null;
			});
			return;
    	}
    	
    	if(txtLastName.value.trim() == '') {
			txtLastName.blur();
			var alertDialog = UI.createAlertDialog({
				title: constant.ALERT.TITLE.WHOOPSIE,
				message: 'Please enter last name'
			});    
			alertDialog.show();
			alertDialog.addEventListener('hide', function() {
				txtLastName.focus();
				alertDialog = null;
			});
			return;
    	}
        
    	if(txtPhoneNumber.value.trim() != '' && isNaN(txtPhoneNumber.value.trim())) {
    		txtPhoneNumber.blur();
			var alertDialog = UI.createAlertDialog({
				title: constant.ALERT.TITLE.DANG_IT,
				message: 'The phone number you entered seems off. Give it another shot'
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
            	action: 'updateProfile',
                userId: Utils.loggedInUserId(),
                username: userDetails.username,
                firstName: txtFirstName.value.trim(),
                lastName: txtLastName.value.trim(),
                state: txtState.value.trim(),
                city: txtCity.value.trim(),
                mobileNumber: txtPhoneNumber.value.trim()
            }
        };
        
    	if(!Utils.areDifferent(_requestArgs.serverArgs, userDetails)) {
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

