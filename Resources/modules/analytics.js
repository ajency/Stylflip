exports.get = function(trackingId) {
    var GA = require('analytics.google');
    GA.dryrun = false;
    GA.optOut = false;
    GA.trackUncaughtExceptions = false;
    var Tracker = GA.getTracker('UA-68636949-2');
    
    var _customDimensions = {
        "1": "",
        "2": ""+Ti.App.version+"",
        "3": ""+Ti.Platform.osname+"",
        "4": ""+Ti.Platform.version+""
    };
    
    /*
     *  Track user
     */
    var _trackUser = function(e) {
        Tracker.setUser({
            userId: e.userId,               // required
            category: Ti.Platform.osname,   // required
            action: "User Sign In"          // required
        });
        _customDimensions["1"] = e.userId;
    };
    
    
    /*
     *  Track screen
     */
    var _trackScreen = function(e) {
        var _data = e;
        if(_customDimensions) {
            _data.customDimension = _customDimensions;
        }
        Tracker.trackScreen(_data);
    };
    
    
    /*
     *  Track API timing
     */
    var _trackTiming = function(e) {
        var _data = e;
        if(_customDimensions) {
            _data.customDimension = _customDimensions;
        }
        Tracker.trackTiming(_data);
    };
    
    
    /*
     *  Track event
     */
    var _trackEvent = function(e) {
        var _data = e;
        if(_customDimensions) {
            _data.customDimension = _customDimensions;
        }
        Tracker.trackEvent(_data);
    };  
    
    
    return {
        trackUser: _trackUser,
        trackScreen: _trackScreen,
        trackTiming: _trackTiming,
        trackEvent: _trackEvent
    };
}; 
    
