/*global Ti: true, require: true */

(function (service) {

	var serviceIntent = service.getIntent(),
	title = serviceIntent.hasExtra('title') ? serviceIntent.getStringExtra('title') : '',
	statusBarMessage = serviceIntent.hasExtra('message') ? serviceIntent.getStringExtra('message') : '',
	message = serviceIntent.hasExtra('message') ? serviceIntent.getStringExtra('message') : '',
	notificationId = (function () {
		// android notifications ids are int32
		// java int32 max value is 2.147.483.647, so we cannot use javascript millis timpestamp
		// let's make a valid timed based id:

		// - we're going to use hhmmssDYLX where (DYL=DaysYearLeft, and X=0-9 rounded millis)
		// - hh always from 00 to 11
		// - DYL * 2 when hour is pm
		// - after all, its max value is 1.159.597.289

		var str = '',
		now = new Date();

		var hours = now.getHours(),
		minutes = now.getMinutes(),
		seconds = now.getSeconds();
		str += (hours > 11 ? hours - 12 : hours) + '';
		str += minutes + '';
		str += seconds + '';

		var start = new Date(now.getFullYear(), 0, 0),
		diff = now - start,
		oneDay = 1000 * 60 * 60 * 24,
		day = Math.floor(diff / oneDay); // day has remaining days til end of the year
		str += day * (hours > 11 ? 2 : 1);

		var ml = (now.getMilliseconds() / 100) | 0;
		str += ml;

		return str | 0;
	})();
	
	/*
	 * Code to determine if the particular screen to be opened
	 */
	var pendingDataObj = {};
	if(serviceIntent.hasExtra('itemId')) {
		pendingDataObj.itemId = serviceIntent.getStringExtra('itemId');
	}
	if(serviceIntent.hasExtra('screen')) {
		pendingDataObj.screen = serviceIntent.getStringExtra('screen');
	}
		
	// create launcher intent
	var ntfId = Ti.App.Properties.getInt('ntfId', 0),
	// launcherIntent = Ti.Android.createIntent({
		// className: 'net.iamyellow.gcmjs.GcmjsActivity',
		// action: 'action' + ntfId, // we need an action identifier to be able to track click on notifications
		// packageName: Ti.App.id,
		// flags: Ti.Android.FLAG_ACTIVITY_NEW_TASK | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
	// });
	launcherIntent = Ti.Android.createIntent({
		action : Ti.Android.ACTION_MAIN,
        className : Ti.App.id + '.StylflipActivity',
		packageName: Ti.App.id,
		flags: Ti.Android.FLAG_ACTIVITY_NEW_TASK | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
	});
	launcherIntent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
	launcherIntent.putExtra("ntfId", ntfId);
    launcherIntent.putExtra('pendingData', JSON.stringify(pendingDataObj));
	
	Ti.App.Properties.setObject('pendingData', pendingDataObj);
	
	// increase notification id
	ntfId += 1;
	Ti.App.Properties.setInt('ntfId', ntfId);

	// create notification
	var pintent = Ti.Android.createPendingIntent({
		intent: launcherIntent
	}),
	notification = Ti.Android.createNotification({
		contentIntent: pintent,
		contentTitle: title,
		contentText: message,
		tickerText: statusBarMessage,
		icon: Ti.App.Android.R.drawable.appicon,
		// icon: Ti.App.Android.R.drawable.notificationicon,
		flags: Ti.Android.FLAG_AUTO_CANCEL | Ti.Android.FLAG_SHOW_LIGHTS
	});
	Ti.Android.NotificationManager.notify(notificationId, notification);

	service.stop();

})(Ti.Android.currentService);