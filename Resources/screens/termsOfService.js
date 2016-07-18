exports.get = function(screenType) {
	var mainView = Ti.UI.createView({
		backgroundColor: '#fff',
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		layout: 'vertical'
	}); 
	
	var lblIntroText = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.txtField, {
    	text: 'Terms of service text will go here',
    	top: UI.top(20),
        width: UI.width(260),
    	height: Ti.UI.SIZE,
    	font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT
        },
        color: '#828282'
    }));
	
	var termsOfUseView = UI.createClickableView(Utils._.extend({}, _commonStyle.accordionView, {
		top: UI.top(20)
    }));
    termsOfUseView.url = constant.DOMAIN + 'htmls/termsOfUse.html';
    var lblTermsOfUse = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'General terms & conditions of use',
    	title: 'Terms of Use'
    }));
    var imgRightArrow = Ti.UI.createImageView(_commonStyle.rightArrow);
    termsOfUseView.add(lblTermsOfUse);
    termsOfUseView.add(imgRightArrow);
    
    var returnPolicyView = UI.createClickableView(_commonStyle.accordionView);
    returnPolicyView.url = constant.DOMAIN + 'htmls/returnPolicy.html';
    var lblReturnPolicy = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'Return policy',
    	title: 'Return policy'
    }));
    var imgRightArrow = Ti.UI.createImageView(_commonStyle.rightArrow);
    returnPolicyView.add(lblReturnPolicy);
    returnPolicyView.add(imgRightArrow);
    
    var privacyPolicyView = UI.createClickableView(_commonStyle.accordionView);
    privacyPolicyView.url = constant.DOMAIN + 'htmls/privacyPolicy.html';
    var lblPrivacyPolicy = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'Privacy policy',
    	title: 'Privacy policy'
    }));
    var imgRightArrow = Ti.UI.createImageView(_commonStyle.rightArrow);
    privacyPolicyView.add(lblPrivacyPolicy);
    privacyPolicyView.add(imgRightArrow);
    
    
    mainView.add(lblIntroText);
    mainView.add(termsOfUseView);
    mainView.add(returnPolicyView);
    mainView.add(privacyPolicyView);
    
    
    var _arrViews = [termsOfUseView, returnPolicyView, privacyPolicyView];
    for(var i = 0; i < _arrViews.length; i++) {
    	_arrViews[i].addEventListener('click', function() {
    		var window = Window.create(exitOnClose=false, false, disableClick=true);
			var termDetails = require('/screens/termDetails').get(this.children[0].title, this.url, true);
	        window.add(termDetails.getView());
	        Window.open(window); 
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
