exports.get = function(checkOutDetails, paymentCallback) {
	Analytics.trackScreen({
		screenName: "Order Summary"
	});
	
	checkOutDetails.tmpAmount = checkOutDetails.amount;

	var _style = require('/styles/myOrders').get();
	
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
	header.setTitle('Order Summary');
    var contentView = Ti.UI.createScrollView(Utils._.extend({}, _commonStyle.contentScrollView, {
    	top: 0,
    	height: Ti.UI.FILL,
        layout: 'vertical'
    }));
	mainView.add(header.getView());
    mainView.add(contentView);

	
	var topView = Ti.UI.createView({
		top: UI.top(10),
		width: UI.width(290),
		height: Ti.UI.SIZE,
		// layout: 'horizontal'
	});
	var imgProduct = Ti.UI.createImageView({
		image: checkOutDetails.productImage,
		left: 0,
		top: 0,
		width: UI.width(130),
		height: UI.height(130)
	});
	
	var productDetailsView = Ti.UI.createView({
		left: UI.left(145),
		top: 0,
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		layout: 'vertical'
	});
	var lblProductTitle = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: checkOutDetails.productTitle,
        top: 0,
        font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT
        },
        color: '#ef4e6d'
    }));
    var lblBrandAndSize = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: checkOutDetails.brand + (checkOutDetails.size ? ' | ' + checkOutDetails.size : ''),
        font: {
            fontSize: UI.fontSize(10),
            fontFamily: constant.FONT.DEFAULT_FONT
        },
    }));
    var lblPrice = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: '\u20B9 ' + checkOutDetails.amount,
        font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT
        },
        color: '#000'
    }));
    var originalPriceView = Ti.UI.createView(_style.originalPriceView);
    // var lblOriginalPrice = UI.createStrikeThroughLabel(Utils._.extend({}, _style.rightViewLabels, {
        // text: '\u20B9 ' + checkOutDetails.originalPrice,
        // top: 0,
		// font: {
            // fontSize: UI.fontSize(10),
            // fontFamily: constant.FONT.DEFAULT_FONT
       	// },
       	// range: {from: 0, to: checkOutDetails.originalPrice}
    // }));
    var lblOriginalPriceView = Ti.UI.createView(Utils._.extend({}, _style.rightViewLabels, {
        top: 0,
        width: Ti.UI.SIZE
    }));
    var lblOriginalPrice = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: '\u20B9 ' + checkOutDetails.originalPrice,
        top: 0,
        width: Ti.UI.SIZE,
		font: {
            fontSize: UI.fontSize(10),
            fontFamily: constant.FONT.DEFAULT_FONT
       	}
    }));
    lblOriginalPriceView.add(lblOriginalPrice);
    lblOriginalPriceView.height = lblOriginalPrice.toImage().height;
    lblOriginalPriceView.width = lblOriginalPrice.toImage().width;
    var lineView = Ti.UI.createView({
    	backgroundColor: '#828282',
    	height: 1,
    	width: Ti.UI.FILL
    });
    lblOriginalPriceView.add(lineView);
    var lblDiscount = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: checkOutDetails.discount + '% off',
        left: UI.left(10),
        top: 0,
        width: Ti.UI.SIZE,
        font: {
            fontSize: UI.fontSize(10),
            fontFamily: constant.FONT.DEFAULT_FONT
        },
        color: '#ef4e6d'
    }));
    originalPriceView.add(lblOriginalPriceView);
    originalPriceView.add(lblDiscount);
    
    var lblSoldBy = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: 'Sold by'
    }));
    
    var sellerProfileView = Ti.UI.createView(Utils._.extend({}, _style.originalPriceView, {
        layout: 'absolute'
    }));
    var imgProfilePic = Ti.UI.createImageView({
    	image: checkOutDetails.sellerProfilePic,
    	left: 0,
    	top: 0,
    	width: UI.width(40),
    	height: UI.height(40),
    	borderRadius: UI.width(20)
    });
    var lblSellerName = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
    	text: checkOutDetails.sellerName,
        left: UI.left(50),
        right: 0,
        top: UI.top(5),
        height: UI.height(14), // UI.height(16),
        font: {
            fontSize: UI.fontSize(14),
            fontFamily: constant.FONT.ABEATBYKAI
        },
        color: '#eb5783'
    }));
    var lblSellerLocation = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
    	text: checkOutDetails.sellerLocation,
        left: UI.left(50),
        right: 0,
        top: UI.top(25)
    }));
    sellerProfileView.add(imgProfilePic);
    sellerProfileView.add(lblSellerName);
    sellerProfileView.add(lblSellerLocation);
   
    productDetailsView.add(lblProductTitle);
	productDetailsView.add(lblBrandAndSize);
	productDetailsView.add(lblPrice);
	productDetailsView.add(originalPriceView);
	productDetailsView.add(lblSoldBy);
	productDetailsView.add(sellerProfileView);
	
	topView.add(imgProduct);
	topView.add(productDetailsView);
	
	contentView.add(topView);

	
	var lastOpenedContentsView, lastOpenedContentViewIndex = -1, lastRightButton;
	var _arrAccordionButtons = [];

	/*
	 * Price Details View
	 */
	var btnViewPriceDetails = UI.createClickableView(Utils._.extend({}, _commonStyle.accordionView, {
    	top: UI.top(20)
    }));
    var lblViewPriceDetails = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'View Price Details',
    	left: UI.left(15)
    }));
    var btnExpandCollapse = UI.createButton(Utils._.extend({}, _commonStyle.expandButton, {
    	title: '+',
    	right: UI.right(20)
    }));
    btnViewPriceDetails.add(lblViewPriceDetails);
    btnViewPriceDetails.add(btnExpandCollapse);
    
    contentView.add(btnViewPriceDetails);  
    
    var priceDetailsView = Ti.UI.createView({
    	width: Ti.UI.FILL,
    	height: 0,
    	layout: 'vertical'
    });
    
    btnViewPriceDetails.contentsView = priceDetailsView;
    _arrAccordionButtons.push(btnViewPriceDetails);
    
    contentView.add(priceDetailsView);
    
    
    var lblSellingPrice = Ti.UI.createLabel({
    	text: '\u20B9 ' + checkOutDetails.amount + '/-',
    	left: UI.left(15),
    	right: UI.right(15),
    	top: UI.top(10),
    	height: Ti.UI.SIZE,
    	font: {
            fontSize: UI.fontSize(14),
            fontFamily: constant.FONT.DEFAULT_FONT,
            fontWieght: 'bold'
        },
		color: '#000'
    });
    
    var priceContainerView = Ti.UI.createView({
    	left: UI.left(15),
    	right: UI.right(15),
    	top: UI.top(10),
    	bottom: UI.bottom(10),
    	height: osname == 'android' ? UI.height(100) : Ti.UI.SIZE,
    	layout: 'horizontal'
    });
    var leftPriceView = Ti.UI.createView({
    	left: 0,
    	top: 0,
    	width: Ti.UI.SIZE,
    	height: Ti.UI.SIZE,
    	layout: 'vertical'
    });
    var lblDisplayPriceValue = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: '\u20B9 ' + checkOutDetails.amount + '/-',
        top: 0,
        width: Ti.UI.SIZE
    }));
    var lblCouponDiscountValue = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: '- NA -', // '\u20B9 200/- (10%)',
        top: UI.top(10),
        width: Ti.UI.SIZE
    }));
    var lblTaxesValue = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: checkOutDetails.taxes ? checkOutDetails.taxes : '- NA -',
        top: UI.top(10),
        width: Ti.UI.SIZE
    }));
    var lblShippingFeeValue = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: parseInt(checkOutDetails.amount) < 2000 ? '\u20B9 120' : 'Free',
        top: UI.top(10),
        width: Ti.UI.SIZE
    }));
    var lblCODValue = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: '\u20B9 85',
        top: UI.top(10),
        width: Ti.UI.SIZE
    }));
    leftPriceView.add(lblDisplayPriceValue);
    leftPriceView.add(lblCouponDiscountValue);
    leftPriceView.add(lblTaxesValue);
    leftPriceView.add(lblShippingFeeValue);
    
    var rightPriceView = Ti.UI.createView({
    	left: UI.left(10),
    	top: 0,
    	width: Ti.UI.FILL,
    	height: Ti.UI.SIZE,
    	layout: 'vertical'
    });
    var lblDisplayPriceText = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: 'Display Price',
        top: 0,
        width: Ti.UI.SIZE
    }));
    var lblCouponDiscountText = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: 'Coupon Discount',
        top: UI.top(10),
        width: Ti.UI.SIZE
    }));
    var lblTaxesText = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: 'Taxes (included)',
        top: UI.top(10),
        width: Ti.UI.SIZE
    }));
    var lblShippingFeeText = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: 'Shipping & Handling (included)',
        top: UI.top(10),
        width: Ti.UI.SIZE
    }));
    var lblCODText = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
        text: 'Cash-on-Delivery convenience fee',
        top: UI.top(10),
        width: Ti.UI.SIZE
    }));
    rightPriceView.add(lblDisplayPriceText);
    rightPriceView.add(lblCouponDiscountText);
    rightPriceView.add(lblTaxesText);
    rightPriceView.add(lblShippingFeeText);
    
    priceContainerView.add(leftPriceView);
    priceContainerView.add(rightPriceView);
    
    priceDetailsView.add(lblSellingPrice);
    priceDetailsView.add(priceContainerView);
    
    
    /*
     * Shipping Address View
     */
	var btnShippingAddress = UI.createClickableView(_commonStyle.accordionView);
    var lblShippingAddress = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'Shipping Address',
    	left: UI.left(15)
    }));
    var btnExpandCollapse = UI.createButton(Utils._.extend({}, _commonStyle.expandButton, {
    	title: '+',
    	right: UI.right(20)
    }));
    btnShippingAddress.add(lblShippingAddress);
    btnShippingAddress.add(btnExpandCollapse);
    
    contentView.add(btnShippingAddress);  
    
    var shippingAddressView = Ti.UI.createView({
    	width: Ti.UI.FILL,
    	height: 0,
    	bottom: 0,
    	layout: 'vertical'
    });
    
    btnShippingAddress.contentsView = shippingAddressView;
    _arrAccordionButtons.push(btnShippingAddress);
    
    contentView.add(shippingAddressView);
    
    var lblBuyerName = Ti.UI.createLabel({
    	text: checkOutDetails.shippingAddress.firstName + ' ' + checkOutDetails.shippingAddress.lastName,
    	left: UI.left(15),
    	right: UI.right(15),
    	top: UI.top(10),
    	height: Ti.UI.SIZE,
    	font: {
            fontSize: UI.fontSize(14),
            fontFamily: constant.FONT.DEFAULT_FONT
        },
		color: '#000'
    });
    var lblAddress = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
    	text: checkOutDetails.shippingAddress.addressTitle + ' | ' + checkOutDetails.shippingAddress.phoneNumber + '\n' + checkOutDetails.shippingAddress.addressLine1 + '\n' + checkOutDetails.shippingAddress.addressLine2 + '\n' + checkOutDetails.shippingAddress.landmark + '\n' + checkOutDetails.shippingAddress.state + ', ' + checkOutDetails.shippingAddress.city +', ' + checkOutDetails.shippingAddress.postCode + '.',
    	left: UI.left(15),
    	top: UI.top(10),
    	bottom: UI.bottom(10)
    }));
    shippingAddressView.add(lblBuyerName);
    shippingAddressView.add(lblAddress);
    
    /*
     * Coupon View
     */
	var btnCoupon = UI.createClickableView(_commonStyle.accordionView);
    var lblCoupon = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
    	text: 'Apply Coupon',
    	left: UI.left(15)
    }));
    var btnExpandCollapse = UI.createButton(Utils._.extend({}, _commonStyle.expandButton, {
    	title: '+',
    	right: UI.right(20)
    }));
    btnCoupon.add(lblCoupon);
    btnCoupon.add(btnExpandCollapse);
    
    contentView.add(btnCoupon);  
    
    var couponView = Ti.UI.createView({
    	width: Ti.UI.FILL,
    	height: 0,
    	bottom: UI.bottom(10),
    	layout: 'horizontal'
    });
    
    btnCoupon.contentsView = couponView;
    _arrAccordionButtons.push(btnCoupon);
    
    contentView.add(couponView);
	
	var txtCouponCode = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
        left: UI.left(15),
        top: UI.top(10),
        width: UI.width(145),
        hintText: 'enter coupon code',
        textAlign: 'center',
        maxLength: 10,
        borderColor: '#bfbfbf',
        borderWidth: 1
    }));
    var btnApplyCouponCode = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: ' APPLY ',
        left: UI.left(15),
        right: UI.right(15),
        top: UI.top(10)
    }));
    var lblAddress = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
    	text: 'Address title | phone number\nAddress line 1\nAddress line 2\nLandmark\nState, City, Postcode.',
    	left: UI.left(15),
    	top: UI.top(10)
    }));
    var lblCouponCodeApplied = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
    	text: '* Coupon Code Successfully Applied. View Price Details to Confirm.',
    	left: UI.left(20),
    	right: UI.right(20),
    	top: UI.top(10),
    	visible: false
    }));
    couponView.add(txtCouponCode);
    couponView.add(btnApplyCouponCode);
    couponView.add(lblCouponCodeApplied);
    
    btnApplyCouponCode.addEventListener('click', function() {
    	txtCouponCode.blur();
    	if(txtCouponCode.value.trim() == '') {
    		var alertDialog = UI.createAlertDialog({
				title: constant.ALERT.TITLE.FAUX_PAS,
				message: 'Please enter coupon code'
			});
			alertDialog.show();
			alertDialog.addEventListener('hide', function() {
				txtCouponCode.focus();
				alertDialog = null;
			});
			return;
    	}
    	// if(txtCouponCode.value.trim() != 'STYL10') {
    		// var alertDialog = UI.createAlertDialog({
				// title: constant.ALERT.TITLE.FAUX_PAS,
				// message: 'The coupon code entered seems to be invalid.'
			// });
			// alertDialog.show();
			// alertDialog.addEventListener('hide', function() {
				// txtCouponCode.focus();
				// alertDialog = null;
			// });
			// return;
    	// }
    	
    	var _requestArgs = {
            showLoader: true,
            url: 'product.php',
            method: 'post',
            serverArgs: {
            	action: 'getCouponDiscountByCode',
                couponCode: txtCouponCode.value.trim(),
                userId: Utils.loggedInUserId()
            }
        };
        
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
        		if(parseFloat(response.data.discount) > 0) {
        			switch(response.data.discountType) {
	        			case 'percent':
		        			lblCouponDiscountText.color = '#eb5783';
					    	txtCouponCode.borderColor = '#ef4e6d';
					    	txtCouponCode.editable = false;
					    	var _couponDiscountPercentage = parseFloat(response.data.discount);
					    	var _couponDiscountPrice = ((parseInt(checkOutDetails.tmpAmount) * _couponDiscountPercentage) / 100);
					    	lblSellingPrice.text = '\u20B9 ' + ((checkOutDetails.tmpAmount - _couponDiscountPrice) + (checkOutDetails.cashOnDelivery ? 85 : 0)) + '/-';
					    	lblCouponDiscountValue.text = '\u20B9 ' + _couponDiscountPrice  + '/- (' + _couponDiscountPercentage + '%)';
					    	checkOutDetails.amount = (checkOutDetails.tmpAmount - _couponDiscountPrice) + (checkOutDetails.cashOnDelivery ? 85 : 0);
					    	checkOutDetails.couponCode = txtCouponCode.value.trim();
					    	lblCouponCodeApplied.visible = true;
					    	btnCoupon.children[0].text = 'Coupon Applied';
					    	UI.disableButton(btnApplyCouponCode);
	        			break;
	        			
	        			case 'flat':
	        				lblCouponDiscountText.color = '#eb5783';
					    	txtCouponCode.borderColor = '#ef4e6d';
					    	txtCouponCode.editable = false;
					    	var _couponDiscountPrice = parseFloat(response.data.discount);
					    	lblSellingPrice.text = '\u20B9 ' + ((checkOutDetails.tmpAmount - _couponDiscountPrice) + (checkOutDetails.cashOnDelivery ? 85 : 0)) + '/-';
					    	lblCouponDiscountValue.text = '\u20B9 ' + _couponDiscountPrice  + '/- (\u20B9 ' + _couponDiscountPrice + ')';
					    	checkOutDetails.amount = (checkOutDetails.tmpAmount - _couponDiscountPrice);
					    	checkOutDetails.amount = (checkOutDetails.amount < 0 ? 0 : checkOutDetails.amount) + (checkOutDetails.cashOnDelivery ? 85 : 0);
					    	checkOutDetails.couponCode = txtCouponCode.value.trim();
					    	lblCouponCodeApplied.visible = true;
					    	btnCoupon.children[0].text = 'Coupon Applied';
					    	UI.disableButton(btnApplyCouponCode);
	        			break;
	        		}
        		}
        		else {
        			var alertDialog = UI.createAlertDialog({
						title: constant.ALERT.TITLE.FAUX_PAS,
						message: 'The coupon code entered seems to be invalid.'
					});
					alertDialog.show();
					alertDialog.addEventListener('hide', function() {
						txtCouponCode.focus();
						alertDialog = null;
					});
        		}
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
    
    
    for(var i=0; i<_arrAccordionButtons.length; i++) {
    	_arrAccordionButtons[i].index = i;
    	_arrAccordionButtons[i].addEventListener('click', function() {
	    	txtCouponCode.blur();
	    	
	    	if(lastOpenedContentsView) {
	    		lastOpenedContentsView.height = 0;
	    		lastRightButton.title = '+';
	    	}
	    	
	    	if(lastOpenedContentViewIndex > -1 && lastOpenedContentViewIndex == this.index) {
	    		lastOpenedContentsView = undefined;
	    		lastOpenedContentViewIndex = -1;
	    	}
	    	else {
	    		this.contentsView.height = Ti.UI.SIZE;
	    		lastOpenedContentsView = this.contentsView;
	    		lastOpenedContentViewIndex = this.index;
	    		lastRightButton = this.children[1];
	    		lastRightButton.title = '-';
	    	}
	    });
    }
    

	// var btnPlaceOrder = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        // title: ' PLACE MY ORDER ',
        // top: UI.top(10),
        // bottom: UI.bottom(20),
        // width: Ti.UI.FILL
    // }));
    // contentView.add(btnPlaceOrder);
    
	var btnPayNow = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: ' PAY NOW ',
        top: UI.top(10),
        width: Ti.UI.FILL
    }));
    var btnCOD = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: ' CASH ON DELIVERY ',
        top: UI.top(10),
        bottom: UI.bottom(10),
        width: Ti.UI.FILL
    }));
    contentView.add(btnPayNow);
    contentView.add(btnCOD);
    
    
    btnPayNow.addEventListener('click', function() {
    	var window = Window.create(exitOnClose=false, false, disableClick=true);
		var payU = require('/screens/payU').get(checkOutDetails, paymentCallback);
        window.add(payU.getView());
        Window.open(window); 
    });
    
    btnCOD.addEventListener('click', function() {
    	if(this.title.toLowerCase().trim() == 'cash on delivery') {
    		var alertDialog = UI.createAlertDialog({
	    		title: 'Alert!',
	    		message: 'A convenience fee of Rs. 85 will be added to your total bill for Cash-on-Delivery.',
	    		buttonNames: ['Ok', 'Cancel']
	    	});
	    	alertDialog.show();
	    	alertDialog.addEventListener('click', function(e) {
	    		if(e.index == 0) {
	    			contentView.remove(btnPayNow);
	    			btnCOD.title = ' PLACE MY ORDER ';
	    			leftPriceView.add(lblCODValue);
	    			rightPriceView.add(lblCODText);
	    			if(osname == 'android') {
	    				priceContainerView.height = priceContainerView.height + UI.height(25);
	    			}
    				lblSellingPrice.text = '\u20B9 ' + (parseFloat(checkOutDetails.amount) + 85) + '/-';
    				checkOutDetails.amount = parseFloat(checkOutDetails.amount) + 85;
    				checkOutDetails.cashOnDelivery = true;
	    		}
	    		alertDialog = null;
	    	});
    	}
    	else {
    		if(!Utils.isValidPincodeForCOD(checkOutDetails.shippingAddress.postCode)) {
    			var alertDialog = UI.createAlertDialog({
		    		title: constant.ALERT.TITLE.FAUX_PAS,
		    		message: 'Cash-on-Delivery option is not available for selected pin code.'
		    	});
		    	alertDialog.show();
	    		alertDialog = null;
	    		return;
    		}
    		var window = Window.create(exitOnClose=false, false, disableClick=true);
			var payU = require('/screens/payU').get(checkOutDetails, paymentCallback);
	        window.add(payU.getView());
	        Window.open(window); 
    	}
    });


	Window.getCurrentWindow().addEventListener('close', function() {
		checkOutDetails.amount = checkOutDetails.tmpAmount;
		delete checkOutDetails.cashOnDelivery;
		delete checkOutDetails.couponCode;
	});

	
    var _getView = function() {
        Utils.trackScreen('ordersummary');
    	return mainView;
    };
    
    
    var _removeFromMemory = function() {
    	
    };
    
	return {
		getView: _getView,
		removeFromMemory: _removeFromMemory
	};
};

