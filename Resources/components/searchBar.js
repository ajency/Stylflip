exports.get = function() {
    var _style = require('/components/styles/searchBar').get();
    
    var searchCallback;
    
	var mainView = Ti.UI.createView(_style.mainView);	
	var txtSearch = UI.createTextField(_style.txtSearch);
	mainView.add(txtSearch);
	
	// if(osname == 'android') txtSearch.top = UI.top(2); 
	
	//	Code required for android
	txtSearch.editable = false;
	setTimeout(function() {
		txtSearch.editable = true;
	}, 1000);
	
	txtSearch.addEventListener('click', function() {
		UI.currentTextFieldFocused = txtSearch;
	});
	
	txtSearch.addEventListener('focus', function() {
		UI.currentTextFieldFocused = txtSearch;
	});
	
	txtSearch.addEventListener('blur', function() {
		UI.currentTextFieldFocused = null;
	});
	
	txtSearch.addEventListener('return', function() {
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
		}
	};
	
	
	var _setText = function(text) {
		txtSearch.value = text.trim();
		if(txtSearch.value != '' && osname == 'android') {
			txtSearch.setSelection(txtSearch.value.length, txtSearch.value.length);
		}
	};
	
	
	var _setHidden = function(bool) {
		mainView.visible = bool?false:true;
		if(!bool) {
			txtSearch.focus();
		}
		else {
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
		txtSearch = null;
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
		UI.currentTextFieldFocused = null;
		_addEventListener = null;
		searchCallback = null;
		_removeFromMemory = null;
	};
	
	return {
		getView: _getView,
		setHintText: _setHintText,
		setText: _setText,
		setHidden: _setHidden,
		addEventListener: _addEventListener,
		removeFromMemory: _removeFromMemory
	};
};
