var Window = {};
var _currentWindow;
var _openWindows = [];
var UI = require('/modules/ui');
/*
 * creating a new window
 */

Window.create = function(exitOnClose, toBeOpened, disableClick) {

	var window = Ti.UI.createWindow({
		backgroundColor: '#FFFFFF', // '#E3E3E3',
		tabBarHidden: true,
		navBarHidden: true,
		fullScreen: false,
		exitOnClose: exitOnClose,
		toBeOpened: toBeOpened?true:false
	});
	
	if(osname == 'android') {
		window.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_STATE_HIDDEN;
	}
	
	window.orientationModes = [Ti.UI.PORTRAIT];

	Window.setCurrentWindow(window);
	
	if(!disableClick) {
	    window.addEventListener('click', function() {
	    	// Ti.API.info(constant.APP + " ##################### BLURRING CURRENT TEXTFIELD ON WINDOW CLICK ##################");
      //       UI.currentTextFieldFocused && UI.currentTextFieldFocused.blur();
        });
	}
	
	window.addEventListener('close', function() {
		Window.remove(this.index);
		Window.clearMemory(window);
	});
	
	if(!toBeOpened && osname == 'android') {
		window.addEventListener('android:back', function() {
			Loader.hide();	
			window.close();
			UI.openingModal = false;
    		UI.modalWindowOpen = false;
			Ti.API.info(constant.APP + " ################# android back button clicked #################");
		});
	}
	
	/*
	 * Open event listener
	 */	
	window.addEventListener('open', function() {
		Ti.API.info(constant.APP + " <<<<<<<<<<<<<<<<<<<<<<<<<<< MAIN WINDOW OPENED >>>>>>>>>>>>>>>>>>>>>>>>>>");
		_currentWindow.isBlur = false;		
	});	

	/*
	 * Set current window to currently focused window
	 */	
	window.addEventListener('focus', function(e) {
		Ti.API.info(constant.APP + " <<<<<<<<<<<<<<<<<<<<<<<<<<< MAIN WINDOW FOCUSED >>>>>>>>>>>>>>>>>>>>>>>>>>");
		if(osname == 'android') {
			if(window.wasBlurred) {
				Ti.App.fireEvent('checkAndLoadNotificationView');
				Ti.App.fireEvent('resume', {type: 'resume'});
				window.wasBlurred = false;
			}
		}
		Window.setCurrentWindow(this);
	});	
	
	if(osname == 'android') {
		window.addEventListener('blur', function() {
			window.wasBlurred = true;
		});	
	}
	
	
	return window;
};

/*
 * opening a tab or window depending upon OS
 */
Window.open = function(currentWindow) {
	Ti.API.info(constant.APP + " ##################### BLURRING CURRENT TEXTFIELD ON WINDOW OPEN ##################");
	UI.currentTextFieldFocused && UI.currentTextFieldFocused.blur();
	
	if(!currentWindow.toBeOpened) {
	    currentWindow.index = _openWindows.length;
	    _openWindows.push(currentWindow);
	}
	
	var _openWindowTimeout = setTimeout(function() {
		if(Ti.Platform.osname === 'android') {
			currentWindow.open();
		}
		else {
			Ti.App.currentTab.open(currentWindow);
		}
		clearTimeout(_openWindowTimeout);
		_openWindowTimeout = null;
	}, 100);
};


/*
 * Remove window from opened windows
 */
Window.remove = function(index) {
	_openWindows.splice(index, 1);
	_windowsClosed++;
	
	if(_windowsClosed == _windowsToBeClosed) {
	    Window.allWindowClosed();
	}
};


/*
 * Remove all windows from opened windows
 */
var _windowsToBeClosed;
var _windowsClosed = 0;
var _allWindowsClosedCallback;

Window.closeAll = function(callback) {
    _allWindowsClosedCallback = callback;
    _windowsToBeClosed = _openWindows.length;
    _windowsClosed = 0;
    
    if(_windowsToBeClosed == 0) {
        _allWindowsClosedCallback && _allWindowsClosedCallback();
        _allWindowsClosedCallback = null;
        callback = null;
        return;
    }
    
    if(osname == 'android') {
        for(var i=_openWindows.length-1; i>=0; i--) {
            if(!_openWindows[i].toBeOpened) {
                _openWindows[i].close();
            }
        }   
    }
    else {
        for(var i=0; i<_openWindows.length; i++) {
            if(!_openWindows[i].toBeOpened) {
                _openWindows[i].close();
            }
        }
    }
};


/*
 * All windows closed notifier
 */
Window.allWindowClosed = function() {
    _openWindows = [];
    
    if(_allWindowsClosedCallback) {
        var _closeTimeout = setTimeout(function() {
            _allWindowsClosedCallback();
            clearTimeout(_closeTimeout);
            _closeTimeout = null;
            _allWindowsClosedCallback = null;
        }, 500);
    }
};


/*
 * Set current window
 */
Window.setCurrentWindow = function(window) {
    _currentWindow = window;
};


/*
 * get current window
 */
Window.getCurrentWindow = function() {
    return _currentWindow;
};


/*
 * Get opened  windows length
 */
Window.getOpenedWindowsLength = function() {
    return _openWindows.length;
};


/*
 * Clearing memory on window close
 */
var _clearMemoryTimeout, _viewsToSkip = ['Loader', 'noDataLabel'];

Window.clearMemory = function(parentView, callback) {
    if(callback && _clearMemoryTimeout) {
    	clearTimeout(_clearMemoryTimeout);
    	_clearMemoryTimeout = undefined;
    }
    
    try {
        for (i in parentView.children) {
            var child = parentView.children[0];
            if(_viewsToSkip.indexOf(child.type) == -1) {
            	Window.clearMemory(child, callback);
            	parentView.remove(child);
            	child = null;
            }
        }            		
    }
    catch(e) {
        // Ti.API.info("ERROR OCCURED WHILE CLEARING MEMORY => " + JSON.stringify(e.error));
    }
    
    if(callback) {
        _clearMemoryTimeout = setTimeout(function() {
			callback();
	    	clearTimeout(_clearMemoryTimeout);
	    	_clearMemoryTimeout = undefined;
        }, 1000);
    }
};

Window.sellDetailsSlugs = {};

module.exports = Window;