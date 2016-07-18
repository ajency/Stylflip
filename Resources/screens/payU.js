exports.get = function(checkOutDetails, paymentCallback) {
	Analytics.trackScreen({
		screenName: 'PayU'
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
    header.setTitle('Make Payment');
    
    mainView.add(header.getView());
    
    // var _productInfo = 'productTitle='+checkOutDetails.productTitle+'&transactionId='+checkOutDetails.transactionId;
	// _productInfo += '&name ='+checkOutDetails.shippingAddress.firstName+' '+checkOutDetails.shippingAddress.lastName+'&amount='+checkOutDetails.amount;
	// _productInfo += '&email='+checkOutDetails.email+'&transactionId='+checkOutDetails.transactionId+'&phoneNumber='+checkOutDetails.shippingAddress.phoneNumber;
	
	
	var _addPayUView = function() {
		checkOutDetails.transactionId = new Date().getTime();
	
		var _productInfo = [];
		
		for(var _key in checkOutDetails) {
			if(typeof checkOutDetails[_key] == 'object') {
				for(var _nestedKey in checkOutDetails[_key]) {
					_productInfo.push(_nestedKey + '=' + (checkOutDetails[_key][_nestedKey] ? checkOutDetails[_key][_nestedKey] : ''));
				}
			}
			else {
				_productInfo.push(_key + '=' + (checkOutDetails[_key] ? checkOutDetails[_key] : ''));
			}
		}
		
		var webView = Ti.UI.createWebView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			url : constant.DOMAIN + 'payu/pay.php?'+_productInfo.join('&')
		});
		mainView.add(webView);
		
		webView.addEventListener('load', function(e) {
			Loader.hide();
		});
		
		webView.addEventListener('beforeload', function(e) {
			Loader.show();
			
			var _url = e.url.split('/');
	        _url = _url[_url.length-1];
	        _url = _url.split('?');
	        var _params = _url[1];
	        _url = _url[0];
	        
	        if(_url == 'success.php' || _url == 'failure.php') {
	        	_params = _params.split('&');
		        var _responseObj = {}, _tempParam;
		        
		        for(var i = 0; i < _params.length; i++) {
		        	_tempParam = _params[i].split('=');
		        	_responseObj[_tempParam[0]] = _tempParam[1];
		        }
		        
		        Loader.hide();
		        
		        if(_url == 'success.php') {
		        	mainView.remove(webView);
					_addThankYouView();
		        	/*Utils._.isFunction(paymentCallback) && paymentCallback({
		        		success: true,
		        		orderId: _responseObj.orderId
		        		// checkOutDetails: Utils._.extend({}, checkOutDetails, _responseObj)
		        	});*/
		        }
		        else if(_url == 'failure.php') {
		        	Utils._.isFunction(paymentCallback) && paymentCallback({
		        		success: false,
		        		errorMessage: unescape(_responseObj.errorMessage)
		        		// checkOutDetails: Utils._.extend({}, checkOutDetails, _responseObj)
		        	});
		        }
	        }
	    });
	};
	
	
	
	var _addThankYouView = function() {
		header.hideBackButton();
		header.setTitle('Thank You');
		
		var thankYouView = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			layout: 'vertical'
		});
		mainView.add(thankYouView);
		
		var lblOrderPlaced = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'Your order has been placed with StylFlip.',
			left: UI.left(40),
			right: UI.right(40),
			top: UI.top(50),
			font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT,
                fontWeight: 'bold'
           },
			color: '#828282',
			textAlign: 'center'
	    }));
	    var lblOrderPlacedText = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: 'We will keep you posted on its journey at every step of the way.\n\nYou can always track it via the My Orders section in the app or by reaching out to us via a call, e-mail or Whatsapp!\n\nFor more information on orders, please visit our FAQ\'s section',
			left: UI.left(40),
			right: UI.right(40),
			top: UI.top(20),
			font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
           	},
			color: '#757575',
			textAlign: 'center'
	    }));
	    
	    var btnContinueFlippingView = Ti.UI.createView({
	    	width: Ti.UI.FILL,
	    	height: Ti.UI.FILL
	    });
	    var btnContinueFlipping = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
	        title: 'CONTINUE FLIPPING',
	        bottom: UI.bottom(30),
	        width: Ti.UI.FILL
	    }));
	    btnContinueFlippingView.add(btnContinueFlipping);
	    
	    thankYouView.add(lblOrderPlaced);
	    thankYouView.add(lblOrderPlacedText);
	    thankYouView.add(btnContinueFlippingView);
	    
	    btnContinueFlipping.addEventListener('click', function() {
	    	Utils._.isFunction(paymentCallback) && paymentCallback({
	    		success: true
	    	});
	    });
	};
	
	
	_addPayUView();
	
	
    var _getView = function() {
        return mainView;
    };
    
    
    Window.getCurrentWindow().addEventListener('close', function() {
    	_removeFromMemory();
    });
    
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

