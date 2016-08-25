exports.get = function() {
    var _style = require('/components/styles/searchBar').get();
    
    var searchCallback;
    
	var mainView = Ti.UI.createView(_style.mainView);	
	var txtSearch = UI.createTextField(_style.txtSearch);

	if(osname === 'android'){
		Ti.API.info(constant.APP + " ############# attaching keyboard focus event for android ##########");
		txtSearch.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	}

	mainView.add(txtSearch);
	
	// if(osname == 'android') txtSearch.top = UI.top(2); 
	
	//	Code required for android
	txtSearch.editable = false;
	setTimeout(function() {
		txtSearch.editable = true;
	}, 1000);
	
	txtSearch.addEventListener('click', function() {
		Ti.API.info(constant.APP + " #################### SEARCH BAR CLICKED ###################");
		UI.currentTextFieldFocused = txtSearch;
	});
	
	txtSearch.addEventListener('focus', function(e) {
		Ti.API.info(constant.APP + " #################### SEARCH BAR FOCUSED ###################");
		UI.currentTextFieldFocused = txtSearch;
		Ti.App.fireEvent('app:searchbarFocus',{type:'add'});
		// txtSearch.fireEvent('click');
	});
	
	txtSearch.addEventListener('blur', function(e) {
		Ti.API.info(constant.APP + " #################### SEARCH BAR BLURED ###################");
		// UI.currentTextFieldFocused = null;
		Ti.App.fireEvent('app:searchbarBlur',{type:'rem'});
	});
	
	txtSearch.addEventListener('return', function() {
		Ti.API.info(constant.APP + " #################### SEARCH BAR RETURNED ###################");
		if((txtSearch.value).trim() == '') {
			return;
		}
		txtSearch.blur();
		Utils._.isFunction(searchCallback) && searchCallback({text: (txtSearch.value).trim()});
	});
	
	var _getView = function(searchTextChangeCallback) {
		/*
		 * Search text change callback if any
		 */
		if(Utils._.isFunction(searchTextChangeCallback)) {
			// btnSeach.addEventListener('click', function() {
				// // if((txtSearch.value).trim() == '') {
					// // alert('Please enter search text');
					// // return;
				// // }
				// if((txtSearch.value).trim() != '' && ((txtSearch.value).trim()).length < 3) {
				    // alert('Search term must be atleast 3 letters');
				    // return;
				// }
				// txtSearch.blur();
				// searchTextChangeCallback({text: ((txtSearch.value).trim()).replace(/ /g, '%20')});
			// });
		}
		
		return mainView;
	};
	
	
	var _setHintText = function(hintText) {
		if(hintText && hintText.trim().length > 0) {
			txtSearch.hintText = hintText.trim();
			Ti.API.info(constant.APP + " ############### SET HINT TEXT TO " + txtSearch.hintText + " #############");
		}
	};
	
	var _setText = function(text) {
		txtSearch.value = text.trim();
		if(txtSearch.value != '' && osname == 'android') {
			txtSearch.setSelection(txtSearch.value.length, txtSearch.value.length);
		}
	};
	
	
	var _setHidden = function(bool) {
		Ti.API.info(constant.APP + " ########################### _setHidden [" + bool + "] ############################");
		mainView.visible = bool?false:true;
		if(!bool) {
			// txtSearch.focus();
		}
		else {
			// Ti.API.info(constant.APP + " ################### BLURING SEARCH BAR #####################");
			txtSearch.blur();
		}
	};
	
	
	var _addEventListener = function(type, listener) {
		switch(type) {
			case 'search':
				searchCallback = listener;
			break;
		}
	};
	
	
	var _removeFromMemory = function() {
		Window.clearMemory(mainView);
		mainView = null;
		transparentView = null;
		searchBar = null;
		imgSearch = null;
		btnSeach = null;
		_getView = null;
		_setHintText = null;
		_setText = null;
		_setHidden = null;
		txtSearch.removeEventListener('focus', function() {
			UI.currentTextFieldFocused = txtSearch;
		});
		txtSearch.removeEventListener('blur', function() {
			UI.currentTextFieldFocused = null;
		});
		txtSearch = null;
		_getTextSearch = null;
		UI.currentTextFieldFocused = null;
		_addEventListener = null;
		searchCallback = null;
		_removeFromMemory = null;
	};
	
	var _getTextSearch = function(){
		if(txtSearch){
			return txtSearch;
		}	
	};

	return {
		getView: _getView,
		getTextSearch: _getTextSearch,
		setHintText: _setHintText,
		setText: _setText,
		setHidden: _setHidden,
		addEventListener: _addEventListener,
		removeFromMemory: _removeFromMemory
	};
};
