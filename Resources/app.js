//	android - com.placard.StylFlip
//	ios		- com.placard.StylFlip

if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
    var osVersion = Ti.Platform.version;
    if(parseInt(osVersion.split('.')[0]) >= 7) {
        var isIOS7Plus = true;
    }
    else {
        var isIOS7Plus = false;
    }
}
else {
    var isIOS7Plus = false;
    // var ImageFactory = require('fh.imagefactory');
}


var osname = Ti.Platform.osname;

var constant = require('/constants').get();

var Cache = require('/modules/cache').get();
var Analytics = require('/modules/analytics').get();
var UI = require('/modules/ui');
var Utils = require('/modules/utils');
var Loader = require('/modules/loader');
var HttpClient = require('/modules/http');
var Window = require('/modules/window');
var ImageEditor = require('/modules/imageEditor');
var Social = require('/modules/social');

var _commonStyle = require('/styles/common').get();

//	Filter selections

var _postedByFilters = [], _sortByFilters = [], _brandsFilters = [], _categoriesFilters = [], _subCategoriesFilters = [], _sizesFilters = [], _conditionsFilters = [], _priceRangeFilters = [];
var _feedFilters, _shopFilters;
var _feedSearchText, _shopSearchText, _socialSearchText, _peopleSearchText, _notificationSearchText;
var _pushItemId = 0;
var _isAppLoaded = false;

var window = Window.create(exitOnClose=true, toBeOpened=true, disableClick=true);

if(Ti.Platform.osname == "android") {
	Window.open(window);	
}
else {
	var tabGroup = Ti.UI.createTabGroup();
	var tab = Ti.UI.createTab({
		window: window
	});
	Ti.App.currentTab = tab;
	tabGroup.addTab(tab);
	tabGroup.open();
	Window.setCurrentWindow(window);	
}

var errorView, _isUserAutoLoggedOut = false;


var _onAppResume = function(e) {
    Ti.API.info(constant.APP + " ##################### RESUMING APP #####################");
    // Ti.API.info(constant.APP + " logged in user: " + Utils.loggedInUserId());
	
    if(!Utils.isUserLoggedIn()) {
		return;
	}
	
    // return here to prevent loading data from server on sizeChart window close
    if(UI.modalWindowOpen){
        UI.modalWindowOpen = false;
        return;
    }

	var type = e.type;
	
	try {
		window.remove(errorView);
	}
	catch(e) {}
	
    if(UI.disableUpdateOnResume){
        // UI.disableUpdateOnResume = false;
        if(UI.firstLogin){
            UI.firstLogin = false;
        }
        else{
            return;
        }
    }

	var _requestArgs = {
        showLoader: true,
        url: 'user.php',
        method: 'post',
        serverArgs: {
        	action: 'isUserActive',
        	userId: Utils.loggedInUserId()
        }
    };
    
    // return;
    /*
     * Hit web service
     */
    Ti.API.info(constant.APP + " ######################## HTTP API CALL ON RESUME ########################");
    HttpClient.getResponse({
        requestArgs: _requestArgs,
        success: function(response) {
            if(response.data.status == 1) {
                if(type == 'open') {
                    if(response.data.username == '' || response.data.email == '') {
                        var editProfile = require('/screens/editProfile').get(undefined, true);
                        window.add(editProfile.getView());
                    }
                    else {
                        var dashboard = require('/screens/dashboard').get();
                        window.add(dashboard.getView());
                    }
                }
            }
            else if(response.data.status == 2) {
                _isUserAutoLoggedOut = true;
                //  account disabled by admin
                if(type == 'open') {
                    var login = require('/screens/login').get();
                    window.add(login.getView());
                }
                else {
                    Window.closeAll(function() {
                        Ti.App.fireEvent('onOptionSelect', {title: 'LOG OUT', key: 'logout'});
                    });
                }
            }
        },
        error: function(error) {
            errorView = UI.createErrorView(error.errorMessage, function() {
                _onAppResume(e);
            }, type == 'resume' ? {backgroundColor: '#fff'} : undefined);
            window.add(errorView);
        }
    });
}; //end _onAppResume

/*
 * If user is already signed in, then goto dashboard screen
 * else login screen
 */
if(Utils.isUserLoggedIn()) {
	_onAppResume({type: 'open'});
}
else {
	// if(Utils.isAppOpenedForTheFirstTime()) {
		var tour = require('/screens/tour').get();
		window.add(tour.getView());
		// Utils.setAppOpenedForTheFirstTime(false);
	// }
	// else {
		// var login = require('/screens/login').get();
		// window.add(login.getView());
	// }
}

Loader.show();

window.addEventListener('open', function() {
	Loader.hide();
});

Ti.App.addEventListener('resume', _onAppResume);
