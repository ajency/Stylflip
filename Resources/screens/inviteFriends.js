exports.get = function(screenType) {
	var mainView = Ti.UI.createScrollView({
		backgroundColor: '#fff',
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		contentWidth: Ti.UI.FILL,
		contentHeight: 'auto',
		showVerticalScrollIndicator: true,
		layout: 'vertical'
	}); 
	
	var lblIntroText = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'Shopping is always better with friends. Invite them to check out StylFlip',
    	right: UI.right(10),
    	top: UI.top(20),
    	height: Ti.UI.SIZE
    }));
	
	var lblSendToFriends = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'SEND TO FRIENDS',
    	top: UI.top(40),
    	height: Ti.UI.SIZE,
    	font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT
        }
    }));
	var SMSView = UI.createClickableView(Utils._.extend({}, _commonStyle.accordionView, {
		top: UI.top(10)
    }));
    SMSView.type = 'sms';
    var lblSMS = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'SMS'
    }));
    var imgRightArrow = Ti.UI.createImageView(_commonStyle.rightArrow);
    SMSView.add(lblSMS);
    SMSView.add(imgRightArrow);
    
    var emailView = UI.createClickableView(_commonStyle.accordionView);
    emailView.type = 'email';
    var lblEmail = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'E-mail'
    }));
    var imgRightArrow = Ti.UI.createImageView(_commonStyle.rightArrow);
    emailView.add(lblEmail);
    emailView.add(imgRightArrow);
    
    var lblSocial = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'SOCIAL',
    	top: UI.top(20),
    	height: Ti.UI.SIZE,
    	font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT
        }
    }));
    var whatsAppView = UI.createClickableView(Utils._.extend({}, _commonStyle.accordionView, {
		top: UI.top(10)
    }));
    whatsAppView.type = 'whatsApp';
    var lblWhatsApp = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'WhatsApp'
    }));
    var imgRightArrow = Ti.UI.createImageView(_commonStyle.rightArrow);
    whatsAppView.add(lblWhatsApp);
    whatsAppView.add(imgRightArrow);
    
	var fbView = UI.createClickableView(_commonStyle.accordionView);
    fbView.type = 'facebook';
    var lblFB = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'Facebook'
    }));
    var imgRightArrow = Ti.UI.createImageView(_commonStyle.rightArrow);
    fbView.add(lblFB);
    fbView.add(imgRightArrow);
   
   	var twitterView = UI.createClickableView(_commonStyle.accordionView);
    twitterView.type = 'twitter';
    var lblTwitter = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'Twitter'
    }));
    var imgRightArrow = Ti.UI.createImageView(_commonStyle.rightArrow);
    twitterView.add(lblTwitter);
    twitterView.add(imgRightArrow);
    
    mainView.add(lblIntroText);
    mainView.add(lblSendToFriends);
    mainView.add(SMSView);
    mainView.add(emailView);
    mainView.add(lblSocial);
    mainView.add(whatsAppView);
    mainView.add(fbView);
    mainView.add(twitterView);
    
    var _arrViews = [SMSView, emailView, whatsAppView, fbView, twitterView];
    for(var i = 0; i < _arrViews.length; i++) {
    	_arrViews[i].addEventListener('click', function() {
    		switch(this.type) {
    			case 'sms':
    				Social.shareViaSMS(constant.TEXT.INVITE_TEXT);
    			break;
    			
    			case 'email':
    				Social.shareViaEmail({
    					subject: 'Shop with me on StylFlip',
    					body: constant.TEXT.INVITE_TEXT
    				});
    			break;
    			
    			case 'whatsApp':
    				Social.shareOnWhatsApp(constant.TEXT.INVITE_TEXT);
    			break;
    			
    			case 'facebook':
    				var fbShareButton = this;
    				// UI.disableView(fbShareButton);
    				// Social.shareOnfacebook(constant.TEXT.INVITE_TEXT, function(e) {
					Social.shareOnfacebook({
						link: constant.TEXT.INVITE_LINK,
						caption: 'Sell your closet and Flaunt your style.',
						description: "For fashionable women who have closets full and yet nothing to wear, StylFlip is a social platform to sell, shop and flaunt your branded pre-owned fashion. Download the app and Join me on StylFlip today.",
						picture: 'http://stylflip.com/stylflip/fb/Share-App-Image.jpg'
					}, function(e) {
    					// Loader.hide();
    					if(e.success) {
    						var alertDialog = UI.createAlertDialog({
	    						title: constant.ALERT.TITLE.SUCCESS,
	    						message: 'Invitation has been successfully sent on Facebook wall.',
	    						buttonNames: ['Dismiss']
	    					});
	    					alertDialog.show();
    						alertDialog = null;
    					}
    					else {
    						if(e.errorMessage != '') {
    							var alertDialog = UI.createAlertDialog({
		    						title: e.errorTitle,
		    						message: e.errorMessage,
		    						buttonNames: ['Dismiss']
		    					});
		    					alertDialog.show();
	    						alertDialog = null;
    						}
    					}
    					UI.enableView(fbShareButton);
    				});
    			break;
    			
    			case 'twitter':
    				var twitterShareButton = this;
    				Social.shareOnTwitter({
    					text: constant.TEXT.INVITE_TEXT
    				}, function(e) {
    					if(e.success) {
    						var alertDialog = UI.createAlertDialog({
	    						title: constant.ALERT.TITLE.SUCCESS,
	    						message: 'Invitation has been successfully sent on Twitter.',
	    						buttonNames: ['Dismiss']
	    					});
    					}
    					else {
    						var alertDialog = UI.createAlertDialog({
	    						title: e.errorTitle,
	    						message: e.errorMessage,
	    						buttonNames: ['Dismiss']
	    					});
    					}
    					alertDialog.show();
    					alertDialog = null;
    					UI.enableView(twitterShareButton);
    				});
    			break;
    		}
    	});
    }
	
    
    var _getView = function() {
        return mainView;
    };
    
    var _removeFromMemory = function() {
    	_style = null;
        Window.clearMemory(mainView);
        mainView = null;
        _getView = null;
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        removeFromMemory: _removeFromMemory
    };
};
