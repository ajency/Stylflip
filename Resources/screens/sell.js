exports.get = function(tabSelected, wardrobeData, productData) {
	var _style = require('/styles/sell').get();
	
	// var _productDetails;
	var _productDetails = {};
	var _productImages = [];
	var _lastPlusButtonClickedIndex = 0;
	
	var mainView = Ti.UI.createScrollView(Utils._.extend({}, _style.contentScrollView, {
		layout: 'absolute',
		showVerticalScrollIndicator: false
    })); 
    if(productData && productData.data != undefined) {
    	_productDetails = productData.data;
    	if(_productDetails.sizeChart == 'E') {
    		_productDetails.customSize = {
    			height: productData.data.height,
    			length: productData.data.length
    		};
    	}
    	_productDetails.toBeDonated = _productDetails.isToBeDonated;
    }
    
    if(wardrobeData != undefined || productData != undefined) {
    	mainView.layout = 'vertical';
	   	var header = require('/components/header').get({
			showMenu: false,
	    	enableButtons: false,
	    	enableBackButton: true
		});
	    var contentView = Ti.UI.createScrollView(Utils._.extend({}, _commonStyle.contentScrollView, {
	    	top: 0,
	    	bottom: 0,
	        layout: 'vertical'
	    }));
    }
    
    var sellView = Ti.UI.createView(_style.mainView); 
    
    if(wardrobeData != undefined || productData != undefined) {
    	var footer = require('/components/footer').get(defaultSelectedTab=tabSelected, subTab=true);
    }
	
	if(wardrobeData != undefined || productData != undefined) {
		contentView.add(sellView);
		
		mainView.add(header.getView());
		mainView.add(contentView);
		mainView.add(footer.getView());
	}
	else {
		mainView.add(sellView);
	}
	
	
	var productImagesView = Ti.UI.createView(_style.productImagesView);
	productImagesView.primary = true;
	
	var primaryImageView = UI.createClickableView(_style.primaryImageView);
	var primaryImage = Ti.UI.createImageView(_style.productImage);
	var btnAddPrimary = Ti.UI.createLabel(Utils._.extend({}, _style.btnAddImage, {
		text: 'Your\nCovershot',
		font: {
            fontSize: UI.fontSize(13),
            fontFamily: constant.FONT.DEFAULT_FONT,
            fontWeight: 'bold'
        }
    }));
	primaryImageView.add(primaryImage);
	primaryImageView.add(btnAddPrimary);
	
	var secondaryImageView1 = UI.createClickableView(Utils._.extend({}, _style.secondaryImageView, {
		left: UI.left(140),
        top: UI.top(5)
    }));
    var secondaryImage1 = Ti.UI.createImageView(_style.productImage);
	var btnAddSecondary1 = Ti.UI.createLabel(Utils._.extend({}, _style.btnAddImage, {
		text: 'Product\nFront'
    }));
	secondaryImageView1.add(secondaryImage1);
	secondaryImageView1.add(btnAddSecondary1);
	
	var secondaryImageView2 = UI.createClickableView(Utils._.extend({}, _style.secondaryImageView, {
		left: UI.left(210),
        top: UI.top(5)
    }));
    var secondaryImage2 = Ti.UI.createImageView(_style.productImage);
	var btnAddSecondary2 = Ti.UI.createLabel(Utils._.extend({}, _style.btnAddImage, {
		text: 'Product\nDetail'
    }));
	secondaryImageView2.add(secondaryImage2);
	secondaryImageView2.add(btnAddSecondary2);
	
	var secondaryImageView3 = UI.createClickableView(Utils._.extend({}, _style.secondaryImageView, {
		left: UI.left(140),
        top: UI.top(75)
    }));
	var secondaryImage3 = Ti.UI.createImageView(_style.productImage);
	var btnAddSecondary3 = Ti.UI.createLabel(Utils._.extend({}, _style.btnAddImage, {
		text: 'Product\nBack'
    }));
	secondaryImageView3.add(secondaryImage3);
	secondaryImageView3.add(btnAddSecondary3);
	
	var secondaryImageView4 = UI.createClickableView(Utils._.extend({}, _style.secondaryImageView, {
		left: UI.left(210),
        top: UI.top(75)
    }));
    var secondaryImage4 = Ti.UI.createImageView(_style.productImage);
	var btnAddSecondary4 = Ti.UI.createLabel(Utils._.extend({}, _style.btnAddImage, {
		text: 'Product Label'
    }));
	secondaryImageView4.add(secondaryImage4);
	secondaryImageView4.add(btnAddSecondary4);
	
	productImagesView.add(primaryImageView);
	productImagesView.add(secondaryImageView1);
	productImagesView.add(secondaryImageView2);
	productImagesView.add(secondaryImageView3);
	productImagesView.add(secondaryImageView4);
	
	var lblCoverShotText = Ti.UI.createLabel(_style.lblCoverShotText);
	
	
	var btnAddProductDetails = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: '+ DETAILS',
        top: UI.top(30),
        height: Ti.UI.SIZE
    }));
    
    var btnView = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: 'VIEW',
        top: UI.top(15),
        color: '#e0e0e0'
    }));
    
    var btnSubmit = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: 'SUBMIT',
        top: UI.top(15),
        color: '#e0e0e0'
    }));
    
    var btnRemove = UI.createButton(Utils._.extend({}, _commonStyle.smallButton, {
        title: 'Remove X',
        width: Ti.UI.SIZE,
        top: UI.top(15),
        bottom: UI.bottom(15),
        color: '#e0e0e0'
    }));
    
    UI.disableButton(btnAddProductDetails);
    UI.disableButton(btnView);
	UI.disableButton(btnSubmit);
	UI.disableButton(btnRemove);
    
	sellView.add(productImagesView);
	sellView.add(lblCoverShotText);
	sellView.add(btnAddProductDetails);
	sellView.add(btnView);
	sellView.add(btnSubmit);
	sellView.add(btnRemove);
	
	
	/*
	 * Product's secondary images handler
	 */
	var _addImagesToPlaceholders = function(e, view) {
		var _doesImageExist = false;
		for(var i=0; i<_productImages.length; i++) {
			if(_productImages[i].index == view.index) {
				_doesImageExist = true;
				break;
			}
		}
		if(!_doesImageExist) {
			_productImages.push({
				image: e.image,
				index: view.index,
				toBeDeleted: true
			});
		}
		else {
			_productImages[view.index].image = e.image;
		}
		view.children[0].image = e.image;
		view.children[1].visible = false;
		if(view.index == 0) {
			UI.enableButton(btnAddProductDetails);
			UI.enableButton(btnRemove, {color: '#828282'});
		}
		if(view.index < _arrImageViews.length - 1) {
			UI.enableButton(_arrImageViews[view.index+1], {backgroundColor: '#80a5ab'});
		}
	};
	
	
	/*
	 * Add Image button click handler
	 */
	var _arrImageViews = [primaryImageView, secondaryImageView1, secondaryImageView2, secondaryImageView3, secondaryImageView4];
	for(var i=0; i<_arrImageViews.length; i++) {
		_arrImageViews[i].index = i;
		_arrImageViews[i].addEventListener('click', function() {
			if(this.index > 0) {
				Analytics.trackEvent({
			  		category: "Image " + this.index + " (Sell)",
			  		action: "click",
			  		label: "",
			  		value: 1
				});
			}
			
			_lastPlusButtonClickedIndex = this.index;
			var _arrButtonOptions = ['TAKE PHOTO', 'CHOOSE FROM GALLERY'];
			if(this.children[0].image) {
				_arrButtonOptions.push('REMOVE');
			}
			_takeOrChoosePicture(_arrButtonOptions);
		});
		if(i > 0) {
			UI.disableButton(_arrImageViews[i], {backgroundColor: '#dedede'});
		}
	}
	
    
	var _updateProductDetails = function(updateVars){
		Ti.API.info(constant.APP + "_updateProductDetails call " + updateVars);
		_productDetails = updateVars;
	};

    /*
     * DETAILS button click handler
     */
    btnAddProductDetails.addEventListener('click', function() {
        var window = Window.create();
        // var window = Window.create(null,null,null,Window.sellDetailsSlugs);

        var sellDetails = require('/screens/sellDetails').get(tabSelected!=undefined?tabSelected:'sell', _productDetails, function(e) {
        	//	DONE button click handler
        	if(e.saveAddresses) {
        		_productDetails = {};
        		_productDetails.userAddresses = e.userAddresses;
        		return;
        	}

        	// _productDetails = e;
        	_updateProductDetails(e);

        	UI.enableButton(btnView);
        	UI.enableButton(btnSubmit);
        	UI.enableButton(btnRemove, {color: '#828282'});
        },_updateProductDetails);

        window.add(sellDetails.getView());
        Window.open(window);  
    });
    
    
    /*
     * VIEW button click handler
     */
    btnView.addEventListener('click', function() {
	    // var _productDataToDisplay = {
	    // 	productTitle: _productDetails.productTitle,
	    // 	productDescription: _productDetails.productDescription,
     //    	profilePicURL: '',
     //    	username: 'Username',
     //    	timestamp: 'Just now',
     //    	userLocation: 'Navi Mumbai',
     //    	discountPrice: _productDetails.discountPrice,
     //    	sellingPrice: _productDetails.sellingPrice,
     //    	originalPrice: _productDetails.originalPrice,
     //    	discountPercentage: _productDetails.discountPercentage,
     //    	condition: _productDetails.condition,
     //    	brand: _productDetails.brandName,
     //    	size: _productDetails.size,
     //    	likes: 0
	    // };

	    var _productDataToDisplay = _productDetails;
	    _productDataToDisplay.brand = _productDetails.brandName
	    _productDetails.likes = '0';
	    _productDetails.username = 'Username';
        _productDetails.timestamp = 'Just now';	
	    
	    if(_productImages.length > 0) {
	    	_productDataToDisplay.photos = {};
	    	var _secondaryImagesCounter = 1;
	    	for(var i=0; i<_productImages.length; i++) {
		    	if(_productImages[i].index == 0) {
		    		_productDataToDisplay.photos.productImage1 = _productImages[i].image;
		    	}
		    	else {
		    		_secondaryImagesCounter++;
		    		_productDataToDisplay.photos['productImage'+_secondaryImagesCounter] = _productImages[i].image;
		    	}
			}
	    }
	        	
        var window = Window.create(exitOnClose=false);
        var productDetailsScreen = require('/screens/productDetails').get(tabSelected!=undefined?tabSelected:'sell', undefined, undefined, undefined, _productDataToDisplay);
        window.add(productDetailsScreen.getView());
        Window.open(window);
    });
    
    
    /*
     * SUBMIT button click handler
     */
    btnSubmit.addEventListener('click', function() {
		if(!_arrImageViews[0].children[0].image) {
			var alertDialog = UI.createAlertDialog({
                title: constant.ALERT.TITLE.FAUX_PAS, 
                message: 'Please add primary image'
            });
            alertDialog.show();
            alertDialog = null;
            return;
		}
		
		var alertDialog = UI.createAlertDialog({
            title: 'Alert!', 
            // message: 'I agree to StylFlip’s Terms and Conditions',
            options: ["I agree to StylFlip’s Terms and Conditions"],
            type: 'checkbox',
            dismissOnPositive: false,
            buttonNames: ['YES']
        });
        alertDialog.show();
        alertDialog.addEventListener('click', function(e) {
        	if(e.selectedOption.length > 0) {
        		alertDialog.hide();
        		alertDialog = null;
        		
        		var _requestArgs = {
			        showLoader: true,
			        url: 'product.php',
			        method: 'post',
		        	serverArgs: {
			        	action: productData == undefined ? 'create' : 'updateProductDetails',
			        	userId: Utils.loggedInUserId(),
			        	productTitle: _productDetails.productTitle,
			        	productDescription: _productDetails.productDescription,
			        	categoryId: _productDetails.categoryId,
			        	subcategoryId: _productDetails.subcategoryId == undefined ? 0 : _productDetails.subcategoryId,
			        	sellingPrice: _productDetails.sellingPrice,
			        	originalPrice: _productDetails.originalPrice,
			        	discountPrice: _productDetails.discountPrice,
			        	discountPercentage: _productDetails.discountPercentage,
			        	condition: _productDetails.condition,
			        	brandId: _productDetails.brandId,
			        	size: _productDetails.size,
			        	sizeChart: _productDetails.sizeChart,
			        	toBeDonated: _productDetails.toBeDonated,
			        	pickupFrom: _productDetails.pickupFrom
			        }
			    };
			    
			    if(_productDetails.sizeChart == 'E') {	//	E is custom size chart
			    	for(var key in _productDetails.customSize) {
			    		_requestArgs.serverArgs[key] = _productDetails.customSize[key];
			    	}
			    }
			    
			    if(productData != undefined) {
			    	_requestArgs.serverArgs.productId = productData.data.productId;
			    }
			    
			    /*
			     * Check and add images to serverArgs
			     */
			    var _secondaryImagesCounter = 1;
			    for(var i=0; i<_productImages.length; i++) {
			    	if(_productImages[i].index == 0) {
			    		_requestArgs.serverArgs.productImage1 = _productImages[i].image;
			    	}
			    	else {
			    		_secondaryImagesCounter++;
			    		_requestArgs.serverArgs['productImage'+_secondaryImagesCounter] = _productImages[i].image;
			    	}
				}
				
		        /*
		         * Hit web service
		         */
		        HttpClient.getResponse({
		        	requestArgs: _requestArgs,
		        	success: function(response) {
		        		if(wardrobeData == undefined && productData == undefined) {
		        			var _title, _message;
		        			if(response.data.KYC == true) {
		        				_title = constant.ALERT.TITLE.CONGRATULATIONS;
		        				_message = 'Your item has been successfully submitted for listing. We will notify you as soon as it is approved and on our store.';
		        			}
		        			else {
		        				_title = constant.ALERT.TITLE.WARDROBE_MALFUNCTION;
		        				// _message = 'Your Bank Details are incomplete without which we cannot list your item. Complete your Bank Details now?';
		        				_message = "Your bank details are incomplete, We can still list your product but won't be able to process your payment in case the product is sold. Complete your bank details now?";
		        			}
		        			var alertDialog = UI.createAlertDialog({
				                title: _title,
				                message: _message
				            });
				            alertDialog.show();
				            alertDialog = null;
		        		}
			            
			            // _productDetails = undefined;
			            _productDetails = {};
			            
			            /*
			             * Remove images from serverArgs
			             */
						for(var i=0; i<_arrImageViews.length; i++) {
							_arrImageViews[i].children[0].image = null;
							_arrImageViews[i].children[1].visible = true;
						}
						var _secondaryImagesCounter = 1;
						for(var i=0; i<_productImages.length; i++) {
							if(_productImages[i].index == 0) {
					    		_requestArgs.serverArgs.productImage1 = null;
					    	}
					    	else {
					    		_secondaryImagesCounter++;
					    		_requestArgs.serverArgs['productImage'+_secondaryImagesCounter] = null;
					    	}
						}
						_productImages = [];
			            
			            UI.disableButton(btnAddProductDetails);
			        	UI.disableButton(btnView);
			        	UI.disableButton(btnSubmit);
			        	UI.disableButton(btnRemove);
			        	
			        	/*
			        	 * Disable all secondary image views
			        	 */
			        	for(var i=1; i<_arrImageViews.length; i++) {
							UI.disableButton(_arrImageViews[i], {backgroundColor: '#dedede'});
						}
			        	
			        	if(wardrobeData != undefined) {
			        		wardrobeData.onMovedToShop();
			        	}
			        	
			        	if(productData != undefined) {
			        		productData.onUpdate();
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
        	else {
        		var errorAlertDialog = UI.createAlertDialog({
		            title: 'Alert!', 
		            message: 'Please agree to our terms and conditions to submit your listing successfully.'    
	            });
		        errorAlertDialog.show();
		        errorAlertDialog = null;
        	}
        });
    });


	/*
	 * 	'Remove X' button click handler
	 */
	btnRemove.addEventListener('click', function() {
		var alertDialog = UI.createAlertDialog({
			title: constant.ALERT.TITLE.CONFIRM_REMOVAL,
			message: 'Are you sure you want to cancel listing your item?',
			buttonNames: ['YES', 'NO']
		});
		alertDialog.show();
		alertDialog.addEventListener('click', function(e) {
			if(e.index == 0) {
				// _productDetails = undefined;
				_productDetails = {};
				for(var i=0; i<_arrImageViews.length; i++) {
					_arrImageViews[i].children[0].image = null;
					_arrImageViews[i].children[1].visible = true;
				}
				for(var i=0; i<_productImages.length; i++) {
					_productImages[i].image = null;
				}
				_productImages = [];
				UI.disableButton(btnAddProductDetails);
				UI.disableButton(btnView);
	        	UI.disableButton(btnSubmit);
	        	UI.disableButton(btnRemove);
	        	
	        	/*
	        	 * Disable all secondary image views
	        	 */
	        	for(var i=1; i<_arrImageViews.length; i++) {
					UI.disableButton(_arrImageViews[i], {backgroundColor: '#dedede'});
				}
	        	
	        	if(wardrobeData != undefined || productData != undefined) {
	        		Window.getCurrentWindow().close();
	        	}
			}
			alertDialog = null;
		});
	});
	
	/*
	 * Choose or take picture
	 */
	var tapBusy = false;
	var _takeOrChoosePicture = function(_arrButtonOptions) {
		if(tapBusy) return;

		tapBusy = true;
		setTimeout(function(){
			tapBusy = false;
		},1000);

		var buttonBarView = UI.createButtonBarView({
    		buttonNames: _arrButtonOptions
    	});
    	buttonBarView.show();
    	buttonBarView.addEventListener('click', function(e) {
    		Ti.API.info(constant.APP + " ####################### _takeOrChoosePicture buttonBar clicked ######################");
    		switch(e.index) {
    			case 0: 
			        _openCamera();
    			break;
    			
    			case 1: 
			        _openGallery();
    			break;
    			
    			case 2: 
	    			_arrImageViews[_lastPlusButtonClickedIndex].children[0].image = null;
	    			_arrImageViews[_lastPlusButtonClickedIndex].children[1].visible = true;
	    			for(var i=0; i<_productImages.length; i++) {
	    				if(_lastPlusButtonClickedIndex == _productImages[i].index) {
	    					_productImages.splice(i, 1);
	    					if(i == 0) {
	    						UI.disableButton(btnAddProductDetails);
	    						// var _noImageCounter = 0;
	    						// for(var j=1; j<_arrImageViews.length; j++) {
	    							// if(!_arrImageViews[j].children[0].image) {
	    								// if(_noImageCounter > 0) {
	    									// UI.disableButton(_arrImageViews[j], {backgroundColor: '#dedede'});
	    								// }
	    								// _noImageCounter++;
									// }
	    						// }
	    					}
	    					break;
	    				}
	    			}
    			break;
    		}
    	});
	};


	/*
	 * Camera functionality
	 */
	var _openCamera = function() {
		var alertDialog = UI.createAlertDialog({
			title: 'Image Format',
			message: 'The preferred image format is jpg, png of a size upto 2 MB',
			buttonNames: ['GOT IT']
		});
		alertDialog.show();
		alertDialog.addEventListener('click', function() {
			ImageEditor.takePhoto(function(e) {
		    	if(e.success) {
		    		_addImagesToPlaceholders(e, _arrImageViews[_lastPlusButtonClickedIndex]);
		    	}
		    	else {
					var alertDialog = UI.createAlertDialog({
		                title: constant.ALERT.TITLE.FAUX_PAS, 
		                message: e.errorMessage
		            });
		            alertDialog.show();
		            alertDialog = null;
				}
		    });
		    alertDialog = null;
		});
	};
    
    var _openGallery = function() {
	    var alertDialog = UI.createAlertDialog({
			title: 'Image Format',
			message: 'The preferred image format is jpg, png of a size upto 2 MB',
			buttonNames: ['GOT IT']
		});
		alertDialog.show();
		alertDialog.addEventListener('click', function() {
			ImageEditor.browsePhotoGallery(function(e) {
				if(e.success) {
					_addImagesToPlaceholders(e, _arrImageViews[_lastPlusButtonClickedIndex]);
				}
				else {
					var alertDialog = UI.createAlertDialog({
		                title: constant.ALERT.TITLE.FAUX_PAS, 
		                message: e.errorMessage
		            });
		            alertDialog.show();
		            alertDialog = null;
				}
		    });
		    alertDialog = null;
		});
    };
    
    
    if(wardrobeData == undefined && productData == undefined) {
    	var _arrButtonOptions = ['TAKE PHOTO', 'CHOOSE FROM GALLERY'];
		_takeOrChoosePicture(_arrButtonOptions);
    }
	
	
	if(wardrobeData != undefined) {
		_addImagesToPlaceholders({image: wardrobeData.image}, _arrImageViews[0]);
	}
	
	if(productData && productData.data != undefined) {
    	for(var i=0; i<5; i++) {
    		if(productData.data.photos.hasOwnProperty('productImage'+(i+1))) {
    			_addImagesToPlaceholders({image: Utils.getFullURL(productData.data.photos['productImage'+(i+1)])}, _arrImageViews[i]);
    		}
    	}	
    	UI.enableButton(btnView);
    	UI.enableButton(btnSubmit);
    	UI.enableButton(btnRemove, {color: '#828282'});
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

