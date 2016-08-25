exports.get = function(tabSelected, productId, callback, canBeEdited, productData) {
	Analytics.trackScreen({
		screenName: 'Product Details'
	});
	
	var _style = require('/styles/productDetails').get();
	
	var _userId = canBeEdited && canBeEdited.userId;
	
	var mainView = Ti.UI.createView({
	    width: Ti.UI.FILL,
	    height: Ti.UI.FILL,
	    layout: 'vertical'
	});
	
	if(Utils.getPushItemId() == 0) {
		var header = require('/components/header').get({
			showMenu: false,
	    	enableButtons: false,
	    	enableBackButton: true
		});
	    header.enableFilter(false);
	    header.enableSearch(false);
	}
    
    var contentView = Ti.UI.createScrollView(Utils._.extend({}, _commonStyle.contentScrollView, {
    	top: 0,
    	bottom: 0,
        layout: 'vertical'
    }));
    var footer = require('/components/footer').get(defaultSelectedTab=tabSelected, subTab=true);
    
    if(Utils.getPushItemId() == 0) {
    	mainView.add(header.getView());
    }
    mainView.add(contentView);
    if(Utils.getPushItemId() == 0) {
    	mainView.add(footer.getView());
    }
    
	/*
	 * Load other user's profile
	 */
	var _loadUserProfile = function(userId) {
		if(userId == Utils.loggedInUserId()) {
    		return;
    	}
        var window = Window.create(exitOnClose=false);
    	var userProfile = require('/screens/stylefile').get(tabSelected, userId);
	 	window.add(userProfile.getView());
        Window.open(window);
	};
    
	var _sizeChart, _size, _productHeight, _productLength, _brand;

    var _loadProductDetails = function(productData) {
    	// Ti.API.info(constant.APP + " productDetails _loadProductDetails init ");
    	Ti.API.info(constant.APP + " ########### _loadProductDetails productData.isLiked: " + productData.isLiked + " productData.likes: " + productData.likes);

    	_sizeChart = productData && productData.sizeChart ? productData.sizeChart : '';
		_size = productData && productData.size ? productData.size : '';
		_productHeight = productData && productData.height ? productData.height : '';
		_productLength = productData && productData.length ? productData.length : '';
		_productBrand = productData && productData.brand ? productData.brand : '';

		Ti.API.info(constant.APP + " ############## _sizeChart: " + _sizeChart);
		Ti.API.info(constant.APP + " ############## _size: " + _size);
		Ti.API.info(constant.APP + " ############## _productBrand: " + _productBrand);
		Ti.API.info(constant.APP + " ############## _productHeight: " + _productHeight);
		Ti.API.info(constant.APP + " ############## _productLength: " + _productLength);
		
    	productData.isToBeDonated = productData.isToBeDonated==1||productData.isToBeDonated==true;
    	productData.isPurchased = productData.isPurchased==1||productData.isPurchased==true;
		var lblStatus = Ti.UI.createLabel(Utils._.extend({}, _style.lblStatus, {
			text: productData.productTitle
	    }));
		var profileView = Ti.UI.createView(_style.profileView);
		profileView.userId = productData.userId;
		var imgProfilePic = UI.createRoundedImageView(Utils._.extend({}, _style.imgProfilePic, {
			image: Utils.getProfileImageURL(tabSelected == 'sell' ? '' : productData.profilePicURL),
	    }));
		var lblUsername = Ti.UI.createLabel(Utils._.extend({}, _style.lblUsername, {
			text: productData.username == '' ? 'Anonymous' : productData.username
	    }));
		var lblTimeAndLocation = Ti.UI.createLabel(Utils._.extend({}, _style.lblTimeAndLocation, {
			text: (productData.timestamp?productData.timestamp:'-') // + ' | ' + (productData.userLocation?productData.userLocation:'-')
	    }));
	    if(canBeEdited && canBeEdited.editableDeletable && productData.userId == Utils.loggedInUserId() && !productData.isPurchased) {
    	    var btnEditDeleteProductDetails = UI.createClickableView({
		    	top: UI.top(10),
				right: UI.right(10),
		    	width: UI.width(35),
		    	height: UI.height(35)
		    });

    	    var menuButton = Ti.UI.createImageView(Utils._.extend({},_commonStyle.menuButton,{
		    	top: UI.top(0),
				right: UI.right(0)
		    }));

    	    btnEditDeleteProductDetails.add(menuButton);

	   //  	var btnEditDeleteProductDetails = UI.createButton(Utils._.extend({}, _commonStyle.menuButton, {
				// top: UI.top(10),
				// right: UI.right(10),
				// width: UI.width(15),
				// height: UI.height(15)
		  //   }));
	    }
	    else if(productData.isToBeDonated) {
	    	var btnDonateView = Ti.UI.createView(Utils._.extend({}, _style.btnDonateView, {
				top: UI.top(10),
				right: UI.right(10)
		    }));
		    var btnDonate = UI.createButton(_style.btnDonate);
		    btnDonateView.add(btnDonate);
	    }
	    profileView.add(imgProfilePic);
	    profileView.add(lblUsername);
	    profileView.add(lblTimeAndLocation);
	    if(canBeEdited && canBeEdited.editableDeletable && productData.userId == Utils.loggedInUserId()) {
	    	profileView.add(btnEditDeleteProductDetails);
	    	
	    	btnEditDeleteProductDetails.addEventListener('click', function(e) {
	    		var _arrOptions;
	    		productData.isPurchased = productData.isPurchased == 1 ? true : false;
	    		// if(productData.isPurchased) {
	    			// _arrOptions = ['Delete'];
	    		// }
	    		// else {
	    			_arrOptions = ['Edit', 'Delete'];
	    		// }
				var optionsView = require('/components/popOver').get({
					optionStyle: {
		    			backgroundColor: '#fff',
		    			// borderColor: '#bfbfbf',
		    			// borderWidth: 1
		    		},
		    		width: UI.width(80),
		    		height: UI.height(80),
		    		sourceView: this,
		    		options: _arrOptions,
		    		borderColor: '#bfbfbf',
	    			borderWidth: 1
		    	});
		    	optionsView.show();
		    	optionsView.addEventListener('click', function(e) {
		    		optionsView.hide();
		    		switch(e.index) {
		    			case 0:
		    				//for(var photo in productData.data.photos) {
		    				// 	productData.data.photos[photo] = 
		    				//}
		    				productData.brandName = productData.brand;
		    				var window = Window.create(exitOnClose=false);
					    	var sell = require('/screens/sell').get(tabSelected, undefined, {
					    		data: productData,
					    		onUpdate: canBeEdited.onUpdate
					    	});
						 	window.add(sell.getView());
					        Window.open(window);
		    			break;
		    			
		    			case 1:
		    				var alertDialog = UI.createAlertDialog({
				                title: constant.ALERT.TITLE.CONFIRM_DELETE,
				                message: 'Are you sure you want to delete this listing from the shop?',
				                buttonNames: ['yes', 'no']
				            });    
				            alertDialog.show();
				            alertDialog.addEventListener('click', function(e) {
				            	if(e.index == 0) {
				            		var _requestArgs = {
								        showLoader: true,
								        url: 'product.php',
								        method: 'post',
								        serverArgs: {
								        	action: 'deleteProduct',
								            userId: Utils.loggedInUserId(),
								            productId: productId 
								        }
								    };
								    
								    /*
								     * Hit web service
								     */
								    HttpClient.getResponse({
								    	requestArgs: _requestArgs,
								    	success: function(response) {
								            if(response.data.status == '1') {
								            	Window.closeAll(function() {
								            		canBeEdited.onDelete();
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
				            	}
				            	alertDialog = null;
				            });
		    			break;
		    		}
		    	});
	    	});
	    }
	    else if(productData.isToBeDonated) {
	    	profileView.add(btnDonateView);
	    }
	    
    	profileView.addEventListener('click', function() {
    		if(productId == undefined || productId == null) {
    			return;
    		}
    		if(_userId != undefined && _userId == productData.userId) {
    			Window.getCurrentWindow().close();
    		}
    		else {
    			_loadUserProfile(this.userId);
    		}
	    });
	    
	    var imgProductView = Ti.UI.createView(Utils._.extend({}, _style.imgProduct, {
	    	top: UI.top(10),
			width: UI.width(300),
			borderColor: '#f4f4f4',
			borderWidth: 0
	    }));
	    
	    var _arrImageView = [];
	    
	    if(productId == undefined) {
	    	for(var _photo in productData.photos) {
	    		var imgProductPhoto = Ti.UI.createImageView({
	    			image: productData.photos[_photo],
	    			width: UI.width(300),
					height: UI.height(280)
	    		});
	    		_arrImageView.push(imgProductPhoto);
	    	}
	    }
	    else if(productData.photos.productImage1 != '') {
	    	productData.isPurchased = productData.isPurchased == 1 ? true : false;
	    	
	    	for(var _photo in productData.photos) {
	    		if(productData.isPurchased) {
		    		var imgProductPhoto = UI.createImageWithTextView({
		    			defaultImage: '/images/common/default-shop-big.jpg',
				    	image: Utils.getFullURL(productData.photos[_photo]),
				    	width: UI.width(300),
				    	height: UI.height(280),
						type: 'sold'
				    });
		    	}
		    	else {
		    		var imgProductPhoto = Ti.UI.createImageView({
		    			defaultImage: '/images/common/default-shop-big.jpg',
						image: Utils.getFullURL(productData.photos[_photo]),
						width: UI.width(300),
						height: UI.height(280)
				    });
		    	}
	    		_arrImageView.push(imgProductPhoto);
	    	}
	    }
	    
	    var scrollableView = Ti.UI.createView({
    		width: UI.width(300),
			height: UI.height(280)
    	});
    	var createProductImagesScrollableView = Ti.UI.createScrollableView({
    		views: _arrImageView,
    		height: Ti.UI.SIZE
    	});
    	if(_arrImageView.length > 1) {
	    	var pageControl = require('/components/pageControl').get({
	    		scrollableView: createProductImagesScrollableView,
	    		backgroundColor: '#000',
	    		bottom: 0,
	    		height: UI.height(30)
	    	});
    	}
    	scrollableView.add(createProductImagesScrollableView);
    	if(_arrImageView.length > 1) {
    		scrollableView.add(pageControl.getView());
    	}
		imgProductView.add(scrollableView);
	    
	    var pricingView = Ti.UI.createView(_style.pricingView);
	    var lblPrice = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
			text: 'Price: ' + (osname=='android'?' ':''),
			font: {
	            fontSize: UI.fontSize(12),
	            fontFamily: constant.FONT.DEFAULT_FONT
	        }
	    }));
	    var lblPriceValue = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
			text: '\u20B9 ' + productData.discountPrice + ' ' + (osname=='android'?'   ':' '),
			font: {
	            fontSize: UI.fontSize(14),
	            fontFamily: constant.FONT.DEFAULT_FONT,
	            // fontWeight: 'bold'
	       }
	    }));
	    var _originalPrice = ' ' + '\u20B9 ' + productData.originalPrice + ' ';
	    // var lblOriginalPriceValue = UI.createStrikeThroughLabel(Utils._.extend({}, _style.priceLabels, {
			// text: _originalPrice,
			// font: {
	            // fontSize: UI.fontSize(14),
	            // fontFamily: constant.FONT.DEFAULT_FONT
	       	// },
	       	// range: {from: 0, to: _originalPrice.length}
	    // }));
	    var lblOriginalPriceView = Ti.UI.createView(Utils._.extend({}, _style.priceLabels, {
	        top: 0,
	        width: Ti.UI.SIZE
	    }));
	    var lblOriginalPrice = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
	        text: _originalPrice,
	        top: 0,
	        width: Ti.UI.SIZE,
			font: {
	            fontSize: UI.fontSize(14),
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

	    var lblDiscount = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
	    	left: UI.left(5),
			text: '  ' + (productData.discountPercentage > 0 ? (productData.discountPercentage % 1 > 0 ? (productData.discountPercentage).toFixed(2) : productData.discountPercentage) : productData.discountPercentage) + '% off ',
			font: {
	            fontSize: UI.fontSize(14),
	            fontFamily: constant.FONT.DEFAULT_FONT
	       	},
	       	color: '#eb5783'
	    }));
	    // pricingView.add(lblPrice);
	    pricingView.add(lblPriceValue);
	    
	    if(productData.originalPrice != '' && productData.originalPrice > 0) {
	    	pricingView.add(lblOriginalPriceView);
	    	pricingView.add(lblDiscount);
	    }
	    
	    var brandView = Ti.UI.createView(_style.pricingView);
	    var lblBrand = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
			text: 'Brand: ' + (osname=='android'?' ':''),
			font: {
	            fontSize: UI.fontSize(14),
	            fontFamily: constant.FONT.DEFAULT_FONT
	        }
	    }));
	    var lblBrandValue = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
			text: _productBrand + (osname=='android'?'  ':''),
			font: {
	            fontSize: UI.fontSize(14),
	            fontFamily: constant.FONT.DEFAULT_FONT
	        }
	    }));
	    var lblLine = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
			text: ' | ' + (osname=='android'?' ':''),
			font: {
	            fontSize: UI.fontSize(14),
	            fontFamily: constant.FONT.DEFAULT_FONT
	        }
	    }));

	    var lblLine2 = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
			text: ' | ' + (osname=='android'?' ':''),
			font: {
	            fontSize: UI.fontSize(14),
	            fontFamily: constant.FONT.DEFAULT_FONT
	        }
	    }));

	    var lblSize = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
			text: (osname=='android'?' ':''),
			font: {
	            fontSize: UI.fontSize(14),
	            fontFamily: constant.FONT.DEFAULT_FONT
	        }
	    }));

	    var lblSizeValue = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
			text: _size,
			font: {
	            fontSize: UI.fontSize(14),
	            fontFamily: constant.FONT.DEFAULT_FONT
	       	}
	       	// color: '#404142'
	    }));

	    var lblSizeCountry = Ti.UI.createLabel(Utils._.extend({},_style.priceLabels,{
	    	text: "UK ",
	    	font: {
	    		fontSize: UI.fontSize(14),
	    		fontFamily: constant.FONT.DEFAULT_FONT
	    	},
	    	// color: '#404142'
	    }));

	    //debug 21/07/2016
	    // var sizeChartClick = UI.createClickableView();
	    var sellDetails = null;

	    var _sizeChartLblClick = function(){
	    	Titanium.API.info(constant.APP + " size chart label clicked");
	    	// UI.showLoginAlert("chart info here");
	    	Ti.API.info(constant.APP + " sizeChart: " + _sizeChart);
	    	modalView = sellDetails.sizeChartView;

	    	// UI.showModal("Size Chart",modalText);
	    	UI.showModal("Size Chart",modalView);
	    };

	    function addSizeChartLabel(){
	    	if(_size !== 'FREE'){
	   	 		brandView.add(lblLine2);
		    
		   	 	// console.log(productData);
		   	 	Ti.API.info(constant.APP + " ########################## brandView width: " + brandView.getWidth() + " platform width: " + UI.platformWidth + " platform height: " + UI.platformHeight);
		    	// Ti.API.info(constant.APP + " ########################## platform width: " + Ti.UI.width + " platform height: " + Ti.UI.height);

		    	productData.productDetailsLaunch = true;

		    	sellDetails = require('/screens/sellDetails').get('productDetails', productData, null);
		    	

		    	var lblClickContainer = Ti.UI.createView({
			    	// backgroundImage: '/images/footer/shop.png',
			    	// text: "Size Chart",
			    	left: 0,
			    	height: Ti.UI.SIZE,
			    	width: Ti.UI.SIZE
			    	// textAlign: 'right'
			    });

			    // var lblImgScale = Ti.UI.createLabel({
			    // 	backgroundImage: "/images/shop/ruler.png",
			    // 	width: UI.width(14),
			    // 	height: UI.height(14),
			    // 	left: 0
			    // });

			    var imgScale = Ti.UI.createImageView({
			    	image: "/images/shop/ruler.png",
			    	width: UI.width(14),
			    	height: UI.height(14),
			    	left: 0
			    });


			    var lblSizeChart = Ti.UI.createLabel(Utils._.extend({},_style.priceLabels,{
			    	text: "Size Chart",
			    	font: {
			    		fontSize: UI.fontSize(14),
			    		fontFamily: constant.FONT.DEFAULT_FONT
			    	},
			    	// left: lblImgScale.width + UI.width(1), imgScale
			    	left: imgScale.width + UI.width(1)
			    }));

			    lblClickContainer.add(imgScale);
			    lblClickContainer.add(lblSizeChart);
			    lblClickContainer.addEventListener('click',_sizeChartLblClick);

		    	// brandView.add(lblSizeChart);
		    	brandView.add(lblClickContainer);
	   	 	}
	    } //end addSizeChartLabel

	    brandView.add(lblBrandValue);

	    function addSizeLabel(){
	    	if(_size){
	    		brandView.add(lblLine);
				if(_sizeChart === 'C'){ //add label UK for shoes
					brandView.add(lblSizeCountry);
				}
				brandView.add(lblSizeValue);
	    	}
	    }

	    if(_sizeChart === 'D'){ //accessories
	    	addSizeLabel();
	    }else if(_sizeChart === 'E'){ //bags
		
			if(_productHeight || _productLength){

				if(!_productHeight){
					_productHeight = 'na';
				}

				if(!_productLength){
					_productLength = 'na';
				}

				productData.customSize = {
					height: _productHeight,
					length: _productLength,
					readOnly: true 
				};
			    addSizeChartLabel();
			}

		}else if(_size) {
			addSizeLabel();
			addSizeChartLabel();		
		}
		
	    var conditionView = Ti.UI.createView(_style.pricingView);
	    var lblCondition = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
			text: 'Condition: ' + (osname=='android'?'  ':''),
			font: {
	            fontSize: UI.fontSize(14),
	            fontFamily: constant.FONT.DEFAULT_FONT
	        }
	    }));

	    var lblConditionValue = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
			text: productData.condition?(productData.condition + (osname=='android'?'  ':'')):'-' + (osname=='android'?'  ':''),
			font: {
	            fontSize: UI.fontSize(14),
	            fontFamily: constant.FONT.DEFAULT_FONT
	       }
	    }));

	    conditionView.add(lblCondition);
	    conditionView.add(lblConditionValue);
	    
	    productData.isAddedToWant = productData.isAddedToWant == 1 || productData.isAddedToWant == true ? true : false;
	    productData.isPurchased = productData.isPurchased == 1 || productData.isPurchased == true ? true : false;
	    productData.isApproved = productData.isApproved == 1 || productData.isApproved == true ? true : false;
		productData.KYC = productData.KYC == 1 || productData.KYC == true ? true : false;

    	var buttonBar = require('/components/buttonBar').get({
			width: UI.width(320),
			// buttons: [{title: 'WANT', selected: productData.isAddedToWant, enabled: !productData.isPurchased && productData.isApproved && productData.userId != Utils.loggedInUserId()}, {title: 'BUY', enabled: productData.KYC && !productData.isPurchased && productData.isApproved && productData.userId != Utils.loggedInUserId()}, {title: 'SHARE', enabled: productData.isApproved}],
			buttons: [{title: 'WANT', selected: productData.isAddedToWant, enabled: !productData.isPurchased && productData.isApproved && productData.userId != Utils.loggedInUserId()}, {title: 'BUY', enabled: true}, {title: 'SHARE', enabled: productData.isApproved}],
			selectable: true
		});
		
		if(productId != undefined) {
			/*
			 * Button bar click callback
			 */
			buttonBar.addEventListener('click', function(e) {
				switch(e.title) {
					case 'WANT':
				    	if(!Utils.isUserLoggedIn()) {
				    		UI.showLoginAlert();
				    		return;
				    	}
				    	
				    	Analytics.trackEvent({
					  		category: "Want (Product View)",
					  		action: "click",
					  		label: ""+productData.productId+"",
					  		value: 1
						});
				    	
						var _requestArgs = {
					        showLoader: true,
					        url: 'stylfile.php',
					        method: 'post',
					        serverArgs: {
					        	action: productData.isAddedToWant ? 'removeFromWant' : 'addToWant',
					            userId: Utils.loggedInUserId(),
					            productId: productData.productId
					        }
					    };
					    
				        HttpClient.getResponse({
				        	requestArgs: _requestArgs,
				        	success: function(response) {
					            if(response.data.status == '1') {
					            	// buttonBar.selectButton(e.index);
					            	productData.isAddedToWant = !productData.isAddedToWant;
					            	
					            	if(!productData.isAddedToWant) {
					            		buttonBar.unselectButton(e.index);
					            	}
					            	
					            	var _message;
					            	if(productData.isAddedToWant) {
					            		_message = 'Product has been successfully added to WANTS.';
					            	}
					            	else {
					            		_message = 'Product has been successfully removed from WANTS.';
					            	}
					            	var alertDialog = UI.createAlertDialog({
						                title: 'SUCCESS', 
						                message: _message
						            });
						            alertDialog.show();
						            alertDialog = null;
					            }
				        	},
				        	error: function(error) {
				        		if(!productData.isAddedToWant) {
				        			buttonBar.unselectButton(e.index);
				        		}
				                var alertDialog = UI.createAlertDialog({
				                    title: error.errorTitle,
				                    message: error.errorMessage
				                });
				                alertDialog.show();
				                alertDialog = null;
				        	}
				    	});
					break;
					
					case 'BUY':
						buttonBar.unselectButton(e.index);
					
						if(!Utils.isUserLoggedIn()) {
				    		UI.showLoginAlert();
				    		return;
				    	}
				    	
				    	var _message;
				    	
				    	if(productData.userId == Utils.loggedInUserId()) {
				    		_message = 'You cannot buy your own product';
				    	}
				    	// else if(!productData.KYC) {
				    		// _message = 'Seller has not filled in the Bank Details';
				    	// }
				    	else if(!productData.isApproved) {
				    		_message = 'Product has not been approved yet';
				    	}
				    	else if(productData.isPurchased) {
				    		_message = 'Product is sold';
				    	}
				    	
				    	if(_message) {
				    		var alertDialog = UI.createAlertDialog({
				                title: constant.ALERT.TITLE.FAUX_PAS, 
				                message: _message
				            });
				            alertDialog.show();
				            alertDialog = null;
				    		return;
				    	}
				    	
				    	Analytics.trackEvent({
					  		category: "Buy (Product View)",
					  		action: "click",
					  		label: ""+productData.productId+"",
					  		value: 1
						});
				    	
				    	// var payU = require('/modules/payU');
				    	// payU.makePayment({
				    		// requestArgs: {
						        // showLoader: true,
						        // method: 'post',
						        // serverArgs: {
						        	// command: 'cod_verify'
						        // }
						    // },
				    		// success: function(response) {
				    			// var ad = UI.createAlertDialog({
				    				// message: response
				    			// });
				    			// ad.show();
				    		// },
				    		// error: function(e) {
				    			// alert('error => ' + e);
				    		// }
				    	// });
				    	// return;
					 	var window = Window.create();
			        	var shippingInfo = require('/screens/shippingInfo').get(tabSelected, {
			        		productTitle: productData.productTitle,
				            productId: productData.productId,
				            buyerId: Utils.loggedInUserId(),
				            sellerId: productData.userId,
				            sellerName: (productData.firstName ? productData.firstName : '') + ' ' + (productData.lastName ? productData.lastName : ''),
				            sellerProfilePic: Utils.getProfileImageURL(productData.profilePicURL),
				            sellerLocation: productData.userLocation,
				            sellerEmail: productData.email,
				            sellingPrice: productData.discountPrice,
				            amount: productData.discountPrice,
				            originalPrice: productData.originalPrice,
				            discount: productData.discountPercentage,
				            size: _size,
				            brand: productData.brand,
				            productImage: Utils.getFullURL(productData.primaryPhoto)
			        	}, function(e) {
			        		Window.closeAll(function() {
			        			if(e.success) {
				        			Utils._.isFunction(callback) && callback({type: 'purchase', success: true, orderNumber: e.orderId});
				        		}
				        		else {
				        			Utils._.isFunction(callback) && callback({type: 'purchase', success: false, errorMessage: e.errorMessage});
				        		}
			        			/*
		        				var _requestArgs = {
							        showLoader: true,
							        url: 'product.php',
							        method: 'post',
							        serverArgs: {
							        	action: 'purchaseProduct',
							            buyerId: Utils.loggedInUserId(),
							            sellerId: e.checkOutDetails.sellerId,
							            productId: e.checkOutDetails.productId,
							            amount: e.checkOutDetails.amount,
							            originalPrice: e.checkOutDetails.originalPrice,
							            discount: e.checkOutDetails.discount,
							            transactionId: e.checkOutDetails.transactionId,
							            payUTransactionId: e.checkOutDetails.mihpayid,
							            type: e.success ? 'success' : 'failure',
							            payUStatus: e.checkOutDetails.unmappedstatus,
							            paymentMode: e.checkOutDetails.mode,
							            cardCategory: e.checkOutDetails.cardCategory,
							            amountDebitedByPayU: e.checkOutDetails.net_amount_debit,
							            pgType: e.checkOutDetails.PG_TYPE,
							            bankRefNumber: e.checkOutDetails.bank_ref_num,
							            bankCode: e.checkOutDetails.bankcode,
							            nameOnCard: e.checkOutDetails.name_on_card,
							            cardNumber: e.checkOutDetails.cardnum,
							            issuingBank: e.checkOutDetails.issuing_bank,
							            cardType: e.checkOutDetails.card_type,
							            errorCode: e.checkOutDetails.error,
							            errorMessage: e.checkOutDetails.error_Message
							        }
							    };
							    
							    for(var _key in e.checkOutDetails.shippingAddress) {
							    	_requestArgs.serverArgs[_key] = e.checkOutDetails.shippingAddress[_key];
							    }
							    
						        HttpClient.getResponse({
						        	requestArgs: _requestArgs,
						        	success: function(response) {
						        		if(e.success) {
						        			Utils._.isFunction(callback) && callback({type: 'purchase', success: true, orderNumber: response.data.orderId});
						        		}
						        		else {
						        			Utils._.isFunction(callback) && callback({type: 'purchase', success: false, errorMessage: e.checkOutDetails.error_Message != '' ? e.checkOutDetails.error_Message : 'An error occurred while performing transaction.'});
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
						    	*/
			        		});
			        	});
				        window.add(shippingInfo.getView());
				        Window.open(window);  
					break;
					
					case 'SHARE':
						Analytics.trackEvent({
					  		category: "Share (Product View)",
					  		action: "click",
					  		label: ""+productData.productId+"",
					  		value: 1
						});
						
						var _shareButtonIndex = e.index;
						var _options = ['WhatsApp', 'Facebook', 'Twitter', 'E-mail', 'SMS'];
				    	var shareOptionsView = require('/components/popOver').get({
				    		width: UI.width(120),
				    		height: UI.height(40 * _options.length),
				    		sourceView: e.source,
				    		options: _options,
				    		borderColor: '#bfbfbf',
				    		borderWidth: 1,
				    		handleOffScreen: true
				    	});
				    	shareOptionsView.show();
				    	shareOptionsView.addEventListener('click', function(e) {
				    		shareOptionsView.hide();
				    		switch(e.index) {
				    			case 0:
				    				Social.shareOnWhatsApp(constant.TEXT.SHARE_TEXT);
				    			break;
				    			
				    			case 1:
				    				var fbShareButton = this;
				    				// UI.disableView(fbShareButton);
				    				// Social.shareOnfacebook(_shareMessage, function(e) {
			    					Social.shareOnfacebook({
			    						link: constant.TEXT.INVITE_LINK, // 'http://stylflip.com/stylflip/productDetails.php?productId=' + productData.productId,
										caption: productData.productTitle,
										description: productData.productDescription,
										picture: Utils.getFullURL(productData.photos.productImage1)
		    						}, function(e) {
				    					if(e.success) {
				    						var alertDialog = UI.createAlertDialog({
					    						title: constant.ALERT.TITLE.SUCCESS,
					    						message: 'Item has been successfully shared on Facebook wall.',
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
				    					UI.enableView(fbShareButton);
				    				});
				    			break;
				    			
				    			case 2:
				    				var twitterShareButton = this;
				    				UI.disableView(twitterShareButton);
				    				Social.shareOnTwitter({
				    					text: constant.TEXT.SHARE_TEXT, 
				    					image: createProductImagesScrollableView.toImage()
			    					}, function(e) {
				    					if(e.success) {
				    						var alertDialog = UI.createAlertDialog({
					    						title: constant.ALERT.TITLE.SUCCESS,
					    						message: 'Item has been successfully shared on Twitter.',
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
				    			
				    			case 3:
				    				Social.shareViaEmail({
				    					subject: 'Check this out on StylFlip',
				    					body: constant.TEXT.SHARE_TEXT,
				    					attachments: [createProductImagesScrollableView.toImage()]
				    				});
				    			break;
				    			
				    			case 4:
				    				Social.shareViaSMS(constant.TEXT.SHARE_TEXT);
				    			break;
				    		}
				    	});
				    	shareOptionsView.addEventListener('hide', function(e) {
				    		buttonBar.unselectButton(_shareButtonIndex);
				    		shareOptionsView = null;
				    	});
					break;
				}
			});			
		}
		
	 	var lblDescription = Ti.UI.createLabel(Utils._.extend({}, _style.lblDescription, {
			text: productData.productDescription == '' ? 'No product description' : productData.productDescription
	    })); 
	    
	    var hrLine = Ti.UI.createView(_commonStyle.hrLine); 
	    
	    productData.isLiked = productData.isLiked=='1'||productData.isLiked==1||productData.isLiked==true?true:false;
		
	    var commentsView = Ti.UI.createView(_style.commentsView);
	    var btnLike = UI.createButton(Utils._.extend({}, _commonStyle.likeButton, {
	    	backgroundImage: productData.isLiked?'/images/common/like-active.png':'/images/common/like.png',
	    	left: 0,
	    	top: 0,
	    	bubbleParent: false,
	    	productId: productData.productId,
	    	isLiked: productData.isLiked
	    }));
	    
	    if(productId != undefined) {
		    btnLike.addEventListener('click', function() {
		    	if(!Utils.isUserLoggedIn()) {
		    		UI.showLoginAlert();
		    		return;
		    	}
		    	
				var likeButton = this;
				
				var _requestArgs = {
			        showLoader: true,
			        url: 'product.php',
			        method: 'post',
			        serverArgs: {
			        	action: likeButton.isLiked?'dislike':'like',
			            userId: Utils.loggedInUserId(),
			            productId: likeButton.productId
			        }
			    };
			    
		        /*
		         * Hit web service
		         */
		        HttpClient.getResponse({
		        	requestArgs: _requestArgs,
		        	success: function(response) {
			            if(response.data.status == '1') {
			            	if(likeButton.backgroundImage == '/images/common/like-active.png') {
			            		likeButton.likesCount.text = parseInt(likeButton.likesCount.text) - 1;
			            		likeButton.backgroundImage = '/images/common/like.png';
					    	}
					    	else {
					    		likeButton.likesCount.text = parseInt(likeButton.likesCount.text) + 1;
					    		likeButton.backgroundImage = '/images/common/like-active.png';
					    	}
					    	likeButton.isLiked = !likeButton.isLiked;
					    	Utils._.isFunction(callback) && callback({type: 'like', isLiked: likeButton.isLiked});
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
		}    
	    
	    productData.likes = parseInt(productData.likes);
	    
	    var lblLikesCount = Ti.UI.createLabel(Utils._.extend({}, _style.lblLikesCount, {
	    	left: UI.left(5),
			text: parseInt(productData.likes) + (productData.isLiked ? 1 : 0)
	    }));
	    
	    btnLike.likesCount = lblLikesCount;
	    
	    productData.isCommented = productData.isCommented=='1'||productData.isCommented==1||productData.isCommented==true?true:false;
	    productData.isTagged = productData.isTagged=='1'||productData.isTagged==1||productData.isTagged==true?true:false;
	    
	    var btnComment = UI.createButton(Utils._.extend({}, _commonStyle.commentButton, {
	    	backgroundImage: productData.isCommented ? '/images/common/comment-active.png' : '/images/common/comment.png',
	    	left: UI.left(10),
	    	top: 0,
	    	bubbleParent: false,
	    	productId: productData.productId
	    }));
	    var lblCommentCount = Ti.UI.createLabel(Utils._.extend({}, _style.lblLikesCount, {
	    	left: UI.left(5),
			text: parseInt(productData.comments?productData.comments:0)
	    }));
	    
	    btnComment.commentsCount = lblCommentCount;
	    
	    var btnTagView = Ti.UI.createView({
	    	left: UI.left(10),
	    	width: Ti.UI.FILL,
	    	height: UI.height(16.5)
	    });
	    var btnTagContainer = Ti.UI.createView({
	    	right: 0,
	    	top: 0,
	    	width: UI.width(30),
	    	height: Ti.UI.FILL
	    });
	    var btnTag = UI.createButton(Utils._.extend({}, _commonStyle.tagButton, {
	    	backgroundImage: productData.isTagged ? '/images/common/tag-active.png' : '/images/common/tag.png',
	    	top: 0,
	    	right: 0
	    }));
	    btnTagContainer.add(btnTag);
	    btnTagView.add(btnTagContainer);
	    
	    if(productId != undefined) {
		    btnTagContainer.addEventListener('click', function() {
		    	if(!Utils.isUserLoggedIn()) {
		    		UI.showLoginAlert();
		    		return;
		    	}
		    	var window = Window.create(exitOnClose=false);
		    	var userProfile = require('/screens/tagFriends').get(tabSelected, productData.productId, productData.userId);
			 	window.add(userProfile.getView());
		        Window.open(window);
		    });
	    
		    btnComment.addEventListener('click', function() {
		    	if(!Utils.isUserLoggedIn()) {
		    		UI.showLoginAlert();
		    		return;
		    	}
		    	
		    	var commentButton = this;
		    	
		    	var commmentsView = require('/screens/comments').get(this.productId, type='product', function(e) {
		    		if(e.type == 'add') {
		    			commentButton.backgroundImage = '/images/common/comment-active.png';
		    			commentButton.commentsCount.text = parseInt(commentButton.commentsCount.text) + 1;
		    			dialogBox.hide();
		    		}
		    		if(e.type == 'delete') {
		    			commentButton.commentsCount.text = parseInt(commentButton.commentsCount.text) - 1;
		    		}
		    	});
		        var dialogBox = UI.createDialogBox({
		        	title: 'Comments',
		        	view: commmentsView.getView()
		        });
		        dialogBox.addEventListener('hide', function() {
		            dialogBox = null;
		            commmentsView.removeFromMemory();
		            commmentsView = null;
		        });
		        dialogBox.show();
		    });
	    }
	    
	    commentsView.add(btnLike);
	    commentsView.add(lblLikesCount);
	    commentsView.add(btnComment);
	    commentsView.add(lblCommentCount);
	    commentsView.add(btnTagView);
	    
    	var checkoutLinksView = Ti.UI.createView({
    		bottom: UI.bottom(10),
    		left: UI.left(10),
    		right: UI.right(10),
    		height: Ti.UI.SIZE,
    		layout: 'vertical'
    	});
    	var btnStylFilePromiseLink = UI.createButton(Utils._.extend({}, _commonStyle.smallButton, {
    		title: 'The StylFlip Promise',
    		left: 0,
    		width: Ti.UI.SIZE,
    		font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
    		color: '#ef4e6d'
	    }));
    	var btnReturnPolicyLink = UI.createButton(Utils._.extend({}, _commonStyle.smallButton, {
    		title: 'The Returns and Cancellations Policy',
    		left: 0,
    		width: Ti.UI.SIZE,
    		font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
    		color: '#ef4e6d'
	    }));
	    checkoutLinksView.add(btnStylFilePromiseLink);
	    checkoutLinksView.add(btnReturnPolicyLink);
	    
	    btnStylFilePromiseLink.addEventListener('click', function() {
	    	Analytics.trackEvent({
		  		category: "StylFlip Promise (Product View)",
		  		action: "click",
		  		label: "",
		  		value: 1
			});
	    	var window = Window.create(exitOnClose=false, false, disableClick=true);
			var termDetails = require('/screens/termDetails').get('StylFlip Promise', constant.DOMAIN + 'htmls/stylFlipPromise.htm', true);
	        window.add(termDetails.getView());
	        Window.open(window); 
	    });
	    
	    btnReturnPolicyLink.addEventListener('click', function() {
	    	Analytics.trackEvent({
		  		category: "Returns and Cancellations Policy (Product View)",
		  		action: "click",
		  		label: "",
		  		value: 1
			});
	    	var window = Window.create(exitOnClose=false, false, disableClick=true);
			var termDetails = require('/screens/termDetails').get('Return Policy', constant.DOMAIN + 'htmls/returnsAndCancellationsPolicy.htm', true);
	        window.add(termDetails.getView());
	        Window.open(window); 
	    });
	    
	    contentView.add(profileView);
	    contentView.add(lblStatus);
	    contentView.add(imgProductView);
	    contentView.add(pricingView);
	    contentView.add(brandView);
	    contentView.add(conditionView);
	    contentView.add(buttonBar.getView());
	    contentView.add(lblDescription);
	    contentView.add(hrLine);
	    contentView.add(commentsView);
	    contentView.add(checkoutLinksView);    	
    }; //end _loadProductDetails
    
    
    if(productId != undefined) {
    	Ti.API.info(constant.APP + " ############ FOUND VALID PRODUCTID ###############"); 
    	var _getProductDetails = function() {
    		contentView.removeAllChildren();
    		
    		var _requestArgs = {
		        showLoader: true,
		        url: 'product.php',
		        method: 'post',
		        serverArgs: {
		        	action: 'viewProductDetails',
		           	productId: productId,
		           	userId: Utils.loggedInUserId()
		        }
		    };
		    
		    /*
		     * Hit web service
		     */
		    HttpClient.getResponse({
		    	requestArgs: _requestArgs,
		    	success: function(response) {
		    		if(response.data[0]) {
		    			_loadProductDetails(response.data[0]);
		    		}
		    		else {
		    			var alertDialog = UI.createAlertDialog({
					    	title: 'OOPS!',
					    	message: 'Item might have been removed'
					    });
					    alertDialog.show();
					    alertDialog = null;
		    		}
		            Utils.resetPushItemId();
		    	},
		    	error: function(error) {
		            contentView.add(UI.createErrorView(error.errorMessage, function() {
	               		_getProductDetails();
	               	}));
		    	}
		    });    	
    	};
    	_getProductDetails();
    }
    else {
    	_loadProductDetails(productData);
    }
    
    
    Window.getCurrentWindow().addEventListener('close', function() {
    	_removeFromMemory();
    });
    
    
    var _hideBackButton = function() {
    	header.hideBackButton();
    };
	
    var _getView = function() {
        return mainView;
    };
    
    // var _clearSizeChartFlags = function(){
    // 	Ti.API.info(constant.APP + " ############### clearing size chart flags ###########"); 
    // 	UI.openingModal = false;
    // 	UI.modalWindowOpen = false;
    // };

    // mainView.addEventListener('android:back',_clearSizeChartFlags);

    var _removeFromMemory = function() {
    	_style = null;
    	// mainView.removeEventListener('android:back',_clearSizeChartFlags);
        Window.clearMemory(mainView);
        mainView = null;
        _getView = null;
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        hideBackButton: _hideBackButton,
        removeFromMemory: _removeFromMemory
    };
};

